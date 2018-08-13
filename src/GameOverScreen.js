

function GameOverScreen() {
    this.started = false;
    this.startTime = 0;

    this.fillScreenAnimation = 10000;
    this.showStatisticsAfter = this.fillScreenAnimation + 2500;

    this.corpses = [];
    var count = 1000;
    for (var i = 0; i < count; i++) {
        var f = i / count;
        var size = 24 + f * f * f * 200;
        var maxRadius = 250 * (1 - 0.8 * f);
        var radius = Math.random() * maxRadius;
        var posAngle = Math.random() * 2 * Math.PI;
        var angle = Math.random() * 2 * Math.PI;
        var x = radius * Math.sin(posAngle);
        var y = radius * Math.cos(posAngle);
        this.corpses.push([x, y, angle, size]);
    }
}

GameOverScreen.load = function() {
    GameOverScreen.background = loader.loadImage("img/misc/background shop.png");
};

GameOverScreen.prototype.draw = function(ctx) {
    if (!state.gameOver) { return; }
    var time = +Date.now();

    if (!this.started) {
        this.started = true;
        this.startTime = time;
        var cx = ctx.canvas.width / 2, cy = ctx.canvas.height / 2;
        this.corpses.forEach(c => { c[0] += cx; c[1] += cy; });
    }

    // Fill screen with corpses
    var tdif = time - this.startTime;
    var f = tdif / this.fillScreenAnimation;
    var p = Math.pow(f, 2);
    var corpses = this.corpses.length * p;
    var spr = Corpse.sprites[1];
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    for (var i = 0; i < corpses; i++) {
        var corpse = this.corpses[i];
        drawImage(ctx, spr, corpse[0], corpse[1], corpse[3], corpse[3], 0.5, 0.5, false, corpse[2]);
    }

    // Afterwards, show statistics
    if (time > this.startTime + this.showStatisticsAfter) {
        var x = (ctx.canvas.width - GameOverScreen.background.width) / 2,
            y = (ctx.canvas.height - GameOverScreen.background.height) / 2;
        drawImage(ctx, GameOverScreen.background, x, y);
        // Days
        // Corpses buried
        // Zombies killed
        // Dollards earned
        // F5 to restart
    }
};
