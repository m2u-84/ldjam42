function GameHandler(parentElement) {
    this.parentElement = parentElement;

    loader = new Loader();
    keyHandler = new KeyHandler(window, ["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown", "e", "w", "a", "s", "d",
        "f"]);
    renderSorter = new RenderSorter();
    this.corpseHandler = new CorpseHandler();
    this.startScreen = new StartScreen();

    window.addEventListener("keydown", this.handleKeyDown.bind(this));

    this.classes = [
        // Player, Zombies, Corpses, Graves, ...
        Tile,
        Map,
        Entity,
        Character,
        Player,
        Corpse,
        Grave,
        LightSystem,
        Shop,
        CorpseHandler,
        SoundManager,
        Zombie,
        StartScreen,
        Owl
    ].map(c => ({class: c, instances: []}));

    // Global game state which can be accessed by all game objects
    window.state = this.state = {
        debugMode: false,
        currentTime: 0,
        dt: 0,
        map: new Map(32, 32, 24, 24),
        player: new Player([16.5,21.5]),
        corpses: [],
        unloadingCorpses: [],
        zombies: [],
        graves: [],
        keyStates: keyHandler.keyStates,
        cam: { x: 0, y: 0 },
        money: 50,
        shopOpen: false,
        startScreen: true,
        pauseScreen: false,
        readyToShop: false,
        mousePos: [],
        mouseClick: false,
        unlocks: {
            torches: false, // TODO
            shovel2: false, // TODO
            shovel3: false, // TODO
            axe2: false, // TODO
            axe3: false, // TODO
            maggots: false, // TODO
            boots: false,
            cooling: false, // TODO
            zombies: false, // TODO
            zombies2: false, // TODO
            hypnosis: false // TODO
        },
        initialSpawnAmount: 5,
        spawnIncreaseRate: 0.3,
        spawnAnimationTime: 0.035,
        spawningGap: 0.005,
        owl: null
    };

    this.startTime = +Date.now();
    this.currentTime = 0;
    this.lastTime = this.startTime;

    // Setup canvas
    this.canvas = document.createElement("canvas");
    this.canvas.width = 320;
    this.canvas.height = 240;
    this.ctx = this.canvas.getContext("2d");
    this.ctx.font = "10px Arial";
    parentElement.appendChild(this.canvas);

    lightSystem = new LightSystem(320, 240);
    lightSystem.setAmbientColor("#404070");

    shop = new Shop();

    musicManager = new MusicManager([
        document.getElementById("music1"),
        document.getElementById("music2"),
        document.getElementById("music3"),
    ]);

    parentElement.addEventListener("mousemove", this.handleMouse.bind(this));
    parentElement.addEventListener("mousedown", this.handleMouseDown.bind(this));
    parentElement.addEventListener("mouseup", this.handleMouseUp.bind(this));


    // First load all the things, then start render and update loops
    this.load().then(() => {

        // Create some corpses
        for (var i = 0; i < 0; i++) {
            var corpse = new Corpse([Math.random() * 20, 30]);
            state.corpses.push(corpse);
        }

        // Create zombies
        for (var i = 0; i < 0; i++) {
            var zombie = new Zombie([Math.random() * 20, Math.random() * 20]);
            state.zombies.push(zombie);
        }

        this.gameLoop();
        this.renderLoop();
    });
}

GameHandler.prototype.load = function() {
    for (var c of this.classes) {
        if (c.class.load) {
            c.class.load();
        }
    }
    state.map.load();
    this.pauseScreenImage = loader.loadImage("img/misc/instructions transparent3.png");
    this.dayCounterIcon = loader.loadImage("img/hud/calendar.png");
    this.moneyCounterIcon = loader.loadImage("img/hud/moneybag.png");
    return loader.loadAll();
};

