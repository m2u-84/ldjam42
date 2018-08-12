

function Shop() {
    // All things to buy in the shop, sorted by price
    // Title, price, attribute name (for state.unlocks), description
    this.options = [
        ["Torches", 30, "torches", "Unlock the power of\nsetting sticks on fire\nand sticking them into\nthe ground*.\n\n* disclaimer: this does\nnot actually work."],
        ["Better Shovel", 100, "shovel2", "Get a better shovel\nthat makes shoveling\nfeel like a day at\nthe beach."],
        ["Super Shovel", 500, "shovel3", "Get the Ultra\nShovel 9000 to\nshovel like there's\nno tomorrow.\nThink like a shovel.\nBe the shovel!"],
        ["Maggots", 300, "maggots", "Unleash the power\nof maggots. Graves\nwill take less time\nfor decomposition.\n\n(This is good)"],
        ["Boots", 180, "boots", "Get some good boots.\nThey are the best.\nYou're gonna love them.\n\nBuy now and get a free\ntoaster!*\n\n* Restrictions apply"],
        ["Better Axe", 100, "axe2", "This axe is not good.\nBut it is better.\nBetter than your rusty\nexcuse for a shovel.\nWhere did you get it?\nAt the toilet store?"],
        ["Super Axe", 500, "axe3", "You ever wanted to\nsay 'And my Axe!'?\nNow you can. This\naxe will do the job.\nIn fact it will do\nALL the jobs!"],
        ["World Peace", 800, "peace", "Bring peace to the world.\nWill reduce dead bodies\nsomewhat. Maybe. Even\nin peace there's death,\nafter all. Don't be sad."],
        // ["Cool Corpses", 250, "cooling", "Keep corpses cool,\nso they don't\ndecomposte\nprematurely."],
        ["Friendly Zombies", 800, "zombies2", "Zombies will respect\nyou now. They speed\nyou up instead of\nslowing you down.\nYou know you need this."],
        ["Hypnosis", 400, "hypnosis", "Earn more money with\neverything via the\npower of being a\nhypnotist! This is not\na scam."]
        // ["Zombie Virus", 200, "zombies", "Some will rise from\nthe dead early.\nMore room for corpses!\nAnd mostly harmless."],
    ].sort((a,b) => a[1] - b[1]);
    this.options.forEach(o => {
        o[3] = o[3].split("\n");
        o[4] = false; // <- unlocked?
    });
    this.page = 0;
    this.open = -1;
    this.perPage = 5;
    this.pageCount = Math.ceil(this.options.length / this.perPage);
    this.prevClick = 1;
    this.mouseClick = 0;

    this.floatingTexts = [];
}

Shop.update = function() {
    this.prevClick = this.mouseClick;
    this.mouseClick = state.mouseClick;
    this.newClick = this.mouseClick && !this.prevClick;
};

Shop.load = function() {
    Shop.buttons = [
        loader.loadImage("img/misc/button small.png"),
        loader.loadImage("img/misc/button small shadow.png"),
        loader.loadImage("img/misc/button large.png"),
        loader.loadImage("img/misc/button large shadow.png")
    ];
    Shop.background = loader.loadImage("img/misc/background shop.png");
};

