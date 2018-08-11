

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

    const playerPos = state.player.position;
    const fencedZoneWidth = 8;
    const centerZoneOffset = Math.floor(fencedZoneWidth / 2) ;

    // create f3nc3™ around player
    for (let x = 0; x < fencedZoneWidth; x++) {
        let posX = playerPos[0] + x - centerZoneOffset;
        let posY = playerPos[1] - centerZoneOffset;
        this.tiles[posY - 1][posX] = new Tile(posX, posY - 1, TileTypes.FENCE, this);
        // opening
        if (x !== Math.floor(fencedZoneWidth / 2 - 1) && x !== Math.floor(fencedZoneWidth / 2)) {
            this.tiles[posY + fencedZoneWidth][posX] = new Tile(posX, posY + fencedZoneWidth, TileTypes.FENCE, this);
        }        

        posX = playerPos[0] - centerZoneOffset;
        posY = playerPos[1] + x - centerZoneOffset;
        this.tiles[posY][posX - 1] = new Tile(posX - 1, posY, TileTypes.FENCE_SIDE, this);
        this.tiles[posY][posX + fencedZoneWidth] = new Tile(posX + fencedZoneWidth, posY, TileTypes.FENCE_SIDE, this);
    }

    // create st0neZ0ne™ with f3nc3™
    const entranceHeight = 3;
    for (let y = this.tilesY - entranceHeight; y < this.tilesY; y++) {
        for (let x = 0; x < this.tilesX; x++) {
            // fence
            if (y === this.tilesY - entranceHeight) {
                // opening or stone
                if (x !== Math.floor(this.tilesX / 2 - 1) && x !== Math.floor(this.tilesX / 2)) {
                    this.tiles[y][x] = new Tile(x, y, TileTypes.STONE_FENCE, this);
                } else {
                    this.tiles[y][x] = new Tile(x, y, TileTypes.STONE, this);
                }
            } else {
                this.tiles[y][x] = new Tile(x, y, TileTypes.STONE, this);
            }
        }
    }

    // for (var x = 2; x < 12; x += 4) {
    //     this.set(x, 19 - x, TileTypes.TORCH);
    // }
};

Map.prototype.set = function(x, y, tp) {
    this.tiles[y][x] = new Tile(x, y, tp, this);
    // Check if grave need to be placed
    if (tp == TileTypes.HOLE) {
        // Find neighbour
        var nb = this.findNeighbour(x, y, t => t.type == TileTypes.HOLE, false);
        if (nb) {
            // Turn both into grave
            state.graves.push(new Grave(x, y, nb.x, nb.y));
        }
    }
};

Map.prototype.getTile = function(x, y) {
    if (x < 0 || y < 0 || x >= this.tilesX || y >= this.tilesY) {
        return null;
    }
    var x = Math.floor(x);
    var y = Math.floor(y);
    return this.tiles[y][x];
};

Map.prototype.getCollision = function(x, y) {
    var tile = this.getTile(x, y);
    return (!tile || tile.getCollision())
};

Map.prototype.get = function(x, y) {
    return this.getTile(x, y).type;
};

Map.prototype.findNeighbour = function(x, y, check, diagonal) {
    for (var dy = -1; dy < 2; dy++) {
        for (var dx = -1; dx < 2; dx++) {
            if (dx || dy) {
                if (diagonal || (!dx || !dy)) {
                    var tile = this.getTile(x + dx, y + dy);
                    if (tile) {
                        if (check(tile)) {
                            return tile;
                        }
                    }
                }
            }
        }
    }
    return null;
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