GameHandler.prototype.gameLoop = function() {
    // Time management
    var t = +Date.now();
    var dt = t - this.lastTime;

    if (state.startScreen || state.pauseScreen || state.shopOpen) { dt = 0; }

    this.lastTime = t;
    this.currentTime += dt;
    state.time = this.currentTime;
    state.lastDayTime = state.dayTime;
    state.dayTime = state.time / 120000;
    state.dt = dt;
    state.lastTime = this.lastTime;

    // Update all classes and instances
    for (var c of this.classes) {
        // Static update
        if (c.class.update) {
            c.class.update(dt, this.currentTime);
        }
        // Instances
        if (c.instances.length > 0 && c.instances[0].update) {
            for (var i of c.instances) {
                i.update(dt, this.currentTime);
            }
        }
    }

        state.map.update();
        state.zombies.forEach(z => z.update(dt));
        state.player.update(dt);
        this.corpseHandler.update(dt);

    requestAnimationFrame(this.gameLoop.bind(this));
};

    GameHandler.prototype.startGame = function() {
        this.startTime = +Date.now();
        this.lastTime = +Date.now();
        this.currentTime = 0;
        state.dayTime = 0;
        state.lastDayTime = 0;
        state.startScreen = false;
    };

GameHandler.prototype.renderLoop = function() {
    // Clear stuff
    this.ctx.setTransform(1, 0, 0, 1, 0, 0);
    this.ctx.fillStyle = "black";
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    state.cam = {
        x: Math.round(-state.player.position[0] * state.map.tw + this.canvas.width / 2),
        y: Math.round(-state.player.position[1] * state.map.tw + this.canvas.height / 2)
    }

    this.ctx.translate(state.cam.x, state.cam.y);


    lightSystem.setAmbientColor(getAmbientColor(state.dayTime % 1));
    lightSystem.clear();
    renderSorter.clear();

    state.map.draw(this.ctx);
    state.graves.forEach(g => g.draw(this.ctx));
    state.corpses.forEach(c => c.draw(this.ctx));
    state.zombies.forEach(z => z.draw(this.ctx));
    state.player.draw(this.ctx);
    renderSorter.render();
    if (state.owl) state.owl.draw(this.ctx);

    lightSystem.drawLight(null, 160, 120, 200, "#ffffff", 0.6);
    // lightSystem.drawLight(null, 160 + 160 * Math.sin(state.time * 0.001), 120 + 120 * Math.sin(state.time * 0.00132), 130, "#3030ff", 0.6);
    lightSystem.renderToContext(this.ctx);

    // HUD (in world)
    state.graves.forEach(g => g.drawProgress(this.ctx));
    shop.drawFloatingTexts(this.ctx);

    // HUD (screen)
    this.ctx.setTransform(1, 0, 0, 1, 0, 0);
    // Corpse Count
    // Corpse.displayCount(this.ctx, -4, this.canvas.height - 20, state.corpses.length - state.unloadingCorpses.length);
    Corpse.displayCount2(this.ctx, -4, this.canvas.height - 20, state.corpses.filter(c => !state.unloadingCorpses.includes(c)));
    // Shop Info
    var display = (state.map.getTile(state.player.tile[0], state.player.tile[1]) == state.map.shopTile);
    state.readyToShop = display;
    var alpha = fadeAlpha("shopInfoText", display ? 1 : 0);
    if (alpha > 0) {
        this.ctx.textAlign = "center";
        var y = this.canvas.height * (0.8 + 0.03 * Math.sin(state.time * 0.003));
        this.ctx.fillStyle = "white";
        this.ctx.globalAlpha = alpha;
        this.ctx.fillText("Press E to shop", this.canvas.width / 2, y);
    }
    this.ctx.globalAlpha = 1;

    // Shop
    if (state.shopOpen) {
        shop.draw(this.ctx);
    }

    // Pause Screen
    if (state.pauseScreen) {
        // Add additional black layer, as transparency of image turned out to be too low
        this.ctx.fillStyle = "rgba(0,0,0,0.25)";
        this.ctx.fillRect(0,0,this.canvas.width, this.canvas.height);
        // Draw instruction screen
        this.ctx.drawImage(this.pauseScreenImage, 0, 0, this.canvas.width, this.canvas.height);
    }

    // Money counter
    this.ctx.shadowOffsetX = 1;
    this.ctx.shadowOffsetY = 1;
    this.ctx.shadowBlur = 1;
    this.ctx.shadowColor = "rgba(0, 0, 0, 1)";

    alpha = fadeAlpha("moneyAlpha", display ? 2 : 0.7);

    if (alpha > 0) {
        this.ctx.globalAlpha = alpha;
        this.ctx.drawImage(this.moneyCounterIcon, 5, 2, 16, 16);
        this.ctx.fillStyle = "#f0c030";
        this.ctx.textAlign = "left";
        this.ctx.fillText(this.state.money, 24, 14);
    }

    this.ctx.globalAlpha = 1;

    // Day counter
    var offset = state.dayTime < 10 ? 54 : 62;
    this.ctx.drawImage(this.dayCounterIcon, this.canvas.width - offset, 2, 16, 16);
    this.ctx.fillStyle = "white";
    this.ctx.textAlign = "left";
    this.ctx.fillText("Day " + Math.ceil(state.dayTime), this.canvas.width - offset + 21, 14);

    // In Debug mode, show exact time
    if (state.debugMode) {
        var time = 24 * (state.dayTime % 1);
        var hours = Math.floor(time);
        var minutes = Math.floor(60 * (time - hours));
        var timeString = hours + ":" + ((minutes < 10) ? "0" : "") + minutes;
        this.ctx.fillText(timeString, this.canvas.width - offset + 21, 32);
        this.ctx.textAlign = "center";
        this.ctx.fillText("- Debug Mode - ", this.canvas.width / 2, 14);
    }

    this.ctx.shadowOffsetX = 0;
    this.ctx.shadowOffsetY = 0;
    this.ctx.shadowBlur = 0;

    if (state.startScreen) {
        this.startScreen.draw(this.ctx);
        window.onkeydown = function(e) { state.startScreen = false }
    }

    requestAnimationFrame(this.renderLoop.bind(this));
};

