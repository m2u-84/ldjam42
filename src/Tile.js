
const TileTypes = {
    GROUND: 0,
    HOLE: 1,
    GRAVE: 2,
    TREE: 3,
    PATH: 4
}

// Initialized in Tile.load
var tileTypes = [];

function TileType(name, sprites, collision) {
    this.name = name;
    if (sprites instanceof Array) {
        this.sprites = sprites;
    } else {
        this.sprites = [ sprites ];
    }
    this.sprites = this.sprites.map(sprite => loader.loadImage(sprite));
    this.collision = collision;
}

function Tile(x, y, tp, map) {
    this.x = x;
    this.y = y;
    this.map = map;
    this.sprite = null;
    // type refers to TileTypes list
    this.type = tp;
    // reference may refer to Grave or other static object in map that's bound to a tile
    this.reference = null;

    // Type dependent behaviour
    var type = tileTypes[tp];
    var spr = getRandom(type.sprites);
    if (spr) {
        this.sprite = spr;
    }
}

Tile.load = function() {
    tileTypes = [
        new TileType("Ground", ["img/ground/mud1.png", "img/ground/mud2.png", "img/ground/mud3.png"], false),
        new TileType("Hole", [], true),
        new TileType("Grave", [], true),
        new TileType("Tree", [], true),
        new TileType("Path", [ "img/ground/path.png" ], false)
    ];
};

Tile.prototype.draw = function(ctx) {
    if (this.sprite) {
        ctx.drawImage(this.sprite, this.x * this.map.tileWidth, this.y * this.map.tileHeight);
    }
};
