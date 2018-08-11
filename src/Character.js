function Character(position) {
    Entity.call(this, position);
    this.velocity = 0;
}

inherit(Character, Entity);

Character.prototype.update = function(delta) {
    // Compute new position based on delta and velocity
    this.position = [
        this.position[0] + this.velocity[0] * delta,
        this.position[1] + this.velocity[1] * delta
    ];
}