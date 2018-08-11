
const TileTypes = {
    GROUND: 0,
    HOLE: 1,
    GRAVE: 2,
    TREE: 3,
    PATH: 4
}

Tile.load = function() {
    var types = [
        new TileType("Ground", ["img/ground/mud1.png", "img/ground/mud2.png", "img/ground/mud3.png"], false, true, -1),
        new TileType("Hole", [], true),
        new TileType("Grave", [], true),
        new TileType("Tree", [], true),
        new TileType("Path", [ "img/ground/path.png" ], false, true, 1)
    ];
    types.forEach(tp => tileTypes.push(tp));
};

// Initialized in Tile.load
var tileTypes = [];
tileTypes.minZIndex = 0;
tileTypes.maxZIndex = 0;

function TileType(name, sprites, collision, randomAngles, zIndex) {
    this.name = name;
    if (sprites instanceof Array) {
        this.sprites = sprites;
    } else {
        this.sprites = [ sprites ];
    }
    this.sprites = this.sprites.map(sprite => loader.loadImage(sprite));
    this.collision = collision;
    this.angles = randomAngles ? [0, 1, 2, 3] : [0];
    this.zIndex = zIndex || 0;
    tileTypes.minZIndex = Math.min(tileTypes.minZIndex, this.zIndex);
    tileTypes.maxZIndex = Math.max(tileTypes.maxZIndex, this.zIndex);
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
    this.angle = getRandom(type.angles);;
}

Tile.prototype.draw = function(ctx) {
    if (this.sprite) {
        var x = this.x * this.map.tw;
        var y = this.y * this.map.th;
        ctx.save();
        ctx.translate(x + this.map.tw / 2, y + this.map.th / 2);
        ctx.rotate(this.angle * Math.PI / 2);
        ctx.drawImage(this.sprite, -this.sprite.width / 2, -this.sprite.height / 2);
        ctx.restore();
    }
};
