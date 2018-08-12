

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
}

function removeItem(array, item) {
    var index = array.indexOf(item);
    if (index >= 0) {
        array.splice(index, 1);
    }
    return index;
}

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
        var frameLeft = Math.floor(frameIndex * frameWidth);
        ctx.drawImage(img, frameLeft, 0, Math.round(frameWidth), img.height, x, y, w || frameWidth, h || img.height);
    } else if (w || h) {
        ctx.drawImage(img, x, y, w, h);
    } else {
        ctx.drawImage(img, x, y);
    }
    ctx.restore();
}

function drawProgressBar(ctx, x, y, w, p, color) {
    y -= 30;
    var h = 3;
    var x1 = x - w/2, y1 = y - h/2;
    ctx.fillStyle = "black";
    ctx.fillRect(x1 - 1, y1 - 1, w + 2, h + 2);
    ctx.fillStyle = color || "#f0b014";
    ctx.fillRect(x1, y1, w * p, h);
}