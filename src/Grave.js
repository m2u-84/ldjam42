

function Grave(x1, y1, x2, y2) {
    this.x1 = x1;
    this.y1 = y1;
    this.x2 = x2;
    this.y2 = y2;
    state.map.set(x1, y1, TileTypes.GRAVE);
    state.map.set(x2, y2, TileTypes.GRAVE);
    this.tile1 = state.map.getTile(x1, y1);
    this.tile2 = state.map.getTile(x2, y2);
    this.tile1.reference = this;
    this.tile2.reference = this;
    this.inverted = (x1 < x2);
    this.empty = true;
    this.fillTime = 0;
    this.expirationTime = 0;
}

Grave.load = function() {
    Grave.hSprite = loader.loadImage("img/grave/graveh.png");
    Grave.vSprite = loader.loadImage("img/grave/gravev.png");
    Grave.emptyhSprite = loader.loadImage("img/grave/emptygraveh.png");
    Grave.emptyvSprite = loader.loadImage("img/grave/emptygravev.png");
};

Grave.prototype.draw = function(ctx) {
    var img = this.empty ? ( (this.x1 == this.x2) ? Grave.emptyvSprite : Grave.emptyhSprite) : 
            (this.x1 == this.x2) ? Grave.vSprite : Grave.hSprite;
    var x = (this.x1 + this.x2 + 1) / 2 * state.map.tw;
    var y = (this.y1 + this.y2 + 1) / 2 * state.map.th;
    drawImage(ctx, img, x, y, null, null, 0.5, 0.5, this.inverted);

    // Progress
    if (!this.empty) {
        if (state.dayTime <= this.expirationTime) {
            var p = (state.dayTime - this.fillTime) / (this.expirationTime - this.fillTime);
            drawProgressBar(ctx, x, y, 32, p);
        } else {
            // is done! empty grave, although this is draw and not update function (but this is a game jam so it's alright)
            this.ejectCorpse();
        }
    }
};

Grave.prototype.takeCorpse = function(corpse) {
    this.empty = false;
    removeItem(state.corpses, corpse);
    this.fillTime = state.dayTime;
    this.expirationTime = this.fillTime + 3;
};

Grave.prototype.ejectCorpse = function() {
    this.empty = true;
    // Spawn zombie?
    // TODO Spawn zombie randomly, if zombies have been unlocked
};
