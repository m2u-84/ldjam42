
function Corpse(position) {
    Entity.call(this, position);
    this.angle = Math.random() * 2 * Math.PI;
    this.sprite = getRandom(Corpse.sprites);
}
inherit(Corpse, Entity);

Corpse.load = function() {
    Corpse.sprites = [
        loader.loadImage("img/character/corpse.png"),
        loader.loadImage("img/character/corpseBag.png")
    ];
    Corpse.countingSprites = [
        loader.loadImage("img/character/corpseBag.png"),
        loader.loadImage("img/character/corpseBagYellow.png"),
        loader.loadImage("img/character/corpseBagRed.png")
    ];
};

Corpse.prototype.draw = function(ctx) {
    drawImage(ctx, this.sprite, this.position[0] * state.map.tw, this.position[1] * state.map.th,
            null, null, 0.5, 0.5, false, this.angle);
};

Corpse.prototype.setPosition = function(pos) {
    if (this.position) {
        var prevx = this.position[0], prevy = this.position[1];
        var newx = pos[0], newy = pos[1];
        // When corpse is pulled, apply angle to adjust to pull direction
        if (newx != prevx || newy != prevy) {
            var dx = newx - prevx, dy = newy - prevy;
            var dis = Math.sqrt(dx * dx + dy * dy);
            var targetAngle = Math.atan2(dy, dx) + Math.PI / 2;
            // Allow to rotate either way, head first or feet first
            var dif = getAngleDif(this.angle, targetAngle);
            if (Math.abs(dif) > Math.PI / 2) {
                targetAngle = this.angle + (dif > 0 ? (dif - Math.PI) : (dif + Math.PI));
            } else {
                targetAngle = this.angle + dif;
            }
            // Update factor depending on how far character is pulled
            var f = Math.min(dis / (dis + 0.05), 0.1);
            this.angle = f * targetAngle + (1 - f) * this.angle;
        }
    }
    // Actual change position
    Entity.prototype.setPosition.call(this, pos);
};

Corpse.displayCount = function(ctx, x, y, count) {
    if (count <= 0) { return; }
    ctx.save();
    ctx.setTransform(1, 0, 0, 1, x, y);
    ctx.scale(0.75, 0.75);
    let row = 0;
    let column = 0;
    let corpseImageIndex = 0;
    for (var i = 0; i < count; i++) {
        if (column === 12) {
            corpseImageIndex = 1;
        }

        if (column === 30) {
            corpseImageIndex = 2;
        }

        if (column >= 38) {
            state.gameOver = true;
        }

        // if (column === 38) {
        //     if(corpseImageIndex === 2) {
        //         state.gameOver = true;
        //     }
        //     corpseImageIndex = corpseImageIndex <= 1 ? corpseImageIndex + 1 : corpseImageIndex; 
        //     column = 0;
        // }

        ctx.drawImage(Corpse.countingSprites[corpseImageIndex], 11 * column, row * (-30));
        column += 1;
    }
    ctx.restore();
};

Corpse.displayCount2 = function(ctx, x, y, corpses) {
    if (corpses.length <= 0) { return; }
    ctx.save();
    ctx.setTransform(1, 0, 0, 1, x, y);
    ctx.scale(0.75, 0.75);
    let row = 0;
    let column = 0;
    for (let corpse of corpses) {
        if (column < 38) {
            ctx.drawImage(corpse.sprite, 11 * column, row * (-30));
            column += 1;
        } else {
            row += 1;
            column = 0;
        }
    }
    ctx.restore();
};
