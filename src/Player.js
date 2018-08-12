const movementSounds = [{
        src: "sounds/step_dirt.wav",
        playbackRate: 1,
        volume: .15,
        tileTypes: [TileTypes.GROUND, TileTypes.PATH]
    }, {
        src: "sounds/step_dirt2.wav",
        playbackRate: 1,
        volume: .15,
        tileTypes: [TileTypes.GROUND, TileTypes.PATH]
    }, {
        src: "sounds/step_dirt3.wav",
        playbackRate: 1,
        volume: .15,
        tileTypes: [TileTypes.GROUND, TileTypes.PATH]
    }, {
        src: "sounds/step_dirt4.wav",
        playbackRate: 1,
        volume: .15,
        tileTypes: [TileTypes.GROUND, TileTypes.PATH]
    }, {
        src: "sounds/step_stone.wav",
        playbackRate: .8,
        volume: .3,
        tileTypes: [TileTypes.STONE]
    }, {
        src: "sounds/step_stone3.wav",
        playbackRate: .8,
        volume: .6,
        tileTypes: [TileTypes.STONE]
}];

const draggingSounds =  [{
        src: "sounds/player_drag.wav",
        playbackRate: 1.6,
        volume: 0.6
    }, {
        src: "sounds/player_drag3.wav",
        playbackRate: 2.3,
        volume: 0.6
}]

const digSound = {
    src: "sounds/player_dig.wav",
    playbackRate: 1,
    volume: 0.2
}

const treeFallingSound = {
    src: "sounds/tree_falling.wav",
    playbackRate: 1,
    volume: 0.5
}

const cuttingTreeSounds = {
    src: "sounds/player_cut_tree2.wav",
    playbackRate: 1,
    volume: 0.2
};

const PlayerActions = {
    NONE: 0,
    PULL: 1,
    DIG: 2,
    CUT: 3,
    PATH: 4,
    FILL: 5
}

var testSpeedWalkFactor = 2;
var testSpeedFactor = 5;
var playerActions = [
    { duration: 0, move: true },
    { duration: 0, move: true },
    { duration: 3000 / testSpeedFactor, move: false },
    { duration: 5000 / testSpeedFactor, move: false },
    { duration: 1200 / testSpeedFactor, move: false },
    { duration: 5000 / testSpeedFactor, move: false }
];

function Player(position) {
    Character.call(this, position);
    this.ePressed = false;
    this.pulling = null;
    this.targetDirection = [1, 0];
    this.targetPosition = [0, 0];
    this.targetTile = null;

    this.loadNamedSounds(draggingSounds, "dragSound");
    this.loadNamedSounds(digSound, "digSound");
    this.loadNamedSounds(cuttingTreeSounds, "cutTreeSound");
    this.loadNamedSounds(treeFallingSound, "treeFallingSound");
    this.loadNamedSounds(movementSounds, "movementSound");

    // Actions such as digging or cutting a tree
    this.action = PlayerActions.NONE;
    this.actionStarted = 0;
    this.actionDuration = 1000;
}
inherit(Player, Character);

Player.prototype.VELOCITY = 0.0027 * testSpeedWalkFactor;
Player.prototype.PULL_DISTANCE = 0.7;

Player.load = function() {
    Player.sprite = loader.loadImage("img/character/characteranimation2.png", 4);
    Player.fightSprite = loader.loadImage("img/character/char fight.png", 4);
    Player.dragSprite = loader.loadImage("img/character/char drag.png", 4);
    Player.digSprite = loader.loadImage("img/character/char digging.png", 4);
};

Player.update = function() {
    // Check time of day for new day
    var threshold = 0.2;
    if (state.dayTime % 1 >= threshold && state.lastDayTime % 1 < threshold) {
        SoundManager.play("daybreak", 1);
    }
};

