

function Shop() {
    // All things to buy in the shop, sorted by price
    // Title, price, attribute name (for state.unlocks), description
    this.options = [
        ["Torches", 30, "torches", "Unlock the power of setting sticks on fire and sticking them into the ground."],
        ["Better Shovel", 100, "shovel2", "Get a better shovel that makes shoveling feel like a day at the beach."],
        ["Super Shovel", 500, "shovel3", "Get the Ultra Shovel 9000 to shovel like there's no tomorrow."],
        ["Maggots", 300, "maggots", "Unleash the power of maggots. Graves will take less time for decomposition."]
    ].sort((a,b) => a[1] - b[1]);
}

Shop.prototype.draw = function(ctx) {
    // Fade out everything
    ctx.fillStyle = "rgba(0,0,0,0.5)";
    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);

    // Background
    var w = 280, h = 200;
    var x = (ctx.canvas.width - w) / 2, y = (ctx.canvas.height - h) / 2;
    ctx.strokeStyle = "black";
    ctx.fillStyle = "#503421";
    ctx.fillRect(x, y, w, h);
    ctx.strokeRect(x, y, w, h);

    // Back button
    if (Shop.button(ctx, x + w/2, y + h - 20, "Leave Shop", 70)) {
        state.shopOpen = false;
    }
};

Shop.button = function(ctx, x, y, text, w) {
    // Draw
    ctx.fillStyle = "black";
    var h = 16;
    var x1 = Math.floor(x - w/2), y1 = Math.floor(y - h/2);
    ctx.fillRect(x1, y1, w, h);
    // Inside?
    var mouse = state.mousePos;
    var hover = (mouse[0] >= x1 && mouse[1] >= y1 && mouse[0] <= x1 + w && mouse[1] <= y1 + h);
    ctx.fillStyle = hover ? "white": "gray";
    ctx.fillRect(x1 + 1, y1 + 1, w - 2, h - 2);
    // Text
    ctx.fillStyle = hover ? "black" : "#111";
    ctx.textAlign = "center";
    ctx.fillText(text, x, y + 5);
    // Click?
    return hover && state.mouseClick;
};
