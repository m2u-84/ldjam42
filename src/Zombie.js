
function Zombie(position) {
    Character.call(this, position);
    this.targetPosition = position.slice();
    this.following = null;
    this.nextTargetSearch = 0;
}
inherit(Zombie, Character);

Zombie.prototype.VELOCITY = 0.001;

Zombie.update = function() {
    Zombie.sprite = loader.loadImage("img/character/zombieSprite.png", 4);
};

Zombie.prototype.update = function(dt) {
    if (this.stuck) {
        this.following = null;
        this.targetPosition = null;
        this.nextTargetSearch = state.dayTime + Math.random() * 0.1;
        this.velocity = [ 0, 0 ];
    } else {
        // Follow player?
        if (this.following) {
            // walk towards player
            this.velocity = [ this.following.position[0] - this.position[0], this.following.position[1] - this.position[1] ];
        } else {
            // Found player?
            var dx = this.position[0] - state.player.position[0], dy = this.position[1] - state.player.position[1];
            if (dx * dx + dy * dy < 5) {
                // Follow player
                console.log("FOllowing");
                this.following = state.player;
            } else {
                if (this.targetPosition) {
                    // Already there?
                    var dx = this.position[0] - this.targetPosition[0], dy = this.position[1] - this.targetPosition[1];
                    if (dx * dx + dy * dy < 0.1) {
                        // Stop moving
                        this.targetPosition = null;
                        this.following = null;
                        this.nextTargetSearch = state.dayTime + Math.random() * 0.1;
                        this.velocity = [ 0, 0 ];
                    } else {
                        // Walk aimlessly to target position
                        this.velocity = [ this.targetPosition[0] - this.position[0], this.targetPosition[1] - this.position[1] ];
                    }
                } else {
                    // Got new target position?
                    if (this.nextTargetSearch < state.dayTime) {
                        // Find new position nearby
                        this.targetPosition = [ this.position[0] + (Math.random() - Math.random()) * 3,
                            this.position[1] + (Math.random() - Math.random()) * 3 ];
                    }
                }
            }
        }
    }
    // Normalize velocity to own speed
    var length = Math.sqrt(this.velocity[0] * this.velocity[0] + this.velocity[1] * this.velocity[1]);
    if (length > 0) {
        this.velocity = this.velocity.map(v => this.VELOCITY * v / length);
    }

    Character.prototype.update.call(this, dt);
};

Zombie.prototype.draw = function(ctx) {
    var x = this.position[0] * state.map.tw, y = this.position[1] * state.map.th;
    var spr = Zombie.sprite;
    drawImageSorted(ctx, spr, x, y, null, null, 0.5, 0.9, this.direction == 1, 0, this.getFrame(spr));
};

Zombie.prototype.getFrame = function(spr) {
    return Math.floor(state.time / 320) % 4
};
