
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
}
