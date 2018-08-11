function Entity(position) {
    this.position = position;
}

Entity.prototype.getTile = function() {
    return [Math.floor(position[0]), Math.floor(position[1])];
} 

Entity.prototype.tile = this.getTile();