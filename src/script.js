

window.onload = () => {
    var gameDiv = document.getElementById("game");
    gameHandler = new GameHandler(gameDiv);
};

var inherit = function (child, parent) {
    child.prototype = Object.create(parent.prototype);
};

function getRandom(array) {
    if (!array || array.length < 1) { return null; }
    var index = Math.floor(Math.random() * array.length);
    return array[index];
};

function drawImage(ctx, img, x, y, w, h, relx, rely, mirrored, angle, frameIndex) {
    if (relx == null) { relx = 0.5; }
    if (rely == null) { rely = 1.0; }
    if (frameIndex != undefined) {
        var frameWidth = img.width / img.frameCount;
    }
    ctx.save();
    ctx.translate(x, y);
    x = -relx * (frameWidth || img.width);
    y = -rely * (frameWidth || img.height);
    if (mirrored) {
        ctx.scale(-1, 1);
    }
    if (angle) {
        ctx.rotate(angle);
    }
    if (frameWidth != undefined) {
        ctx.drawImage(img, frameIndex * frameWidth, 0, frameWidth, img.height, x, y, w || frameWidth, h || img.height);
    } else if (w || h) {
        ctx.drawImage(img, x, y, w, h);
    } else {
        ctx.drawImage(img, x, y);
    }
    ctx.restore();
}