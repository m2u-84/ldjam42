

function SoundManager() {

}


SoundManager.load = function() {
    SoundManager.sounds = {}
    SoundManager.loadSound("attack", 5);
    SoundManager.loadSound("burial", 5);
};

SoundManager.loadSound = function(name, count) {
    var sounds = [];
    for (var i = 1; i <= count; i++) {
        var file = "voice/gravedigger/" + name + "/" + i + ".mp3";
        sounds[i - 1] = loader.loadAudio(file);
    }
    sounds.previous = null;
    SoundManager.sounds[name] = sounds;
};

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