var ambientColors = [
    [0.1, 0.1, 0.5],
    [0.1, 0.1, 0.5],
    [0.25, 0.25, 0.5],
    [0.5, 0.42, 0.52],
    [1.0, 0.8, 0.55],
    [1.0, 1.0, 1.0],
    [1.0, 1.0, 1.0],
    [0.8, 0.55, 0.4],
    [0.5, 0.5, 0.45],
    [0.25, 0.25, 0.5],
    [0.15, 0.15, 0.5],
    [0.1, 0.1, 0.5]
];
function getAmbientColor(t) {
    var colors = ambientColors.length;
    var index = t * colors;
    var index1 = Math.floor(index);
    if (index1 >= colors - 1) { return ambientColors[0]; }
    var f = index - index1;
    var f1 = 1 - f;
    var c1 = ambientColors[index1];
    var c2 = ambientColors[index1 + 1];
    return "rgb(" + Math.round(255 * (f * c2[0] + f1 * c1[0])) + "," + Math.round(255 * (f * c2[1] + f1 * c1[1]))
            + "," + Math.round(255 * (f * c2[2] + f1 * c1[2])) + ")";
}


GameHandler.prototype.handleMouse = function(e) {
    var mx = (e.clientX - this.canvas.offsetLeft) * this.canvas.width / this.canvas.offsetWidth;
    var my = (e.clientY - this.canvas.offsetTop + window.scrollY) * this.canvas.height / this.canvas.offsetHeight;
    state.mousePos = [mx, my];
};

GameHandler.prototype.handleMouseDown = function(e) {
    state.mouseClick = true;
};

GameHandler.prototype.handleMouseUp = function(e) {
    state.mouseClick = false;
};

GameHandler.prototype.handleKeyDown = function(e) {
    if (e.key == "p" || e.key == "Escape") {
        state.pauseScreen = !state.pauseScreen;
    } else if (e.key == "D") {
        if (e.ctrlKey && e.shiftKey) {
            state.debugMode = !state.debugMode;
        }
    } else if (e.key == "g") {
        if (state.debugMode) {
            shop.awardMoney(250);
        }
    }
};
