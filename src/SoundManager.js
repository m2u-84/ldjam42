

function SoundManager() {

}

SoundManager.previous = null;

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
        sounds[i - 1] = loader.loadAudio({src: file});
    }
    sounds.previous = null;
    sounds.player = (directory == null);
    SoundManager.sounds[name] = sounds;
};

SoundManager.loadSoundsWithNamedTrigger = function (soundOrSounds, triggerName) {
    if (Array.isArray(soundOrSounds)) {
        this[`${triggerName}Files`] = [];
        soundOrSounds.forEach(sound => {
            this[`${triggerName}Files`].push(loader.loadAudio(sound));
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
        this[triggerName] = loader.loadAudio(soundOrSounds);
    }
}

SoundManager.play = function(name, probability) {
    if (Math.random() > probability) { return; }
    var sounds = SoundManager.sounds[name];
    if (sounds.player) {
        if (SoundManager.previous != null) {
            if (!SoundManager.previous.paused) {
                // Skip when player's still talking
                return;
            }
        }
    }
    var sound = getRandom(sounds);
    if (sounds.length > 1) {
        while (sound == sounds.previous) {
            sound = getRandom(sounds);
        }
        sounds.previous = sound;
    }
    if (sound) {
        sound.play();
        if (sounds.player) {
            SoundManager.previous = sound;
        }
    }
};