Player.prototype.update = function(delta) {
    // Set Velocity based on State (inserted by keyHandler)
    var keys = state.keyStates;
    var vx = 0, vy = 0;
    // Only move when no prohibiting action is active, and when player is not currently in shop
    if (playerActions[this.action].move && !state.shopOpen) {
        var vx = ((keys.ArrowRight || keys.d ? 1 : 0) - (keys.ArrowLeft || keys.a ? 1 : 0));
        var vy = ((keys.ArrowDown || keys.s ? 1 : 0) - (keys.ArrowUp || keys.w ? 1 : 0));
    }

    // play movement soubnd
    if (keys.w || keys.a || keys.d || keys.s || keys.ArrowDown || keys.ArrowLeft || keys.ArrowRight || keys.ArrowUp) {
        this.movementSound.trigger();
    }

    // set velocity basedon underground
    let velocity = this.VELOCITY; 
    if (this.tile) {
        var tile = state.map.getTile(this.tile[0], this.tile[1]);
        if (tile.type == TileTypes.PATH) {
            velocity *= 1.3;
        }
    }
    // also based on boots upgrade
    if (state.unlocks.boots) {
        velocity *= 1.5;
    }
    // Normalize
    if (vx || vy) {
        var length = Math.sqrt(vx * vx + vy * vy);
        this.velocity[0] = vx * velocity / length;
        this.velocity[1] = vy * velocity / length;
        if (this.velocity[0]) {
            this.targetDirection = [this.velocity[0] > 0 ? 1 : -1, 0];
        } else {
            this.targetDirection = [0, this.velocity[1] > 0 ? 1 : -1];
        }
    } else {
        this.velocity[0] = this.velocity[1] = 0;
    }

    // E pressed?
    var prev = this.ePressed;
    this.ePressed = keys.e;
    if (this.ePressed && !prev) {
        this.actionStarted = state.time;
        // E was pressed just now, try to drag corpse
        if (this.pulling) {
            // Check if dropped on grave
            if (this.targetTile && this.targetTile.type == TileTypes.GRAVE && this.targetTile.reference.empty) {
                this.targetTile.reference.takeCorpse(this.pulling);
                SoundManager.play("burial", 0.5);
            }
            // Abort pull action
            this.pulling = null;
            this.action = PlayerActions.NONE;
        } else {
            // Open Shop?
            if (state.readyToShop) {
                state.shopOpen = true;
            } else {
                // Pick corpse based on point in front of player (between player and target tile)
                var pickx = 0.5 * (this.targetPosition[0] + 0.5 + this.position[0]);
                var picky = 0.5 * (this.targetPosition[1] + 0.5 + this.position[1]);
                var corpse = Player.getNearestCorpse(pickx, picky, 1);
                if (corpse) {
                    this.pulling = corpse;
                    this.action = PlayerActions.PULL;
                    SoundManager.play("dragging", 0.4);
                } else {
                    // Other action
                    var tile = this.targetTile;
                    if (tile) {
                        if (tile.type == TileTypes.TREE) {
                            // Cut Tree
                            this.cutTreeSound.trigger();
                            this.action = PlayerActions.CUT;
                        } else if (tile.type == TileTypes.GROUND) {
                            // Path
                            this.action = PlayerActions.PATH;
                            this.digSound.trigger();
                            if (tile.decoImage) {
                                SoundManager.play("obstacles", 0.25);
                            }
                        } else if (tile.type == TileTypes.PATH) {
                            // Dig
                            this.action = PlayerActions.DIG;
                            this.digSound.trigger();
                            SoundManager.play("digging", 0.15);
                        } else if (tile.type == TileTypes.HOLE || tile.type == TileTypes.GRAVE) {
                            if (tile.type == TileTypes.HOLE || tile.reference && tile.reference.empty) {
                                this.action = PlayerActions.FILL;
                                this.digSound.trigger();
                            }
                        } else if (tile.type == TileTypes.FENCE || tile.type == TileTypes.FENCE_SIDE
                                    || tile.type == TileType.STONE_FENCE || tile.type == TileType.STONE_FENCE_SIDE) {
                                        this.cutTreeSound.trigger();
                                    }
                    }
                }
            }
        }
        this.actionDuration = playerActions[this.action].duration;
    } else if (!this.ePressed && this.action > 0 && !playerActions[this.action].move) {
        // e released during blocking action -> abort action
        this.action = PlayerActions.NONE;
    } else if (this.ePressed && prev && this.action > 0 && !playerActions[this.action].move) {
        // During action, check if ready
        if (this.action === PlayerActions.DIG) {
            this.digSound.trigger();
        }
        if (this.action === PlayerActions.CUT) {
            this.cutTreeSound.trigger();
        }
        var tile = this.targetTile;
        if (state.time >= this.actionStarted + this.actionDuration && tile) {
            // Conclude action
            switch (this.action) {
                case PlayerActions.CUT:
                    state.map.set(tile.x, tile.y, TileTypes.GROUND);
                    this.treeFallingSound.trigger();
                    break;
                case PlayerActions.PATH:
                    if (tile.decoImage) {
                        tile.decoImage = null;
                    } else {
                        state.map.set(tile.x, tile.y, TileTypes.PATH);
                    }
                    break;
                case PlayerActions.DIG:
                    state.map.set(tile.x, tile.y, TileTypes.HOLE);
                    break;
                case PlayerActions.FILL:
                    if (tile.type == TileTypes.HOLE) {
                        // Just set back to path
                        state.map.set(tile.x, tile.y, TileTypes.PATH);
                    } else {
                        // Grave
                        var grave = tile.reference;
                        grave.remove();
                    }
            }
            this.action = PlayerActions.NONE;
            this.actionStarted = state.time;
            this.actionDuration = 0;
        }
    }

    // Pulling corpse
    if (this.pulling) {
        Player.pullCorpse(this.pulling, this.position[0], this.position[1], this.PULL_DISTANCE);
        var moving = (this.velocity[0] || this.velocity[1]);
      if (moving) {
          this.dragSound.trigger();
      }
    } 
    Character.prototype.update.call(this, delta);

    // Target tile
    this.targetPosition = [ Math.floor(this.position[0]) + this.targetDirection[0],
        Math.floor(this.position[1] + this.targetDirection[1]) ];
    this.targetTile = state.map.getTile(this.targetPosition[0], this.targetPosition[1]);
};

