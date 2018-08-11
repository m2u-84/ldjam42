

function Map(tilesX, tilesY, tileWidth, tileHeight) {
    this.tilesX = tilesX;
    this.tilesY = tilesY;
    this.tileWidth = this.tw = tileWidth;
    this.tileHeight = this.th = tileHeight;

    this.tiles = [];
}

Map.prototype.load = function() {
    // Set up tiles array
    for (var y = 0; y < this.tilesY; y++) {
        this.tiles[y] = [];
        for (var x = 0; x < this.tilesX; x++) {
            this.tiles[y][x] = new Tile(x, y, TileTypes.GROUND, this);
        }
    }
    for (var x = 3; x < 8; x++) {
        this.tiles[6][x] = new Tile(x, 6, TileTypes.PATH, this);
        this.tiles[9][2 * x] = new Tile(x, 6, TileTypes.TREE, this);
    }
};

Map.prototype.set = function(x, y, tp) {
    this.tiles[y][x] = new Tile(x, y, tp);
};

Map.prototype.getTile = function(x, y) {
    if (x < 0 || y < 0 || x >= this.tilesX || y >= this.tilesY) {
        return null;
    }
    var x = Math.floor(x);
    var y = Math.floor(y);
    return this.tiles[y][x];
};

Map.prototype.get = function(x, y) {
    return this.getTile(x, y).type;
};

Map.prototype.draw = function(ctx) {
    // Draw based on zIndex of tile types
    for (var z = tileTypes.minZIndex; z <= tileTypes.maxZIndex; z++) {
        for (var tp of tileTypes) {
            if (tp.zIndex == z) {
                for (var y = 0; y < this.tilesY; y++) {
                    for (var x = 0; x < this.tilesX; x++) {
                        var tile = this.getTile(x,y);
                        if (tileTypes[tile.type] == tp) {
                            tile.draw(ctx);
                        }
                    }
                }
            }
        }
    }
};
