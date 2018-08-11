function Player(position) {
    Entity.call(this, position);
}

inherit(Player, Character);

Player.prototype.VELOCITY = 5.0;
Player.prototype.setState = function(state) {
    this.state = state;
}



Player.prototype.update = function(delta) {
    // Set Velocity based on State (inserted by keyHandler)
    this.velocity[0] = this.state.left ? (-1) * this.VELOCITY : 0;
    this.velocity[0] = this.state.right ? this.VELOCITY : 0;
    this.velocity[1] = this.state.up ? (-1) * this.VELOCITY : 0;
    this.velocity[1] = this.state.down ? this.VELOCITY : 0;
    
    // Both left and right pressed?
    if (this.state.left && this.state.right) {
        this.velocity[0] = 0;
    } 

    // Both up and down pressed?
    if (this.state.up && this.state.bottom ) {
        this.velocity[1] = 0;
    }
    
    Character.prototype.update.call(delta);
}