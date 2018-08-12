

function SoundManager() {

}


SoundManager.load = function() {
    SoundManager.sounds = {}
    SoundManager.loadSound("attack", 5);
    SoundManager.loadSound("burial", 5);
    SoundManager.loadSound("daybreak", 5);
    SoundManager.loadSound("digging", 5);
    SoundManager.loadSound("dragging", 5);
    SoundManager.loadSound("newbodies", 5);
    SoundManager.loadSound("nightbreak", 5);
    SoundManager.loadSound("obstacles", 5);
    SoundManager.loadSound("purchase", 5);
    SoundManager.loadSound("treefall", 5);
    SoundManager.loadSound("sighting", 5, "zombie");
    SoundManager.loadSound("zattack", 5, "zombie");
    SoundManager.loadSound("resurrection", 5, "zombie");
};

SoundManager.loadSound = function(name, count, directory) {
    var sounds = [];
    for (var i = 1; i <= count; i++) {
        var file = "voice/" + (directory || "gravedigger") + "/" + name + "/" + i + ".mp3";
        sounds[i - 1] = loader.loadAudio(file);
    }
    sounds.previous = null;
    SoundManager.sounds[name] = sounds;
};

SoundManager.loadSoundsWithNamedTrigger = function (sounds, triggerName) {
    if (Array.isArray(sounds)) {
        this[`${triggerName}Files`] = [];
        sounds.forEach(sound => {
            this[`${triggerName}Files`].push(loader.loadAudio(sound.src, sound.playbackRate, sound.volume, sound.tileTypes, sound.loop));
        });
        for (const audio of this[`${triggerName}Files`]) {
            audio.onended = () => {
                if (this.targetTile && audio.tileTypes != undefined) {
                    this[triggerName] = getRandomSoundByTileType(this[`${triggerName}Files`], this.targetTile.type);
                } else {
                    this[triggerName] = getRandom(this[`${triggerName}Files`]);
                }
            }
        }
        this[triggerName] = this[`${triggerName}Files`][0];
    } else {
        this[triggerName] = loader.loadAudio(sounds.src, sounds.playbackRate, sounds.volume, sounds.tileTypes, sounds.loop);
    }
}

SoundManager.play = function(name, probability) {
    if (Math.random() > probability) { return; }
    var sounds = SoundManager.sounds[name];
    var sound = getRandom(sounds);
    if (sounds.length > 1) {
        while (sound == sounds.previous) {
            sound = getRandom(sounds);
        }
        sounds.previous = sound;
    }
    if (sound) {
        sound.play();
    }
};
