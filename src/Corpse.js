
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
