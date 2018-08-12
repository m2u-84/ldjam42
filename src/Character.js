const movementSounds = [
    {
        src: "sounds/step_dirt.wav",
        playbackRate: 1,
        volume: .15,
        tileTypes: [TileTypes.GROUND, TileTypes.PATH]
    },
    {
        src: "sounds/step_dirt2.wav",
        playbackRate: 1,
        volume: .15,
        tileTypes: [TileTypes.GROUND, TileTypes.PATH]
    },
    {
        src: "sounds/step_dirt3.wav",
        playbackRate: 1,
        volume: .15,
        tileTypes: [TileTypes.GROUND, TileTypes.PATH]
    },
    {
        src: "sounds/step_dirt4.wav",
        playbackRate: 1,
        volume: .15,
        tileTypes: [TileTypes.GROUND, TileTypes.PATH]
    },
    {
        src: "sounds/step_stone.wav",
        playbackRate: .8,
        volume: .3,
        tileTypes: [TileTypes.STONE]
    },
    // {
    //     src: "sounds/step_stone2.wav",
    //     playbackRate: .8,
    //     volume: .6,
    //     tileTypes: [TileTypes.STONE]
    // },
    {
        src: "sounds/step_stone3.wav",
        playbackRate: .8,
        volume: .6,
        tileTypes: [TileTypes.STONE]
    }
];

function Character(position) {
    Entity.call(this, position);
    this.velocity = [0, 0];
    this.direction = 1;
    this.collided = false;
    this.stuck = false;

    this.width = 0.5;
    this.height = 0.3;

    if (movementSounds) {
       this.loadMovementSounds(movementSounds);
    }
}

inherit(Character, Entity);

Character.prototype.update = function (delta) {
    this.collided = false;
    this.stuck = false;
    // Compute new position based on delta and velocity
    var nx = this.position[0] + this.velocity[0] * delta;
    var ny = this.position[1] + this.velocity[1] * delta;
    this.setPosition(this.resolveCollision(nx, ny));

    // play movement sounds
    var keys = state.keyStates;
    if (keys.w || keys.a || keys.d || keys.s || keys.ArrowDown || keys.ArrowLeft || keys.ArrowRight || keys.ArrowUp) {
        this.movementSound.trigger();
    }

    // Update direction
    if (this.velocity[0] > 0) { this.direction = 1; }
    if (this.velocity[0] < 0) { this.direction = -1; }
};

Character.prototype.resolveCollision = function (x, y) {
    // Check x direction
    if (this.checkCollision(x, this.position[1])) {
        this.collided = true;
        x = this.position[0];
    }
    if (this.checkCollision(x, y)) {
        if (this.collided) { this.stuck = true; } else { this.collided = true; }
        y = this.position[1];
    }
    // Player stuck?
    if (this.checkCollision(x, y)) {
        return state.map.findClosestFreePosition(x, y, this.width, this.height);
    }
    return [x, y];
};

Character.prototype.checkCollision = function (x, y) {
    var x1 = x - this.width / 2;
    var y1 = y - this.height / 2;
    var x2 = x1 + this.width;
    var y2 = y1 + this.height;
    return state.map.getCollision(x1, y1) || state.map.getCollision(x2, y1) ||
        state.map.getCollision(x1, y2) || state.map.getCollision(x2, y2);
};

Character.prototype.loadMovementSounds = function (movementSounds) {
    this.movementAudioFiles = [];
    movementSounds.forEach(soundData => {
        this.movementAudioFiles.push(loader.loadAudio(soundData.src, soundData.playbackRate, soundData.volume, soundData.tileTypes));
    })
    for (const audio of this.movementAudioFiles) {
        audio.onended = () => {
            if (this.targetTile) {
                this.movementSound = getRandomSound(this.movementAudioFiles, this.targetTile.type);
            }
        }
    }
    this.movementSound = this.movementAudioFiles[0];
};
