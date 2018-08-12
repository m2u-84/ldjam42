function Character(position) {
    Entity.call(this, position);
    this.velocity = [0, 0];
    this.direction = 1;
    this.collided = false;
    this.stuck = false;

    this.width = 0.5;
    this.height = 0.3;
}

inherit(Character, Entity);

Character.prototype.update = function (delta) {
    this.collided = false;
    this.stuck = false;
    // Compute new position based on delta and velocity
    var nx = this.position[0] + this.velocity[0] * delta;
    var ny = this.position[1] + this.velocity[1] * delta;
    this.setPosition(this.resolveCollision(nx, ny));

    // Update direction
    if (this.velocity[0] > 0) { this.direction = 1; }
    if (this.velocity[0] < 0) { this.direction = -1; }
};

Character.prototype.resolveCollision = function (x, y) {
    // Check x direction
    if (this.checkCollision(x, this.position[1])) {
        this.collided = true;
        x = this.position[0];
    }
    if (this.checkCollision(x, y)) {
        if (this.collided) { this.stuck = true; } else { this.collided = true; }
        y = this.position[1];
    }
    // Player stuck?
    if (this.checkCollision(x, y)) {
        return state.map.findClosestFreePosition(x, y, this.width, this.height);
    }
    return [x, y];
};

Character.prototype.checkCollision = function (x, y) {
    var x1 = x - this.width / 2;
    var y1 = y - this.height / 2;
    var x2 = x1 + this.width;
    var y2 = y1 + this.height;
    return state.map.getCollision(x1, y1) || state.map.getCollision(x2, y1) ||
        state.map.getCollision(x1, y2) || state.map.getCollision(x2, y2);
};
