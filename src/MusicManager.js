

const MUSIC_VOLUME = 0.2;
const AMBIENT_VOLUME = 0.4;

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

    var factor = 0.5 + 0.5 * Math.cos((state.dayTime || 0) * 2 * Math.PI);
    factor *= factor;
    // Cos interpolate for stronger cut
    for (var i = 0; i < 2; i++) { factor = 0.5 - 0.5 * Math.cos(Math.PI * factor); }
    // Apply factor to volumes
    var ambient = document.getElementById("nightmusic");
    ambient.volume = AMBIENT_VOLUME * factor;
    if (!ambient.playing) { ambient.play(); }
    this.audios[this.playing].volume = MUSIC_VOLUME * (1 - factor);
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
