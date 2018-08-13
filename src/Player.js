const movementSounds = [{
        src: "sounds/step_dirt.mp3",
        playbackRate: 1,
        volume: .15,
        tileTypes: [TileTypes.GROUND, TileTypes.PATH]
    }, {
        src: "sounds/step_dirt2.mp3",
        playbackRate: 1,
        volume: .15,
        tileTypes: [TileTypes.GROUND, TileTypes.PATH]
    }, {
        src: "sounds/step_dirt3.mp3",
        playbackRate: 1,
        volume: .15,
        tileTypes: [TileTypes.GROUND, TileTypes.PATH]
    }, {
        src: "sounds/step_dirt4.mp3",
        playbackRate: 1,
        volume: .15,
        tileTypes: [TileTypes.GROUND, TileTypes.PATH]
    }, {
        src: "sounds/step_stone.mp3",
        playbackRate: .8,
        volume: .3,
        tileTypes: [TileTypes.STONE]
    }, {
        src: "sounds/step_stone3.mp3",
        playbackRate: .8,
        volume: .6,
        tileTypes: [TileTypes.STONE]
}];

const draggingSounds =  [{
        src: "sounds/player_drag.mp3",
        playbackRate: 1.6,
        volume: 0.6
    }, {
        src: "sounds/player_drag3.mp3",
        playbackRate: 2.3,
        volume: 0.6
}]

const digSound = {
    src: "sounds/player_dig.mp3",
    playbackRate: 1.5,
    volume: 0.2
}

const treeFallingSound = {
    src: "sounds/tree_falling.mp3",
    playbackRate: 1,
    volume: 0.5
}

const cuttingTreeSounds = {
    src: "sounds/player_cut_tree2.mp3",
    playbackRate: 1,
    volume: 0.2
};

const torchCrackle = {
    src: "sounds/torch_crackle_loop.mp3",
    playbackRate: 1,
    volume: 0.3,
    minVolume: 0,
    maxVolume: 0.5,
    loop: true
}

const PlayerActions = {
    NONE: 0,
    PULL: 1,
    DIG: 2,
    CUT: 3,
    PATH: 4,
    FILL: 5,
    ATTACK: 6
}

var testSpeedWalkFactor = 1;
var testSpeedFactor = 1;
var playerActions = [
    { duration: 0, move: true },
    { duration: 0, move: true },
    { duration: 3000 / testSpeedFactor, move: false },
    { duration: 5000 / testSpeedFactor, move: false },
    { duration: 1200 / testSpeedFactor, move: false },
    { duration: 6000 / testSpeedFactor, move: false },
    { duration: 450, move: false }
];

function Player(position) {
    Character.call(this, position);
    this.ePressed = false;
    this.pulling = null;
    this.targetDirection = [1, 0];
    this.targetPosition = [0, 0];
    this.targetTile = null;

    this.width = 0.4;
    this.height = 0.2;

    SoundManager.loadSoundsWithNamedTrigger.call(this, draggingSounds, "dragSound");
    SoundManager.loadSoundsWithNamedTrigger.call(this, digSound, "digSound");
    SoundManager.loadSoundsWithNamedTrigger.call(this, cuttingTreeSounds, "cutTreeSound");
    SoundManager.loadSoundsWithNamedTrigger.call(this, treeFallingSound, "treeFallingSound");
    SoundManager.loadSoundsWithNamedTrigger.call(this, movementSounds, "movementSound");
    SoundManager.loadSoundsWithNamedTrigger.call(this, torchCrackle, "torchCrackle");

    // Actions such as digging or cutting a tree
    this.action = PlayerActions.NONE;
    this.actionStarted = 0;
    this.actionDuration = 1000;
    this.torch = false;
}
inherit(Player, Character);

Player.prototype.VELOCITY = 0.0027 * testSpeedWalkFactor;
Player.prototype.PULL_DISTANCE = 0.7;

