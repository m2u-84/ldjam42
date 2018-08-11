function Character(position) {
    Entity.call(this, position);
    this.velocity = [0, 0];
    this.direction = 1;
}

inherit(Character, Entity);

Character.prototype.update = function(delta) {
    // Compute new position based on delta and velocity
    this.position = [
        this.position[0] + this.velocity[0] * delta,
        this.position[1] + this.velocity[1] * delta
    ];
    // Update direction
    if (this.velocity[0] > 0) { this.direction = 1; }
    if (this.velocity[0] < 0) { this.direction = -1; }
}