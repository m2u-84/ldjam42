

const MUSIC_VOLUME = 0.1;

function MusicManager(audios) {
    this.playing = -1;
    this.audios = audios;
    setInterval(this.update.bind(this), 1000);
}

MusicManager.prototype.update = function() {
    if (this.playing < 0) {
        this.playRandom();
    } else {
        if (this.audios[this.playing].paused) {
            this.playRandom(this.playing);
        }
    }
};

MusicManager.prototype.playRandom = function(except) {
    if (this.audios.length == 1) {
        this.playing = 0;
        this.audios[0].play();
        this.audios[0].volume = MUSIC_VOLUME;
    } else if (this.audios.length > 1) {
        var id;
        while ((id = Math.floor(Math.random() * this.audios.length)) == except) {}
        this.playing = id;
        this.audios[id].play();
        this.audios[id].volume = MUSIC_VOLUME;
    }
};
