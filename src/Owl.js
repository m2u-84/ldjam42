

function Owl(position) {
    this.position = position;
}

Owl.load = function() {
    Owl.sprite = loader.loadImage("img/animals/owl.png", 6);
};

Owl.prototype.draw = function(ctx) {
    var x = this.position[0] * state.map.tw, y = this.position[1] * state.map.th;
    var frame = Math.floor(state.time / 1600) % 6;
    // ctx.drawImage(Owl.sprite, 0, 0);
    drawImage(ctx, Owl.sprite, Math.floor(x), Math.floor(y) , null, null, null, null, null, 0, frame);
};

