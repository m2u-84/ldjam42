function Player(position) {
    Character.call(this, position);
}
inherit(Player, Character);

Player.prototype.VELOCITY = 5.0;



Player.prototype.update = function(delta) {
    // Set Velocity based on State (inserted by keyHandler)
    this.velocity[0] = ((state.keyStates.right ? 1 : 0) - (state.keyStates.left ? 1 : 0)) * this.VELOCITY;
    this.velocity[1] = ((state.keyStates.down ? 1 : 0) - (state.keyStates.up ? 1 : 0)) * this.VELOCITY;

    // TODO Normalize
    
    Character.prototype.update.call(delta);
}