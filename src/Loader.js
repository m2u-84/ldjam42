


function Loader() {
    this.images = [];
    this.count = 0;
    this.loaded = 0;
    this.errors = 0;
    this.total = 0;
    this.allAdded = false;
    this.resolver = null;
}

Loader.prototype.loadAll = function() {
    var self = this;
    this.allAdded = true;
    if (this.total >= this.count) {
        return Promise.resolve();
    } else {
        return new Promise((resolve, reject) => {
            this.resolver = resolve;
        });
    }
};

Loader.prototype.loadImage = function(src, frameCount) {
    console.log(src);
    this.count++;
    var img = new Image();
    img.onload = () => {
        this.loaded++;
        this.total++;
        this.update();
    };
    img.onerror = () => {
        this.errors++;
        this.total++;
        this.update();
    };
    img.src = src;
    if (frameCount) {
        img.frameCount = frameCount;
    }
    return img;
};

Loader.prototype.loadAudio = function(soundData) {
    var sound = new Audio(soundData.src);
    for (let key in soundData) {
        if (key != "src") {
            sound[key] = soundData[key];
        }
    }
    sound.isPlaying = function() {
        return !!(this.currentTime > 0 && !this.paused && !this.ended && this.readyState > 2)
    }
    sound.stop = function() {
        this.pause();
        this.currentTime = 0;
    }
    sound.trigger = function () {
        if (!this.isPlaying()) {
            this.play();
        }
    }
    sound.setVolume = function(volume) {
        if (this.minVolume && volume < this.minVolume) {
            this.volume = this.minVolume;
        }else if (this.maxVolume && volume > this.maxVolume) {
            this.volume = this.maxVolume;
        } else if (volume < 0) {
            this.volume = 0;
        }
        else {
            this.volume = volume;
        }
    }
    return sound;
}

Loader.prototype.update = function() {
    if (this.allAdded) {
        if (this.total >= this.count) {
            this.resolver();
        }
    }
};
