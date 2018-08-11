

function GameHandler(parentElement) {
    this.parentElement = parentElement;

    loader = new Loader();
    keyHandler = new KeyHandler(window, ["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown", "e", "w", "a", "s", "d"]);

    this.classes = [
        // Player, Zombies, Corpses, Graves, ...
        Tile,
        Map,
        Entity,
        Character,
        Player,
        Corpse
    ].map(c => ({class: c, instances: []}));

    // Global game state which can be accessed by all game objects
    window.state = this.state = {
        map: new Map(20, 20, 24, 24),
        player: new Player([8, 5]),
        corpses: [],
        keyStates: keyHandler.keyStates
    };

    this.startTime = +Date.now();
    this.currentTime = 0;
    this.lastTime = this.startTime;

    // Setup canvas
    this.canvas = document.createElement("canvas");
    this.canvas.width = 320;
    this.canvas.height = 240;
    this.ctx = this.canvas.getContext("2d");
    parentElement.appendChild(this.canvas);



    // First load all the things, then start render and update loops
    this.load().then(() => {

        // Create some corpses
        for (var i = 0; i < 5; i++) {
            var corpse = new Corpse([Math.random() * 20 * state.map.tw, Math.random() * 20 * state.map.th]);
            state.corpses.push(corpse);
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
    return loader.loadAll();
};

GameHandler.prototype.gameLoop = function() {
    // Time management
    var t = +Date.now();
    var dt = t - this.lastTime;
    this.lastTime = t;
    this.currentTime += dt;

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

    state.player.update(dt);

    requestAnimationFrame(this.gameLoop.bind(this));
};

GameHandler.prototype.renderLoop = function() {
    // Clear stuff
    this.ctx.setTransform(1, 0, 0, 1, 0, 0);
    this.ctx.fillStyle = "black";
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    this.ctx.translate(
        Math.round(-state.player.position[0] * state.map.tw + this.canvas.width / 2),
        Math.round(-state.player.position[1] * state.map.tw + this.canvas.height / 2)
    );
    
    // Render all classes and instances
    /*
    for (var c of this.classes) {
        // Static update
        if (c.class.draw) {
            c.class.draw(this.ctx, this.currentTime);
        }
        // Instances
        if (c.instances.length > 0 && c.instances[0].draw) {
            for (var i of c.instances) {
                i.draw(this.ctx, this.currentTime);
            }
        }
    } */
    state.map.draw(this.ctx);
    state.corpses.forEach(c => c.draw(this.ctx));
    state.player.draw(this.ctx);

    requestAnimationFrame(this.renderLoop.bind(this));
};
