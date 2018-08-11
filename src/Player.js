function Player(position) {
    Character.call(this, position);
}
inherit(Player, Character);

Player.prototype.VELOCITY = 5.0;



Player.prototype.update = function(delta) {
    // Set Velocity based on State (inserted by keyHandler)
    var vx = ((state.keyStates.right ? 1 : 0) - (state.keyStates.left ? 1 : 0));
    var vy = ((state.keyStates.down ? 1 : 0) - (state.keyStates.up ? 1 : 0));

    // Normalize if both directions are set
    var length = Math.sqrt(vx * vx + vy * vy);
    this.velocity[0] = vx * this.VELOCITY / length;
    this.velocity[1] = vy * this.VELOCITY / length;
    
    Character.prototype.update.call(delta);
}