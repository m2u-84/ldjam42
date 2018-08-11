

function LightSystem(w, h) {
    this.w = w;
    this.h = h;

    this.canvas = document.createElement("canvas");
    this.ctx = this.canvas.getContext("2d");
    this.canvas.width = w;
    this.canvas.height = h;

    this.tintCanvas = document.createElement("canvas");
    this.tintCtx = this.tintCanvas.getContext("2d");
    this.tintCanvas.width = w;
    this.tintCanvas.height = h;

    this.ambientColor = "#808080";

    // document.body.appendChild(this.canvas);
    // document.body.appendChild(this.tintCanvas);
}

LightSystem.load = function() {
    LightSystem.defaultLight = loader.loadImage("img/misc/light2.png");
    LightSystem.defaulSofttLight = loader.loadImage("img/misc/light.png");
};

LightSystem.prototype.setAmbientColor = function(color) {
    this.ambientColor = color;
};

LightSystem.prototype.clear = function() {
    this.ctx.globalCompositeOperation = "source-over";
    this.ctx.fillStyle = this.ambientColor;
    this.ctx.fillRect(0, 0, this.w, this.h);
    this.ctx.globalCompositeOperation = "screen";
};

LightSystem.prototype.drawLight = function(image, x, y, size, tint, alpha) {
    if (image == null) { image = LightSystem.defaultLight; }

    var factor = size / Math.max(image.width, image.height);
    var w = image.width * factor, h = image.height * factor;

    if (alpha != null) {
        this.ctx.globalAlpha = alpha;
    }
    if (tint) {
        this.tintCtx.fillStyle = tint;
        this.tintCtx.fillRect(0, 0, this.w, this.h);
        this.tintCtx.globalCompositeOperation = "destination-in";
        this.tintCtx.drawImage(image, x - w/2, y - h/2, w, h);
        this.tintCtx.globalCompositeOperation = "source-over";
        this.ctx.drawImage(this.tintCanvas, 0, 0);
    } else {
        this.ctx.drawImage(image, x - w/2, y - h/2, w, h);
    }
    this.ctx.globalAlpha = 1;
};

LightSystem.prototype.renderToContext = function(ctx, w, h) {
    if (w == null) { w = ctx.canvas.width; }
    if (h == null) { h = ctx.canvas.height; }
    ctx.save();
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.globalCompositeOperation = "multiply";
    ctx.drawImage(this.canvas, 0, 0, w, h);
    ctx.restore();
};
