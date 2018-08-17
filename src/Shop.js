

function Shop() {
    // All things to buy in the shop, sorted by price
    // Title, price, attribute name (for state.unlocks), description
    this.options = [
        ["Torches", 20, "torches", "Unlock the power of\nsetting sticks on fire\nand sticking them into\nthe ground.\n"],
        ["Better Shovel", 100, "shovel2", "Get a better shovel\nthat makes shoveling\nfeel like a day at\nthe beach."],
        ["Super Shovel", 1000, "shovel3", "Get the Ultra\nShovel 9000 to\nshovel like there's\nno tomorrow.\nThink like a shovel.\nBe the shovel!"],
        ["Maggots", 500, "maggots", "Unleash the power\nof maggots. Graves\nwill take less time\nfor decomposition.\n\n(This is good)"],
        ["Boots", 200, "boots", "Get some good boots.\nThey are the best.\nYou're gonna love them.\n\nBuy now and get a free\ntoaster!*\n\n* Restrictions apply"],
        ["Better Axe", 150, "axe2", "This axe is not good.\nBut it is better.\nBetter than your rusty\nexcuse for an axe.\nWhere did you get it?\nAt the toilet store?"],
        ["Super Axe", 1200, "axe3", "You ever wanted to\nsay 'And my Axe!'?\nNow you can. This\naxe will do the job.\nIn fact it will do\nALL the jobs!"],
        ["World Peace", 1000, "peace", "Bring peace to the world.\nWill reduce dead bodies\nsomewhat. Maybe. Even\nin peace there's death,\nafter all. Don't be sad."],
        // ["Cool Corpses", 250, "cooling", "Keep corpses cool,\nso they don't\ndecomposte\nprematurely."],
        ["Friendly Zombies", 3600, "zombies2", "Zombies will respect\nyou now. They speed\nyou up instead of\nslowing you down.\nYou know you need this."],
        ["Hypnosis", 750, "hypnosis", "Earn more money with\neverything via the\npower of being a\nhypnotist! This is not\na scam."],
        ["Grow East", 400, "east", "Expand.\nThe East is nice.\nBut is space really\nwhat you're lacking?"],
        ["Grow West", 600, "west", "Expand.\West is where\nthe nice things are.\nEnjoy the weather,\nthe cocktails, and\nlong weekends!"],
        ["Grow North", 800, "north", "Expand.\nSpace will still be\nrunning out later.\nBecome King in the\nNorth!"],
        ["Orderly Zombies", 1500, "order", "Zombies leave their\ngraves all clean and\ntidy. So you can\nreuse them without any\nfurther work required!"],
        ["Auto Repair", 5000, "repair", "Gain the power to\nauto repair rotten graves\nwhen their corpse is\ngone. Optimize\nthroughput!"]
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

    this.focusButton = 100;

    this.floatingTexts = [];
}

Shop.update = function() {
    Shop.prevClick = Shop.mouseClick;
    Shop.mouseClick = state.mouseClick;
    Shop.newClick = Shop.mouseClick && !Shop.prevClick;
};

Shop.load = function() {
    Shop.buttons = [
        loader.loadImage("img/misc/button-small.png"),
        loader.loadImage("img/misc/button-small-shadow.png"),
        loader.loadImage("img/misc/button-large.png"),
        loader.loadImage("img/misc/button-large-shadow.png")
    ];
    Shop.background = loader.loadImage("img/menus/shop-screen.jpg");
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
    var bx = x + 78, by = y + 22, bw = 132;
    for (var i = 0; i < this.perPage; i++) {
        var id = first + i;
        if (id >= this.options.length) { break; }
        var article = this.options[id];
        // Button
        var s = (this.open == id ? ">" : "") + article[0];
        // if (!article[4]) { s += " (" + article[1] + ")" };
        if (!state.unlocks[article[2]]) { s += " (" + article[1] + ")" };
        if (Shop.button(ctx, bx, by + 22 * (i + 1), s, bw, state.unlocks[article[2]], this.open == id, id)) {
            this.open = id;
        }
    }
    // Up
    if (Shop.button(ctx, bx, by, "/\\     More Items     /\\", bw, this.page < 1, null, 101)) {
        this.page--;
        this.open = -1;
    }
    // Down
    if (Shop.button(ctx, bx, by + 22 * (i + 1), "\\/     More Items     \\/", bw, this.page >= this.pageCount - 1, null, 102)) {
        this.page++;
        this.open = -1;
    }

    // Right: Content of things to buy
    var tx = bx + 75, ty = y + 24;
    if (this.open >= 0) {
        var article = this.options[this.open];
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
    var buyTitle = this.open < 0 ? "Buy" : ("Buy (" + (article ? article[1] : "") + ")");
    var article = this.options[this.open];
    var disabled = this.open < 0 || state.unlocks[article[2]] || article[1] > state.money;
    if (Shop.button(ctx, tx + 50, y + h - 22, buyTitle, 84, disabled, null, 103)) { // article[4])) {
        // article[4] = true;
        // Take money
        shop.removeMoney(article[1]);
        loader.loadAudio({src: "sounds/shop_purchase.wav", volume: 0.35}).play();
        // Unlock officially
        state.unlocks[article[2]] = true;
        SoundManager.play("purchase", 1);
        // Close shop
        state.shopOpen = false;
    }

    // Back button
    if (Shop.button(ctx, bx, y + h - 22, "Leave Shop", 84, null, null, 100)) {
        state.shopOpen = false;
    }
};

Shop.button = function(ctx, x, y, text, w, disabled, pressed, id) {
    var h = 20;
    var x1 = Math.floor(x - w/2), y1 = Math.floor(y - h/2);
    // Inside?
    var mouse = state.mousePos;
    var focused = (id == shop.focusButton);
    var hover = !disabled && !pressed && (mouse[0] >= x1 && mouse[1] >= y1 && mouse[0] <= x1 + w && mouse[1] <= y1 + h);
    var imgindex = w < 100 ? 0 : 2;
    if (hover) { imgindex++; shop.focusButton = id; }
    var img = Shop.buttons[imgindex];
    /*
    ctx.fillStyle = "black";
    ctx.fillRect(x1, y1, w, h); */
    // ctx.fillStyle = hover ? "white": "gray";
    // ctx.fillRect(x1 + 1, y1 + 1, w - 2, h - 2);
    ctx.save();
    if (focused) {
        ctx.shadowOffsetX = 0;
        ctx.shadowOffsetY = 0;
        ctx.shadowBlur = 3;
        ctx.shadowColor = "rgba(255, 200, 45, 0.8)";
    }
    drawImage(ctx, img, x1 + w/2, y1 + h/2, w, h, 0.5, 0.5, false, pressed ? Math.PI : 0);
    ctx.restore();
    // ctx.drawImage(img, x1, y1, w, h);
    // Text
    ctx.fillStyle = hover || focused ? "black" : "rgba(0,0,0,0.75)";
    ctx.textAlign = "center";
    if (disabled) { ctx.globalAlpha = 0.4; }
    var prevFont = ctx.font;
    if (hover || focused) { ctx.font = "bold 10px Arial"; }
    ctx.fillText(text, x, y + 4);
    ctx.font = prevFont;
    ctx.globalAlpha = 1;
    // Click?
    return hover && Shop.newClick;
};

Shop.prototype.awardMoney = function(money, x, y) {
    if (state.unlocks.hypnosis) {
        money = Math.round(money * 1.2);
    }
    state.moneyEarned += money;
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

Shop.prototype.handleKeyDown = function(e) {
    var key = e.key.toLowerCase();
    if (key == "e" || key == "enter") {
        if (this.focusButton >= 100) {
            if (this.focusButton == 100) {
                // Leave
                state.shopOpen = false;
            } else if (this.focusButton == 102) {
                if (this.page < 2) { this.page++ }
            } else if (this.focusButton == 101) {
                if (this.page > 0) { this.page--; }
            } else if (this.focusButton == 103) {
                // Buy
                if (this.open >= 0) {
                    var article = this.options[this.open]
                    if (state.money >= article[1]) {
                        if (!state.unlocks[article[2]]) {
                            // Buy!
                            this.focusButton = 100;
                            shop.removeMoney(article[1]);
                            loader.loadAudio({src: "sounds/shop_purchase.wav", volume: 0.35}).play();
                            state.unlocks[article[2]] = true;
                            SoundManager.play("purchase", 1);
                        }
                    }
                }
            }
        } else {
            // Move to buy button
            this.focusButton = 103;
        }
    } else if (key == "arrowright" || key == "d" || key == "right") {
        this.focusButton = 103;
    } else if (key == "arrowleft" || key == "a" || key == "left") {
        if (this.focusButton == 103) {
            this.focusButton = 100;
        }
    } else {
        var up = key == "arrowup" || key == "w";
        var down = key == "arrowdown" || key == "s";
        var ud = (up ? 1 : 0) - (down ? 1 : 0);
        if (ud) {
            if (this.focusButton < 100) {
                // one of the items is selected
                var other = this.focusButton - ud;
                // would be page change?
                if (Math.floor(other / this.perPage) != Math.floor(this.focusButton / this.perPage)) {
                    if (ud > 0) {
                        this.focusButton = 101;
                    } else {
                        this.focusButton = 102;
                    }
                } else {
                    this.focusButton = other;
                }
            } else if (this.focusButton == 100) {
                // Leave is selected
                if (ud > 0) {
                    this.focusButton = 102;
                }
            } else if (this.focusButton == 102) {
                // Move up is selected
                if (ud > 0) {
                    // Select lowest visible item
                    this.focusButton = this.perPage * this.page + this.perPage - 1;
                } else {
                    // Focus leave button
                    this.focusButton = 100;
                }
            } else if (this.focusButton == 101) {
                // Move up is selected
                if (ud < 0) {
                    // Select highest visible item
                    this.focusButton = this.perPage * this.page;
                }
            }
            // if item was selected, show it
            if (this.focusButton < 100) {
                if (this.focusButton < 0) { this.focusButton = 0; }
                if (this.focusButton >= this.options.length) { this.focusButton = this.options.length - 1; }
                this.open = this.focusButton;
            }
        }
    }
};
