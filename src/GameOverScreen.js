

function GameOverScreen() {
    this.started = false;
    this.startTime = 0;

    this.fillScreenAnimation = 10000;
    this.showStatisticsAfter = this.fillScreenAnimation + 1200;

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

    this.lastCorpses = 0;
}

GameOverScreen.load = function() {
    GameOverScreen.background = loader.loadImage("img/menus/game-over-screen.jpg");
    GameOverScreen.thuds = [];
    for (var i = 0; i < 20; i++) {
        GameOverScreen.thuds[i] = loader.loadAudio({src: "sounds/thud2.mp3"});
    }
    GameOverScreen.prevThud = 0;
    GameOverScreen.dancingZombie = loader.loadImage("img/character/zombieEndingSprite.png", 5);
};

GameOverScreen.playThudSound = function(volume) {
    GameOverScreen.prevThud++;
    if (GameOverScreen.prevThud >= GameOverScreen.thuds.length) { GameOverScreen.prevThud = 0; }
    var snd = GameOverScreen.thuds[GameOverScreen.prevThud];
    snd.volume = (volume != null) ? volume : 1;
    snd.play();
};

GameOverScreen.prototype.draw = function(ctx) {
    if (!state.gameOver) { return; }
    var time = +Date.now();

    if (!this.started) {
        this.started = true;
        this.startTime = time;
        var cx = ctx.canvas.width / 2, cy = ctx.canvas.height / 2;
        this.corpses.forEach(c => { c[0] += cx; c[1] += cy; });
        setTimeout(() => SoundManager.play("gameover", 1), this.fillScreenAnimation + 700);
    }

    // Fill screen with corpses
    var tdif = time - this.startTime;
    var f = tdif / this.fillScreenAnimation;
    var p = Math.pow(f, 2);
    var corpses = Math.round(Math.min(this.corpses.length * p, this.corpses.length));
    if (corpses > this.lastCorpses) {
        var modulo = Math.round(4 + 20 * p);
        if (corpses % modulo < this.lastCorpses % modulo) {
            var volume = 0.2 + p * (0.6 * p + 0.2 * Math.random() - 0.2 * Math.random());
            GameOverScreen.playThudSound(volume);
        }
        this.lastCorpses = corpses;
    }
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
        ctx.drawImage(GameOverScreen.background, x, y);
        var xm = x + GameOverScreen.background.width / 2;
        var x2 = x + GameOverScreen.background.width;
        // Days
        ctx.textAlign = "center";
        ctx.fillStyle = "white";
        ctx.shadowOffsetX = 1;
        ctx.shadowOffsetY = 1;
        ctx.shadowBlur = 2;
        ctx.shadowColor = "rgba(0, 0, 0, 1)";
        var dayy = y + 88;
        ctx.setTransform(1, 0, 0, 1, 0, 0);
        ctx.fillText("You managed to keep it up for", xm, dayy - 22);
        ctx.drawImage(gameHandler.dayCounterIcon, xm - 38, dayy - 15, 24, 24);
        ctx.textAlign = "left";
        ctx.fillText(Math.ceil(state.dayTime) + " days!", xm, dayy);
        // Corpses buried
        var rowy = dayy + 40;
        var cx = xm - 90;
        ctx.drawImage(Corpse.sprites[1], cx - 20, rowy - 12, 24, 24);
        ctx.fillText("" + state.burials, cx + 6, rowy + 4);
        ctx.textAlign = "center";
        ctx.fillText("Burials", cx, rowy + 28);
        ctx.textAlign = "left";
        // Zombies killed
        var zx = xm - 5;
        var frame = Math.floor(time / 120) % 8;
        if (frame > 4) { frame = 8 - frame; }
        drawImage(ctx, GameOverScreen.dancingZombie, zx - 20, rowy, 24, 24, 0.5, 0.5, (time % 3840 < 1920), 0, frame);
        ctx.fillText("" + state.zombiesKilled, zx, rowy + 4);
        ctx.textAlign = "center";
        ctx.fillText("Zombie Kills", zx - 3, rowy + 28);
        ctx.textAlign = "left";
        // Dollards earned
        var dx = xm + 70;
        ctx.drawImage(gameHandler.moneyCounterIcon, dx - 20, rowy - 12, 24, 24);
        ctx.fillText("" + state.moneyEarned, dx + 12, rowy + 4);
        ctx.textAlign = "center";
        ctx.fillText("Money earned", dx, rowy + 28);
        // F5 to restart
        ctx.fillText("[Press F5 to play again]", xm, rowy + 52);
    }
};
