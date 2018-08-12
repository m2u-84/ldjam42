


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

Loader.prototype.loadAudio = function(src, playbackRate, volume, tileTypes) {
    // this.count++;
    // try {
        // } catch (error) {
            //     this.errors++;
            //     this.total++;
            //     this.update();
            // }
            // this.loaded++;
            // this.total++;
            // this.update();
    var sound = new Audio(src);
    if (playbackRate != undefined) {
        sound.playbackRate = playbackRate;
    }
    if (volume != undefined) {
        sound.volume = volume;
    }
    if (tileTypes != undefined) {
        sound.tileTypes = tileTypes;
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
