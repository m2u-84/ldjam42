

function Bat(position) {
    this.position = position;
}

Bat.load = function() {
    Bat.sprite = loader.loadImage("img/animals/bat.png", 2);
};

Bat.prototype.draw = function(ctx) {
    var x = this.position[0] * state.map.tw, y = this.position[1] * state.map.th;
    var frame = Math.floor(state.time / 400) % 2;
    drawImage(ctx, Bat.sprite, Math.floor(x), Math.floor(y) , null, null, null, null, state.bat.mirrored, 0, frame);
};

