function Entity(position) {
    this.setPosition(position);
}

Entity.prototype.updateTile = function() {
    this.tile = [Math.floor(this.position[0]), Math.floor(this.position[1])];
}

Entity.prototype.setPosition = function(position) {
    this.position = position;
    this.updateTile();
}
