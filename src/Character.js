function Character(position) {
    Entity.call(this, position);
    this.velocity = [0, 0];
    this.direction = 1;

    this.width = 0.5;
    this.height = 0.3;
}

inherit(Character, Entity);

Character.prototype.update = function(delta) {
    // Compute new position based on delta and velocity
    var nx = this.position[0] + this.velocity[0] * delta;
    var ny = this.position[1] + this.velocity[1] * delta;
    this.position = this.resolveCollision(nx, ny);

    // Update direction
    if (this.velocity[0] > 0) { this.direction = 1; }
    if (this.velocity[0] < 0) { this.direction = -1; }
};

Character.prototype.resolveCollision = function(x, y) {
    // Check x direction
    if (this.checkCollision(x, this.position[1])) {
        x = this.position[0];
    }
    if (this.checkCollision(x, y)) {
        y = this.position[1];
    }
    return [x, y];
};

Character.prototype.checkCollision = function(x, y) {
    var x1 = x - this.width / 2;
    var y1 = y - this.height / 2;
    var x2 = x1 + this.width;
    var y2 = y1 + this.height;
    return state.map.getTile(x1, y1).getCollision() || state.map.getTile(x2, y1).getCollision() ||
            state.map.getTile(x1, y2).getCollision() || state.map.getTile(x2, y2).getCollision();
};
