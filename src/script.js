

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

/**
 * Use this function if you don't want to render an image immediately, but apply depth sorting, e.g.
 * for player character, trees, fences and so on. These will be rendered collectively afterwards,
 * after being sorted by their y coordinate.
 */
function drawImageSorted(ctx, img, x, y, w, h, relx, rely, mirrored, angle, frameIndex) {
    renderSorter.add(x, y,
        () => drawImage(ctx, img, x, y, w, h, relx, rely, mirrored, angle, frameIndex));
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

function getAngleDif(a1, a2) {
    var dif = (a2 - a1) % (2 * Math.PI);
    if (dif < -Math.PI) {
        dif += 2*Math.PI;
    } else if (dif > Math.PI) {
        dif -= 2*Math.PI;
    }
    return dif;
}

function getRandomSoundByTileType(sounds, tileType) {
    if (!sounds || sounds.length < 1) { return null; }
    let typeSounds = sounds.filter(sound => sound.tileTypes.includes(tileType));
    if (typeSounds.length === 0) {
        // fallback to normal ground
        typeSounds = sounds.filter(sound => sound.tileTypes.includes(TileTypes.GROUND));
    }
    var index = Math.floor(Math.random() * typeSounds.length);
    return typeSounds[index];
}

var alphaValueMap = {};
var alphaValueSpeed = 0.002;
function fadeAlpha(id, target) {
    if (alphaValueMap[id] == null) {
        alphaValueMap[id] = 0.0;
    }
    if (alphaValueMap[id] != target) {
        // Fade towards target by dt factor
        if (alphaValueMap[id] < target) {
            alphaValueMap[id] += alphaValueSpeed * state.dt;
            if (alphaValueMap[id] > target) { alphaValueMap[id] = target; }
        } else {
            alphaValueMap[id] -= alphaValueSpeed * state.dt;
            if (alphaValueMap[id] < target) { alphaValueMap[id] = target; }
        }
    }
    return alphaValueMap[id];
}
