

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
    this.rotten = false;
    this.fillTime = 0;
    this.expirationTime = 0;
    // Center coordinate
    this.cx = (x1 + x2) / 2;
    this.cy = (y1 + y2) / 2;
}

Grave.load = function() {
    Grave.hSprite = loader.loadImage("img/grave/graveh.png");
    Grave.vSprite = loader.loadImage("img/grave/gravev.png");
    Grave.emptyhSprite = loader.loadImage("img/grave/emptygraveh.png");
    Grave.emptyvSprite = loader.loadImage("img/grave/emptygravev.png");
    Grave.rottenhSprite = loader.loadImage("img/grave/graverottenh.png");
    Grave.rottenvSprite = loader.loadImage("img/grave/graverottenv.png");
};

Grave.prototype.draw = function(ctx) {
    var img = this.empty ? ( (this.x1 == this.x2) ? Grave.emptyvSprite : Grave.emptyhSprite) : 
            (this.x1 == this.x2) ? Grave.vSprite : Grave.hSprite;
    if (this.empty && this.rotten) {
        img = (this.x1 == this.x2) ? Grave.rottenvSprite : Grave.rottenhSprite;
    }
    var x = (this.x1 + this.x2 + 1) / 2 * state.map.tw;
    var y = (this.y1 + this.y2 + 1) / 2 * state.map.th;
    drawImage(ctx, img, x, y, null, null, 0.5, 0.5, this.inverted);

};

Grave.prototype.drawProgress = function(ctx) {
    // Progress
    if (!this.empty) {
        if (state.dayTime <= this.expirationTime) {
            var x = (this.x1 + this.x2 + 1) / 2 * state.map.tw;
            var y = (this.y1 + this.y2 + 1) / 2 * state.map.th;
            // only in range of player
            if (Math.abs(this.cx - state.player.position[0]) <= 3 && Math.abs(this.cy - state.player.position[1]) <= 3) {
                var p = (state.dayTime - this.fillTime) / (this.expirationTime - this.fillTime);
                drawProgressBar(ctx, x, y, 32, p, "#8080a0");
            }
            // Give money for grave rent?
            if (state.dayTime % 1 >= 0.195 && state.lastDayTime % 1 < 0.195) {
                shop.awardMoney(5, this.cx, this.cy);
            }

            // Randomly spawn zombies
            if (state.dayTime % 0.01 < state.lastDayTime % 0.01 && state.dayTime % 1 > 0.7) {
                if (Math.random() < 0.005) {
                    // Spawn zombie
                    this.spawnZombie();
                }
            }
        } else {
            // is done! empty grave, although this is draw and not update function (but this is a game jam so it's alright)
            this.ejectCorpse();
            // Give bonus to player
            shop.awardMoney(15, this.cx, this.cy);
        }
    }
};

Grave.prototype.spawnZombie = function() {
    if (!this.empty) {
        this.ejectCorpse();
        var zx = this.cx, zy = this.cy;
        var zombie = new Zombie([zx, zy]);
        state.zombies.push(zombie);
        SoundManager.play("resurrection", 1);
        if (state.unlocks.order) {
            this.rotten = false;
        }
        return zombie;
    }
    return null;
};

Grave.prototype.takeCorpse = function(corpse) {
    this.empty = false;
    removeItem(state.corpses, corpse);
    this.fillTime = state.dayTime;
    this.expirationTime = this.fillTime + (state.unlocks.maggots ? 1.9 : 3.1);
    shop.awardMoney(50, this.cx, this.cy);
};

Grave.prototype.ejectCorpse = function() {
    this.empty = true;
    this.rotten = !state.unlocks.repair;
};

Grave.prototype.remove = function() {
    if (this.empty) {
        // Reset tiles
        state.map.set(this.x1, this.y1, TileTypes.PATH);
        state.map.set(this.x2, this.y2, TileTypes.PATH);
        removeItem(state.graves, this);
    }
};
