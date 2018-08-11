function Character(position, movementSoundsData) {
    Entity.call(this, position);
    this.velocity = [0, 0];
    this.direction = 1;

    this.width = 0.5;
    this.height = 0.3;

    if (movementSoundsData) {
       this.loadMovementSounds(movementSoundsData);
    }
}

inherit(Character, Entity);

Character.prototype.update = function (delta) {
    // Compute new position based on delta and velocity
    var nx = this.position[0] + this.velocity[0] * delta;
    var ny = this.position[1] + this.velocity[1] * delta;
    this.position = this.resolveCollision(nx, ny);

    // play movement sounds
    var keys = state.keyStates;
    if (keys.w || keys.a || keys.d || keys.s || keys.ArrowDown || keys.ArrowLeft || keys.ArrowRight || keys.ArrowUp) {
        this.movementSound.play();
    }

    // Update direction
    if (this.velocity[0] > 0) { this.direction = 1; }
    if (this.velocity[0] < 0) { this.direction = -1; }
};

Character.prototype.resolveCollision = function (x, y) {
    // Check x direction
    if (this.checkCollision(x, this.position[1])) {
        x = this.position[0];
    }
    if (this.checkCollision(x, y)) {
        y = this.position[1];
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
        this.movementAudioFiles.push(loader.loadAudio(soundData.src, soundData.playbackRate, soundData.volume));
    })
    for (const audio of this.movementAudioFiles) {
        audio.onended = () => {
            const newSound = getRandom(this.movementAudioFiles);
            this.movementSound = getRandom(this.movementAudioFiles);
        }

    }
    this.movementSound = this.movementAudioFiles[0];
}