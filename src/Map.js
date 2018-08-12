

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
            var tp = Math.random() < 0.02 ? TileTypes.TREE : TileTypes.GROUND;
            this.tiles[y][x] = new Tile(x, y, tp, this);
        }
    }

    this.defaultTile = new Tile(x, y, TileTypes.GROUND, this);
    this.defaultTile.decoImage = null;

    var playerPos = state.player.position;
    playerPos = playerPos.map(v => Math.floor(v));
    this.set(playerPos[0], playerPos[1], TileTypes.GROUND);
    playerPos[1] -= 2;
    const fencedZoneWidth = 9;
    const centerZoneOffset = Math.floor(fencedZoneWidth / 2) ;
    const fenceArea = [
        playerPos[0] - centerZoneOffset,
        playerPos[1] - centerZoneOffset,
        playerPos[0] + fencedZoneWidth - centerZoneOffset - 1,
        playerPos[1] - centerZoneOffset + fencedZoneWidth 
    ];
    const entranceHeight = 4;
    const stoneArea = [
        0,
        this.tilesY - entranceHeight,
        this.tilesX,
        this.tilesY
    ];
    const entranceArea = [
        playerPos[0] - 2,
        fenceArea[3],
        playerPos[0] + 2,
        stoneArea[1]
    ];
    const shopStart = [ entranceArea[2], entranceArea[3] - 1 ];

    // create f3nc3™ around player
    for (let x = 0; x < fencedZoneWidth; x++) {
        let posX = playerPos[0] + x - centerZoneOffset;
        let posY = playerPos[1] - centerZoneOffset;
        // Top side
        this.tiles[posY - 1][posX] = new Tile(posX, posY - 1, TileTypes.FENCE, this);
        // Bottom side, minus opening
        if (x < Math.floor(fencedZoneWidth / 2 - 1) || x > Math.floor(fencedZoneWidth / 2) + 1) {
            this.tiles[posY + fencedZoneWidth][posX] = new Tile(posX, posY + fencedZoneWidth, TileTypes.FENCE, this);
        }

        posX = playerPos[0] - centerZoneOffset;
        posY = playerPos[1] + x - centerZoneOffset;
        // Left side
        this.tiles[posY][posX - 1] = new Tile(posX - 1, posY, TileTypes.FENCE_SIDE, this);
        // Right side
        this.tiles[posY][posX + fencedZoneWidth] = new Tile(posX + fencedZoneWidth, posY, TileTypes.FENCE_SIDE, this);
    }

    // Close gap between st0neZ0ne and player area
    var y1 = playerPos[1] - centerZoneOffset + fencedZoneWidth + 1;
    for (var y = y1; y < this.tilesY - entranceHeight; y++) {
        // Left side
        this.set(playerPos[0] - 2, y, TileTypes.FENCE_SIDE);
        // Right side
        this.set(playerPos[0] + 2, y, TileTypes.FENCE_SIDE);
        // Path in the middle
        this.set(playerPos[0], y, TileTypes.PATH);
    }
    this.set(playerPos[0], y1 - 1, TileTypes.PATH);
    this.set(playerPos[0], y1 - 2, TileTypes.PATH);

    // create st0neZ0ne with f3nc3
    for (let y = this.tilesY - entranceHeight; y < this.tilesY; y++) {
        for (let x = 0; x < this.tilesX; x++) {
            // fence
            if (y === this.tilesY - entranceHeight) {
                // opening or stone
                if (x < Math.floor(this.tilesX / 2 - 1) ||x > Math.floor(this.tilesX / 2) + 1) {
                    this.tiles[y][x] = new Tile(x, y, TileTypes.STONE_FENCE, this);
                } else {
                    this.tiles[y][x] = new Tile(x, y, TileTypes.STONE, this);
                }
            } else {
                this.tiles[y][x] = new Tile(x, y, TileTypes.STONE, this);
            }
        }
    }

    // Shop Area
    // First path to the right
    for (var i = -1; i < 4; i++) {
        this.set(shopStart[0] + i, shopStart[1], TileTypes.PATH);
    }
    // Then path to top
    // And Shop
    this.shopTile = this.getTile(shopStart[0] + 2, shopStart[1]);
    // Tree to the right
    this.set(shopStart[0] + 4, shopStart[1], TileTypes.TREE);

    for (var x = 2; x < 28; x += 7) {
        this.set(x, 31 - x, TileTypes.TORCH);
    }
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

Map.prototype.getBoxCollision = function(x, y, w, h) {
    var x1 = Math.floor(x - w/2), y1 = Math.floor(y - h/2), x2 = Math.floor(x + w/2), y2 = Math.floor(y + h/2);
    for (var ty = y1; ty <= y2; ty++) {
        for (var tx = x1; tx <= x2; tx++) {
            if (this.getCollision(tx, ty)) {
                return true;
            }
        }
    }
    return false;
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

Map.prototype.findClosestFreePosition = function(x, y, w, h) {
    for (var dis = 0.1; dis < 2; dis += 0.1) {
        // Check 8 directions
        for (var a = 0; a < 8; a++) {
            var angle = 2 * Math.PI * a / 8;
            var cx = x + dis * Math.sin(angle), cy = y + dis * Math.cos(angle);
            if ((w || h) ? !this.getBoxCollision(cx, cy, w, h) : (!this.getCollision(cx, cy))) {
                return [cx, cy];
            }
        }
    }
    // Nothing found, meh!
    return [x, y];
};

Map.prototype.draw = function(ctx) {
    // Draw tiles based on zIndex of tile types (e.g. path always on top of grass)
    for (var z = tileTypes.minZIndex; z <= tileTypes.maxZIndex; z++) {
        for (var tp of tileTypes) {
            if (tp.zIndex == z) {
                // Only render visible view, instead of whole map
                var x1 = Math.floor(-state.cam.x / state.map.th) - 1;
                var y1 = Math.floor(-state.cam.y / state.map.tw) - 1;
                var x2 = x1 + 15 + 2;
                var y2 = y1 + 11 + 3;
                for (var y = y1; y < y2; y++) {
                    for (var x = x1; x < x2; x++) {
                        var tile = this.getTile(x,y);
                        if (tile) {
                            // Actual tile
                            if (tileTypes[tile.type] == tp) {
                                tile.draw(ctx);
                            }
                        } else {
                            // Outside map
                            this.defaultTile.draw(ctx, x, y);
                        }
                    }
                }
            }
        }
    }
    // Draw tile lights
    x1 = Math.floor(-state.cam.x / state.map.th) - 5;
    y1 = Math.floor(-state.cam.y / state.map.tw) - 5;
    x2 = x1 + 15 + 10;
    y2 = y1 + 11 + 11;
    x1 = Math.max(x1, 0);
    y1 = Math.max(y1, 0);
    x2 = Math.min(x2, this.tilesX);
    y2 = Math.min(y2, this.tilesY);
    for (var y = y1; y < y2; y++) {
        for (var x = x1; x < x2; x++) {
            var tile = this.getTile(x,y);
            if (tile) {
                tile.drawLight();
            }
        }
    }
};
