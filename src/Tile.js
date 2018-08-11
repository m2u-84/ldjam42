
const TileTypes = {
    GROUND: 0,
    HOLE: 1,
    GRAVE: 2,
    TREE: 3,
    PATH: 4,
    STONE: 5,
    FENCE: 6,
    FENCE_SIDE: 7,
    STONE_FENCE: 8,
    STONE_FENCE_SIDE: 9
}

Tile.load = function() {
    var types = [
        new TileType("Ground", ["img/ground/mud1.png", "img/ground/mud2.png", "img/ground/mud3.png"], false, true, -1,
            [ ["img/environment/grass.png", 0.5, 0.7], ["img/environment/stone.png", 0.5, 0.8], null, null, null, null,
            null, null, null, null, null, null, null, null, null, null, null, null, null, null, null]),
        new TileType("Hole", ["img/grave/hole.png"], true),
        new TileType("Grave", ["img/ground/grave.png"], true),
        // Deco Image: [src, centerX, centerY, frames, frameDelay]
        new TileType("Tree", ["img/ground/mud1.png"], true, false, 0, ["img/environment/tree.png", 0.5, 0.8, 2, 740]),
        new TileType("Path", [ "img/ground/path.png" ], false, true, 1),
        new TileType("Stone", [ "img/ground/stonefloor.png" ], false, true, 1),
        new TileType("Fence", [ "img/ground/path.png" ], true, false, 0, ["img/environment/fence.png", 0.5, 0.8]),
        new TileType("FenceSide", [ "img/ground/path.png" ], true, false, 0, ["img/environment/fence side.png", 0.5, 0.8]),
        new TileType("StoneFence", [ "img/ground/stonefloor.png" ], true, false, 0, ["img/environment/fence.png", 0.5, 0.8]),
        new TileType("StoneFenceSide", [ "img/ground/stonefloor.png" ], true, false, 0, ["img/environment/fence side.png", 0.5, 0.8]),
    ];
    types.forEach(tp => tileTypes.push(tp));
};

// Initialized in Tile.load
var tileTypes = [];
tileTypes.minZIndex = 0;
tileTypes.maxZIndex = 0;

function TileType(name, sprites, collision, randomAngles, zIndex, decoImages) {
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
    if (decoImages) {
        if (!(decoImages[0] instanceof Array)) { decoImages = [ decoImages ]; }
        this.decoImages = decoImages;
        for (var decoImage of decoImages) {
            if (decoImage) { decoImage[0] = loader.loadImage(decoImage[0], decoImage[3]); }
        }
    }
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
    this.angle = getRandom(type.angles);
    this.randomizer = Math.random();
    if (type.decoImages) {
        this.decoImage = getRandom(type.decoImages);
    }
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

        if (this.decoImage) {
            var deco = this.decoImage;
            var frame = null;
            if (deco[4]) { frame = Math.floor(this.randomizer * deco[3] + state.time / deco[4]) % deco[3]; }
            drawImage(ctx, deco[0], x, y, null, null, deco[1], deco[2], null, null, frame);
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
    ctx.strokeStyle = "rgba(97, 236, 22, 0.3)";
    ctx.strokeRect(0, 0, this.map.tw, this.map.th);
    ctx.restore();
};