Player.prototype.draw = function(ctx) {
    // Outline of target tile
    if (this.targetTile) {
        this.targetTile.drawOutline(ctx);
    }
    // Self
    var sprite = Player.sprite;
    if (this.action == PlayerActions.PULL) { sprite = Player.dragSprite; }
    if (this.action == PlayerActions.DIG) { sprite = Player.digSprite; }
    if (this.action == PlayerActions.CUT) { sprite = Player.fightSprite; }
    if (this.action == PlayerActions.PATH) {
        sprite = this.targetTile && this.targetTile.decoImage ? Player.fightSprite : Player.digSprite;
    }
    if (sprite) {
        var x = Math.round(this.position[0] * state.map.tw);
        var y = Math.round(this.position[1] * state.map.th);
        drawImageSorted(ctx, sprite, x, y, null, null, 0.5, 0.85, this.direction == 1, 0, this.getFrame(sprite));
    }
    // Progress of action
    if (this.action && playerActions[this.action].duration > 0) {
        var p = (state.time - this.actionStarted) / this.actionDuration;
        if (p >= 0 && p <= 1) {
            renderSorter.add(x, y + 1000, () => drawProgressBar(ctx, x, y, 16, p));
        }
    }
};

Player.prototype.getFrame = function(sprite) {
    var frame = 0;
    if (!sprite || sprite == Player.sprite || sprite == Player.dragSprite) {
        var frame = 1;
        if (this.velocity[0] || this.velocity[1]) {
            // Running animation
            frame = Math.floor(state.time / 260) % 4;
        }
    } else {
        frame = Math.floor(state.time / 150) % 4;
    }
    return frame;
};

Player.getNearestCorpse = function(x, y, maxDistance) {
    var nearest = null, bestDistance2 = maxDistance * maxDistance;
    for (var corpse of state.corpses) {
        var dx = x - corpse.position[0], dy = y - corpse.position[1];
        var d2 = dx * dx + dy * dy;
        if (d2 < bestDistance2) {
            nearest = corpse;
            bestDistance2 = d2;
        }
    }
    return nearest;
};

Player.pullCorpse = function(corpse, x, y, distance) {
    var dx = x - corpse.position[0], dy = y - corpse.position[1];
    var d2 = dx * dx + dy * dy;
    if (d2 > distance * distance) {
        var dis = Math.sqrt(d2);
        var disf = distance / dis;
        corpse.setPosition( [x - dx * disf, y - dy * disf] );
    }
};

// load a sound or sound array
Player.prototype.loadNamedSounds = function (soundData, soundName) {
    if (Array.isArray(soundData)) {
        this[`${soundName}Files`] = [];
        soundData.forEach(soundData => {
            this[`${soundName}Files`].push(loader.loadAudio(soundData.src, soundData.playbackRate, soundData.volume, soundData.tileTypes));
        });
        for (const audio of this[`${soundName}Files`]) {
            audio.onended = () => {
                if (this.targetTile && audio.tileTypes != undefined) {
                    this[soundName] = getRandomSoundByTileType(this[`${soundName}Files`], this.targetTile.type);
                } else {
                    this[soundName] = getRandom(this[`${soundName}Files`]);
                }
            }
        }
        this[soundName] = this[`${soundName}Files`][0];
    } else {
        this[soundName] = loader.loadAudio(soundData.src, soundData.playbackRate, soundData.volume);
    }
}