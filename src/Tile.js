
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
        new TileType("Hole", ["img/grave/hole.png"], true),
        new TileType("Grave", ["img/ground/grave.png"], true),
        new TileType("Tree", ["img/ground/mud1.png"], true, false, 0, ["img/environment/tree.png", 0.5, 0.8]),
        new TileType("Path", [ "img/ground/path.png" ], false, true, 1)
    ];
    types.forEach(tp => tileTypes.push(tp));
};

// Initialized in Tile.load
var tileTypes = [];
tileTypes.minZIndex = 0;
tileTypes.maxZIndex = 0;

function TileType(name, sprites, collision, randomAngles, zIndex, decoImage) {
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
    this.decoImage = decoImage;
    if (decoImage) { decoImage[0] = loader.loadImage(decoImage[0]); }
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
    this.tileType = type;
    var spr = getRandom(type.sprites);
    if (spr) {
        this.sprite = spr;
    }
    this.angle = getRandom(type.angles);;
}

Tile.prototype.draw = function(ctx) {
    if (this.sprite) {
        var x = (this.x + 0.5) * this.map.tw;
        var y = (this.y + 0.5) * this.map.th;
        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(this.angle * Math.PI / 2);
        ctx.drawImage(this.sprite, -this.sprite.width / 2, -this.sprite.height / 2);
        ctx.restore();

        if (this.tileType.decoImage) {
            var deco = this.tileType.decoImage;
            drawImage(ctx, deco[0], x, y, null, null, deco[1], deco[2]);
        }
    }
};

Tile.prototype.getCollision = function() {
    return this.tileType.collision;
};

Tile.prototype.drawOutline = function(ctx) {
    var x = (this.x) * this.map.tw;
    var y = (this.y) * this.map.th;
    ctx.save();
    ctx.translate(x, y);
    ctx.strokeStyle = "rgba(97, 236, 22, 0.6)";
    ctx.strokeRect(0, 0, this.map.tw, this.map.th);
    ctx.restore();
};