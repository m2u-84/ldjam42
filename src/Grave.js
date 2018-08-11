

function Grave(x1, y1, x2, y2) {
    this.x1 = x1;
    this.y1 = y1;
    this.x2 = x2;
    this.y2 = y2;
    this.tile1 = state.map.getTile(x1, y1);
    this.tile2 = state.map.getTile(x2, y2);
    state.map.set(x1, y1, TileTypes.GRAVE);
    state.map.set(x2, y2, TileTypes.GRAVE);
    this.inverted = (x1 < x2);
}

Grave.load = function() {
    Grave.hSprite = loader.loadImage("img/grave/graveh.png");
    Grave.vSprite = loader.loadImage("img/grave/gravev.png");
};

Grave.prototype.draw = function(ctx) {
    var img = (this.x1 == this.x2) ? Grave.vSprite : Grave.hSprite;
    var x = (this.x1 + this.x2 + 1) / 2 * state.map.tw;
    var y = (this.y1 + this.y2 + 1) / 2 * state.map.th;
    drawImage(ctx, img, x, y, null, null, 0.5, 0.5, this.inverted);
};
