
const TileTypes = {
    GROUND: 0,
    HOLE: 1,
    GRAVE: 2,
    TREE: 3,
    PATH: 4
}

// Initialized in Tile.load
var tileTypes = [];

function TileType(name, sprites) {
    this.name = name;
    if (sprites instanceof Array) {
        this.sprites = sprites;
    } else {
        this.sprites = [ sprites ];
    }
    this.sprites = this.sprites.map(sprite => loader.loadImage(sprite));
}

function Tile(x, y, tp) {
    this.x = x;
    this.y = y;
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
        new TileType("Ground", ["img/ground/mud1.png", "img/ground/mud2.png", "img/ground/mud3.png"]),
        new TileType("Hole", []),
        new TileType("Grave", []),
        new TileType("Path", "img/ground/path.png")
    ];
};

Tile.prototype.draw = function(ctx) {
    if (this.sprite) {
        ctx.drawImage(this.sprite, this.x, this.y);
    }
};
