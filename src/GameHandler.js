
const movementSounds = [
    {
        src: "sounds/step_dirt.wav",
        playbackRate: 1,
        volume: .5
    },
    {
        src: "sounds/step_dirt2.wav",
        playbackRate: 1,
        volume: .5
    },
    {
        src: "sounds/step_dirt3.wav",
        playbackRate: 1,
        volume: .5
    },
    {
        src: "sounds/step_dirt4.wav",
        playbackRate: 1,
        volume: .5
    }
];

function GameHandler(parentElement) {
    this.parentElement = parentElement;

    loader = new Loader();
    keyHandler = new KeyHandler(window, ["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown", "e", "w", "a", "s", "d"]);
    renderSorter = new RenderSorter();
    
    this.classes = [
        // Player, Zombies, Corpses, Graves, ...
        Tile,
        Map,
        Entity,
        Character,
        Player,
        Corpse,
        Grave,
        LightSystem
    ].map(c => ({class: c, instances: []}));
    
    // Global game state which can be accessed by all game objects
    window.state = this.state = {
        map: new Map(32, 32, 24, 24),
        player: new Player([16.5,21.5], movementSounds),
        corpses: [],
        graves: [],
        keyStates: keyHandler.keyStates,
        cam: { x: 0, y: 0 }
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

    lightSystem = new LightSystem(320, 240);
    lightSystem.setAmbientColor("#404070");

    musicManager = new MusicManager([
        document.getElementById("music1"),
        document.getElementById("music2"),
        document.getElementById("music3"),
    ])
    

    // First load all the things, then start render and update loops
    this.load().then(() => {

        // Create some corpses
        for (var i = 0; i < 5; i++) {
            var corpse = new Corpse([Math.random() * 20, 19]);
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
    state.time = this.currentTime;
    state.dayTime = state.time / 60000;

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
    state.cam = {
        x: Math.round(-state.player.position[0] * state.map.tw + this.canvas.width / 2),
        y: Math.round(-state.player.position[1] * state.map.tw + this.canvas.height / 2)
    }
    this.ctx.translate(state.cam.x, state.cam.y);


    lightSystem.setAmbientColor(getAmbientColor(state.dayTime % 1));
    lightSystem.clear();
    renderSorter.clear();
    
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
    state.graves.forEach(g => g.draw(this.ctx));
    state.corpses.forEach(c => c.draw(this.ctx));
    state.player.draw(this.ctx);
    renderSorter.render();
    lightSystem.drawLight(null, 160, 120, 200, "#ffffff", 0.6);
    // lightSystem.drawLight(null, 160 + 160 * Math.sin(state.time * 0.001), 120 + 120 * Math.sin(state.time * 0.00132), 130, "#3030ff", 0.6);
    lightSystem.renderToContext(this.ctx);

    requestAnimationFrame(this.renderLoop.bind(this));
};

var ambientColors = [
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
    [0.1, 0.1, 0.5],
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