Player.load = function() {
    Player.sprite = loader.loadImage("img/character/characteranimation2.png", 4);
    Player.fightSprite = loader.loadImage("img/character/char fight.png", 4);
    Player.dragSprite = loader.loadImage("img/character/char drag.png", 4);
    Player.digSprite = loader.loadImage("img/character/char digging.png", 4);
    Player.torchSprite = loader.loadImage("img/character/torch carry.png", 4);
};

Player.update = function() {
    // Check time of day for new day
    var threshold = 0.2;
    if (state.dayTime % 1 >= threshold && state.lastDayTime % 1 < threshold) {
        SoundManager.play("daybreak", 0.6);
    }
    threshold = 0.71;
    if (state.dayTime % 1 >= threshold && state.lastDayTime % 1 < threshold) {
        SoundManager.play("nightbreak", 0.6);
    }
    threshold = 0.32;
    if (state.dayTime % 1 >= threshold && state.lastDayTime % 1 < threshold) {
        SoundManager.play("newbodies", 0.5);
    }
};

Player.prototype.update = function(delta) {
    // Set Velocity based on State (inserted by keyHandler)
    var keys = state.keyStates;
    if (state.pauseScreen || state.startScreen) {
        keys = {};
    }
    var vx = 0, vy = 0;
    // Only move when no prohibiting action is active, and when player is not currently in shop
    if (playerActions[this.action].move && !state.shopOpen) {
        var vx = ((keys.ArrowRight || keys.d ? 1 : 0) - (keys.ArrowLeft || keys.a ? 1 : 0));
        var vy = ((keys.ArrowDown || keys.s ? 1 : 0) - (keys.ArrowUp || keys.w ? 1 : 0));
    }

    // play movement sound
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
    // Reduce based on zombies nearby
    velocity *= this.getZombieSpeedReduction();
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

    // Torch?
    if (!state.shopOpen && state.unlocks.torches && !this.torch) {
        this.action = PlayerActions.NONE;
        this.pulling = false;
        this.torch = true;
    }

    // enable / disable torch sounds based on radius around player
    const torchSoundRadius = 4;
    const torchesInRadius = Player.getTilesInRadius(torchSoundRadius, TileTypes.TORCH).concat(Player.getTilesInRadius(torchSoundRadius, TileTypes.COLLIDING_TORCH));
    const nearestTorch = Player.getNearestTile(torchesInRadius);
    if (nearestTorch) {
        const mapped = map(nearestTorch.distance, 0, torchSoundRadius, this.torchCrackle.minVolume, this.torchCrackle.maxVolume);
        // the smaller the distance the louder the sound
        const torchVolume = this.torchCrackle.maxVolume - mapped;
        this.torchCrackle.setVolume(torchVolume);
        if (!this.torchCrackle.isPlaying()) {
            this.torchCrackle.play();
        }
    } else {
        this.torchCrackle.pause();
    }

    // F pressed?
    if (!this.torch && keys.f && !this.action) {
        // Attack action
        this.action = PlayerActions.ATTACK;
        this.actionStarted = state.time;
        this.pulling = null;
        this.actionDuration = playerActions[this.action].duration;
        this.cutTreeSound.trigger();
        SoundManager.play("attack", 0.05);
    }
    // E pressed?
    var prev = this.ePressed;
    this.ePressed = keys.e;
    if (this.ePressed && !prev) {
        if (this.torch) {
            // Place torch if tile is empty
            var tile = this.targetTile;
            if (tile) {
                if (tile.type == TileTypes.GROUND && !tile.decoImage || tile.type == TileTypes.PATH) {
                    // Place torch
                    state.map.set(tile.x, tile.y, TileTypes.TORCH);
                    this.torch = false;
                    state.unlocks.torches = false;
                }
            }
        } else {
            // No torch, so start an action maybe
            this.actionStarted = state.time;
            // E was pressed just now, try to drag corpse
            var durationFactor = 1;
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
                                if (state.unlocks.axe2) { durationFactor = 0.7; }
                                if (state.unlocks.axe3) { durationFactor = 0.3; }
                            } else if (tile.type == TileTypes.GROUND) {
                                // Path
                                this.action = PlayerActions.PATH;
                                this.digSound.trigger();
                                if (tile.decoImage) {
                                    SoundManager.play("obstacles", 0.6);
                                }
                                if (state.unlocks.shovel2) { durationFactor = 0.75; }
                                if (state.unlocks.shovel3) { durationFactor = 0.5; }
                            } else if (tile.type == TileTypes.PATH) {
                                // Dig
                                this.action = PlayerActions.DIG;
                                this.digSound.trigger();
                                SoundManager.play("digging", 0.15);
                                if (state.unlocks.shovel2) { durationFactor = 0.75; }
                                if (state.unlocks.shovel3) { durationFactor = 0.5; }
                            } else if (tile.type == TileTypes.HOLE || tile.type == TileTypes.GRAVE) {
                                if (tile.type == TileTypes.HOLE || tile.reference && tile.reference.empty) {
                                    this.action = PlayerActions.FILL;
                                    this.digSound.trigger();
                                    if (state.unlocks.shovel2) { durationFactor = 0.75; }
                                    if (state.unlocks.shovel3) { durationFactor = 0.5; }
                                }
                            } else if (tile.type == TileTypes.TORCH) {
                                // Take torch
                                state.map.set(tile.x, tile.y, TileTypes.GROUND);
                                state.map.getTile(tile.x, tile.y).decoImage = null;
                                this.torch = true;
                                state.unlocks.torches = true;
                            } else if (tile.type == TileTypes.FENCE || tile.type == TileTypes.FENCE_SIDE
                                        || tile.type == TileType.STONE_FENCE || tile.type == TileType.STONE_FENCE_SIDE) {
                                this.cutTreeSound.trigger();
                            }
                        }
                    }
                }
            }
            this.actionDuration = playerActions[this.action].duration * durationFactor;
        }
    } else if (!this.ePressed && this.action > 0 && !playerActions[this.action].move && this.action != PlayerActions.ATTACK) {
        // e released during blocking action -> abort action
        this.action = PlayerActions.NONE;
    } else if (this.action > 0 && !playerActions[this.action].move) {
        // During action, check if ready
        if (this.action === PlayerActions.DIG) {
            this.digSound.trigger();
        }
        if (this.action === PlayerActions.CUT) {
            this.cutTreeSound.trigger();
        }
        if (this.action === PlayerActions.FILL) {
            this.digSound.trigger();
        }
        var tile = this.targetTile;
        if (state.time >= this.actionStarted + this.actionDuration && tile) {
            // Conclude action
            switch (this.action) {
                case PlayerActions.CUT:
                    state.map.set(tile.x, tile.y, TileTypes.GROUND);
                    this.treeFallingSound.trigger();
                    SoundManager.play("treefall", 1);
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
                    break;
                case PlayerActions.ATTACK:
                    // Damage all zombies in range
                    this.damageZombies();
                    break;
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
    this.targetPosition = [ Math.floor(this.position[0] + this.targetDirection[0] * 0.7),
        Math.floor(this.position[1] + this.targetDirection[1] * 0.7) ];
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
    if (this.action == PlayerActions.FILL) { sprite = Player.digSprite; }
    if (this.action == PlayerActions.DIG) { sprite = Player.digSprite; }
    if (this.action == PlayerActions.CUT) { sprite = Player.fightSprite; }
    if (this.action == PlayerActions.ATTACK) { sprite = Player.fightSprite; }
    if (this.torch) { sprite = Player.torchSprite; }
    if (this.action == PlayerActions.PATH) {
        sprite = this.targetTile && this.targetTile.decoImage ? Player.fightSprite : Player.digSprite;
    }
    if (sprite) {
        var x = Math.round(this.position[0] * state.map.tw);
        var y = Math.round(this.position[1] * state.map.th);
        drawImageSorted(ctx, sprite, x, y, null, null, 0.5, 0.85, this.direction == 1, 0, this.getFrame(sprite));
    }
    // Progress of action
    if (this.action && playerActions[this.action].duration > 0 && this.action != PlayerActions.ATTACK) {
        var p = (state.time - this.actionStarted) / this.actionDuration;
        if (p >= 0 && p <= 1) {
            renderSorter.add(x, y + 1000, () => drawProgressBar(ctx, x, y, 16, p));
        }
    }
};

Player.prototype.getFrame = function(sprite) {
    var frame = 0;
    var tStart = this.action ? this.actionStarted : 0;
    if (!sprite || sprite == Player.sprite || sprite == Player.dragSprite || sprite == Player.torchSprite) {
        var frame = 1;
        if (this.velocity[0] || this.velocity[1]) {
            // Running animation
            frame = Math.floor((state.time - tStart) / 260) % 4;
        }
    } else if (sprite == Player.attackSprite) {
        frame = Math.floor((state.time - tStart) / 100) % 4;
    } else {
        frame = Math.floor((state.time - tStart) / 150) % 4;
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

Player.getTilesInRadius = function (radius, tileType) {
    let playerPos = state.player.position;
    let centerOffset = Math.floor(radius);
    let tilesWithType = [];
    state.map.tiles.forEach( yTile => {
        yTile.forEach( tile => {
            if (tile.type === tileType) {
                tilesWithType.push(tile);
            }
        })
    })
    const tilesInRadius = tilesWithType.filter(tile => {
        if ( tile.x >= playerPos[0] - centerOffset && tile.x <= playerPos[0] - centerOffset + radius * 2
            && tile.y >= playerPos[1] - centerOffset && tile.y <= playerPos[1] - centerOffset + radius * 2) {
                return true;
            } else {
                return false;
            }
    })
    return tilesInRadius;
}

Player.getDistanceToTile = function (tile) {
    let playerPos = state.player.position;
    const dx = tile.x - playerPos[0];
    const dy = tile.y - playerPos[1];
    const distance = Math.sqrt(dx * dx + dy * dy);
    return {
        tile: tile,
        distance: distance
    };
}

Player.getNearestTile = function (tiles) {
    if (tiles.length > 0) {
        let t = Player.getDistanceToTile(tiles[0]);
        let tile = t.tile;
        let minDistance = t.distance;
        if (tiles[1]) {
            for (let x = 1; x < tiles.length; x++) {
                let distanceToPlayer = Player.getDistanceToTile(tiles[x]).distance;
                if (distanceToPlayer < minDistance) {
                    tile = tiles[x];
                    minDistance = distanceToPlayer;
                }
            }
        }
        return {
            tile: tile,
            distance: minDistance
        };
    }
}

Player.prototype.getZombieSpeedReduction = function() {
    var near = 0;
    state.zombies.forEach(z => {
        if (z.following == this) {
            var dx = z.position[0] - this.position[0], dy = z.position[1] - this.position[1];
            var d2 = dx * dx + dy * dy;
            if (d2 < 1 * 1) {
                near++;
            }
        }
    });
    if (near > 0 && !state.unlocks.zombies2) {
        var steps = 0.01;
        if (state.dayTime % steps < state.lastDayTime % steps) {
            SoundManager.play("zattack", 0.3);
        }
    }
    var base = state.unlocks.zombies2 ? 1.25 : 0.85;
    return Math.min(3, Math.max(0.2, Math.pow(base, near)));
};

Player.prototype.damageZombies = function() {
    var pickx = 0.5 * (this.targetPosition[0] + 0.5 + this.position[0]);
    var picky = 0.5 * (this.targetPosition[1] + 0.5 + this.position[1]);
    var dmg = 2 + (state.unlocks.axe2 ? 1 : 0) + (state.unlocks.axe3 ? 4 : 0);
    var damageDealt = false;
    for (var i = state.zombies.length - 1; i >= 0; i--) {
        var z = state.zombies[i];
        var dx = z.position[0] - pickx, dy = z.position[1] - picky;
        var d2 = dx * dx + dy * dy;
        if (d2 < 1 * 1) {
            dx = z.position[0] - this.position[0]; dy = z.position[1] - this.position[1];
            var d = Math.sqrt(dx * dx + dy * dy);
            z.velocity = [ dx/d, dy/d ].map(v => v * 0.03);
            z.sleepUntil = state.time + 500;
            if (!damageDealt) {
                damageDealt = true;
                z.damage(dmg);
            }
        }
    }
};
