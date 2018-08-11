

function Player(position) {
    Character.call(this, position);
}
inherit(Player, Character);

Player.prototype.VELOCITY = 0.005;

Player.load = function() {
    Player.sprite = loader.loadImage("img/character/char run01.png");
};

Player.prototype.update = function(delta) {
    // Set Velocity based on State (inserted by keyHandler)
    var vx = ((state.keyStates.right ? 1 : 0) - (state.keyStates.left ? 1 : 0));
    var vy = ((state.keyStates.down ? 1 : 0) - (state.keyStates.up ? 1 : 0));

    // Normalize if both directions are set
    if (vx || vy) {
        var length = Math.sqrt(vx * vx + vy * vy);
        this.velocity[0] = vx * this.VELOCITY / length;
        this.velocity[1] = vy * this.VELOCITY / length;
    } else {
        this.velocity[0] = this.velocity[1] = 0;
    }
    
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
