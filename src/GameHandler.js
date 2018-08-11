

function GameHandler(parentElement) {
    this.parentElement = parentElement;

    this.classes = [
        // Player, Zombies, Corpses, Graves, ...
    ].map(c => ({class: c, instances: []}));

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
        this.gameLoop();
        this.renderLoop();
    });
}

GameHandler.prototype.load = function() {
    // Call static load methods of all known classes
    return Promise.resolve();
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

    requestAnimationFrame(this.gameLoop.bind(this));
};

GameHandler.prototype.renderLoop = function() {
    // Clear stuff
    this.ctx.fillStyle = "black";
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    // Render all classes and instances
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
    }

    requestAnimationFrame(this.renderLoop.bind(this));
};