Shop.prototype.draw = function(ctx) {
    // Fade out everything
    ctx.fillStyle = "rgba(0,0,0,0.5)";
    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);

    // Background
    var w = 280, h = 200;
    var x = (ctx.canvas.width - w) / 2, y = (ctx.canvas.height - h) / 2;
    /*
    ctx.strokeStyle = "black";
    ctx.fillStyle = "#503421";
    ctx.fillRect(x, y, w, h);
    ctx.strokeRect(x, y, w, h); */
    ctx.drawImage(Shop.background, x, y, w, h);

    // Left: Titles of things to buy
    var first = this.perPage * this.page;
    var bx = x + 70, by = y + 16, bw = 132;
    for (var i = 0; i < this.perPage; i++) {
        var id = first + i;
        if (id >= this.options.length) { break; }
        var article = this.options[id];
        // Button
        var s = (this.open == id ? ">" : "") + article[0];
        if (!article[4]) { s += " (" + article[1] + ")" };
        var x = bx + (this.open == id ? 8 : 0);
        if (Shop.button(ctx, x, by + 24 * (i + 1), s, bw, this.open == id || article[1] > state.money)) {
            this.open = id;
        }
    }
    // Up
    if (Shop.button(ctx, bx, by, "/\\", bw, this.page < 1)) {
        this.page--;
        this.open = -1;
    }
    // Down
    if (Shop.button(ctx, bx, by + 24 * (i + 1), "\\/", bw, this.page >= this.pageCount - 1)) {
        this.page++;
        this.open = -1;
    }

    // Right: Content of things to buy
    if (this.open >= 0) {
        var article = this.options[this.open];
        var tx = bx + 84, ty = y + 20;
        // Title
        ctx.textAlign = "left";
        ctx.fillStyle = "white";
        ctx.fillText(article[0].toUpperCase(), tx, ty);

        // Description
        var lines = article[3];
        for (var i = 0; i < lines.length; i++) {
            ctx.fillText(article[3][i], tx, ty + 20 + 16 * i);
        }
    }

    // Buy button
    var buyTitle = "Buy (" + (article ? article[1] : "") + ")";
    if (Shop.button(ctx, tx + 50, y + h - 20, buyTitle, 84, this.open < 0 || article[4])) {
        article[4] = true;
        // Take money
        shop.removeMoney(article[1]);
        // Unlock officially
        state.unlocks[article[2]] = true;
        SoundManager.play("purchase", 1);
    }

    // Back button
    if (Shop.button(ctx, x, y + h - 20, "Leave Shop", 84)) {
        state.shopOpen = false;
    }
};

Shop.button = function(ctx, x, y, text, w, disabled) {
    var h = 20;
    var x1 = Math.floor(x - w/2), y1 = Math.floor(y - h/2);
    // Inside?
    var mouse = state.mousePos;
    var hover = !disabled && (mouse[0] >= x1 && mouse[1] >= y1 && mouse[0] <= x1 + w && mouse[1] <= y1 + h);
    var imgindex = w < 100 ? 0 : 2;
    if (hover) { imgindex++; }
    var img = Shop.buttons[imgindex];
    /*
    ctx.fillStyle = "black";
    ctx.fillRect(x1, y1, w, h); */
    // ctx.fillStyle = hover ? "white": "gray";
    // ctx.fillRect(x1 + 1, y1 + 1, w - 2, h - 2);
    ctx.drawImage(img, x1, y1, w, h);
    // Text
    ctx.fillStyle = hover ? "black" : "rgba(0,0,0,0.75)";
    ctx.textAlign = "center";
    if (disabled) { ctx.globalAlpha = 0.4; }
    ctx.fillText(text, x, y + 4);
    ctx.globalAlpha = 1;
    // Click?
    return hover && this.newClick;
};

Shop.prototype.awardMoney = function(money, x, y) {
    if (state.unlocks.hypnosis) {
        money = Math.round(money * 1.2);
    }
    state.money += money;
    // Show floating text
    var text = [money, x, y, state.time];
    this.floatingTexts.push(text);
    alphaValueMap["moneyAlpha"] = 5;
};

Shop.prototype.removeMoney = function(money, x, y) {
    if (x == null || y == null) {
        x = state.player.position[0];
        y = state.player.position[1];
    }
    state.money -= money;
    var text = [-money, x, y, state.time];
    this.floatingTexts.push(text);
    alphaValueMap["moneyAlpha"] = 5;
};

Shop.prototype.drawFloatingTexts = function(ctx) {
    for (var i =  this.floatingTexts.length - 1; i >= 0; i--) {
        var text = this.floatingTexts[i];
        var value = text[0], x = text[1] * state.map.tw, y = text[2] * state.map.th, spawnTime = text[3];
        var tdif = state.time - spawnTime;
        if (tdif < 2000) {
            ctx.globalAlpha = 1;
        } else if (tdif < 3000) {
            ctx.globalAlpha = 1 - (tdif - 2000) / 1000;
        } else {
            this.floatingTexts.splice(i, 1);
            continue;
        }
        ctx.fillStyle = value > 0 ? "#f0c030" : "#ff3010";
        var s = value > 0 ? "+" + value : "-" + value;
        var yoff = tdif / 200;
        ctx.fillText(s, x, y - 5 - yoff);
    }
    ctx.globalAlpha = 1;
};
