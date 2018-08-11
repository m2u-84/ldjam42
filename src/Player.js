const PlayerActions = {
    NONE: 0,
    PULL: 1,
    DIG: 2,
    CUT: 3,
    PATH: 4
}

var playerActions = [
    { duration: 0, move: true },
    { duration: 0, move: true },
    { duration: 3000, move: false },
    { duration: 5000, move: false },
    { duration: 1200, move: false }
];

function Player(position, movementSounds) {
    Character.call(this, position, movementSounds);
    this.ePressed = false;
    this.pulling = null;
    this.targetDirection = [1, 0];
    this.targetPosition = [0, 0];
    this.targetTile = null;

    // Actions such as digging or cutting a tree
    this.action = PlayerActions.NONE;
    this.actionStarted = 0;
    this.actionDuration = 1000;
}
inherit(Player, Character);

Player.prototype.VELOCITY = 0.004;
Player.prototype.PULL_DISTANCE = 0.7;

Player.load = function() {
    Player.sprite = loader.loadImage("img/character/characteranimation2.png", 4);
};

Player.prototype.update = function(delta) {
    // Set Velocity based on State (inserted by keyHandler)
    var keys = state.keyStates;
    var vx = 0, vy = 0;
    if (playerActions[this.action].move) {
        var vx = ((keys.ArrowRight || keys.d ? 1 : 0) - (keys.ArrowLeft || keys.a ? 1 : 0));
        var vy = ((keys.ArrowDown || keys.s ? 1 : 0) - (keys.ArrowUp || keys.w ? 1 : 0));
    }

    // Normalize if both directions are set
    if (vx || vy) {
        var length = Math.sqrt(vx * vx + vy * vy);
        this.velocity[0] = vx * this.VELOCITY / length;
        this.velocity[1] = vy * this.VELOCITY / length;
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
            this.pulling = null;
            this.action = PlayerActions.NONE;
        } else {
            var corpse = Player.getNearestCorpse(this.targetPosition[0] + 0.5, this.targetPosition[1] + 0.5, 0.8);
            if (corpse) {
                this.pulling = corpse;
                this.action = PlayerActions.PULL;
            } else {
                // Other action
                var tile = this.targetTile;
                if (tile) {
                    if (tile.type == TileTypes.TREE) {
                        // Cut Tree
                        this.action = PlayerActions.CUT;
                    } else if (tile.type == TileTypes.GROUND) {
                        // Path
                        this.action = PlayerActions.PATH;
                    } else if (tile.type == TileTypes.PATH) {
                        // Dig
                        this.action = PlayerActions.DIG;
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
        var tile = this.targetTile;
        if (state.time >= this.actionStarted + this.actionDuration && tile) {
            // Conclude action
            switch (this.action) {
                case PlayerActions.CUT:
                    state.map.set(tile.x, tile.y, TileTypes.GROUND);
                    break;
                case PlayerActions.PATH:
                    state.map.set(tile.x, tile.y, TileTypes.PATH);
                    break;
                case PlayerActions.DIG:
                    state.map.set(tile.x, tile.y, TileTypes.HOLE);
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
    if (Player.sprite) {
        var x = Math.round(this.position[0] * state.map.tw);
        var y = Math.round(this.position[1] * state.map.th);
        drawImage(ctx, Player.sprite, x, y, null, null, 0.5, 0.85, this.direction == 1, 0, this.getFrame());
    }
    // Progress of action
    if (this.action && playerActions[this.action].duration > 0) {
        var p = (state.time - this.actionStarted) / this.actionDuration;
        if (p >= 0 && p <= 1) {
            y -= 40;
            var w = 16;
            var h = 3;
            var x1 = x - w/2, y1 = y - h/2;
            ctx.fillStyle = "black";
            ctx.fillRect(x1 - 1, y1 - 1, w + 2, h + 2);
            ctx.fillStyle = "#f0b014";
            ctx.fillRect(x1, y1, w * p, h);
        }
    }
};

Player.prototype.getFrame = function() {
    var frame = 1;
    if (this.velocity[0] || this.velocity[1]) {
        // Running animation
        var frame = Math.floor(state.time / 260) % 4;
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
