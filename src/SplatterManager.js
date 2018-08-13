

function SplatterManager() {
    this.splatters = [];
}

SplatterManager.load = function() {
    SplatterManager.sprite = loader.loadImage("img/misc/splatter.png", 5);
}

SplatterManager.prototype.update = function(dt) {
    for (var i = this.splatters.length - 1; i >= 0; i--) {
        var del = this.splatters[i].update(dt);
        if (del) {
            this.splatters.splice(i, 1);
        }
    }
};

SplatterManager.prototype.draw = function(ctx) {
    for (var i = 0; i < this.splatters.length; i++) {
        this.splatters[i].draw(ctx);
    }
};

SplatterManager.prototype.add = function(x, y, d) {
    var splatter = new Splatter(x, y, d);
    this.splatters.push(splatter);
};




function Splatter(x, y, direction) {
    this.x = x;
    this.y = y;
    this.direction = direction;
    this.startTime = state.dayTime;
    this.duration = 0.0025;
    this.endTime = this.startTime + this.duration;
    this.mirror = Math.random() < 0.5;
}

Splatter.prototype.update = function(dt) {
    // End?
    if (state.dayTime > this.endTime) {
        return true;
    }
};

Splatter.prototype.draw = function(ctx) {
    var x = this.x * state.map.tw, y = this.y * state.map.th;
    var p = (state.dayTime - this.startTime) / this.duration;
    var frame = Math.floor(p * 5);
    if (frame >= 0 && frame < 5) {
        drawImageSorted(ctx, SplatterManager.sprite, x, y, null, null, 0.5, 1, this.mirror, this.direction, frame);
    }
};
