

function Map(tilesX, tilesY, tileWidth, tileHeight) {
    this.tilesX = tilesX;
    this.tilesY = tilesY;
    this.tileWidth = tileWidth;
    this.tileHeight = tileHeight;

    // Set up tiles array
    this.tiles = [];
    for (var y = 0; y < tilesY; y++) {
        this.tiles[y] = [];
        for (var x = 0; x < tilesX; x++) {
            this.tiles[y][x] = new Tile(x, y, TileTypes.GROUND);
        }
    }
}

Map.prototype.set = function(x, y, tp) {
    this.tiles[y][x] = new Tile(x, y, tp);
};

Map.prototype.getTile = function(x, y) {
    return this.tiles[y][x];
};

Map.prototype.get = function(x, y) {
    return this.getTile(x, y).type;
};

Map.prototype.draw = function(ctx) {
    for (var y = 0; y < this.tilesY; y++) {
        for (var x = 0;x < this.tilesX; x++) {
            this.getTile(x, y).draw(ctx);
        }
    }
};
