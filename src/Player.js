

function Player(position, movementSounds) {
    Character.call(this, position, movementSounds);
}
inherit(Player, Character);

Player.prototype.VELOCITY = 0.005;

Player.load = function() {
    Player.sprite = loader.loadImage("img/character/char run01.png");
};

Player.prototype.update = function(delta) {
    // Set Velocity based on State (inserted by keyHandler)
    var keys = state.keyStates;
    var vx = ((keys.ArrowRight || keys.d ? 1 : 0) - (keys.ArrowLeft || keys.a ? 1 : 0));
    var vy = ((keys.ArrowDown || keys.s ? 1 : 0) - (keys.ArrowUp || keys.w ? 1 : 0));

    // Normalize if both directions are set
    if (vx || vy) {
        var length = Math.sqrt(vx * vx + vy * vy);
        this.velocity[0] = vx * this.VELOCITY / length;
        this.velocity[1] = vy * this.VELOCITY / length;
    } else {
        this.velocity[0] = this.velocity[1] = 0;
    }

    // E pressed?
    
    Character.prototype.update.call(this, delta);
};

Player.prototype.draw = function(ctx) {
    if (Player.sprite) {
        var x = Math.round(this.position[0] * state.map.tw);
        var y = Math.round(this.position[1] * state.map.th);
        drawImage(ctx, Player.sprite, x, y,
                null, null, null, null, this.direction == 1);
    }
};
