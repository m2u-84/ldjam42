


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

Loader.prototype.loadImage = function(src) {
    this.count++;
    var img = new Image();
    img.onload = () => {
        this.loaded++;
        this.total++;
    };
    img.onerror = () => {
        this.errors++;
        this.total++;
    };
    img.src = src;
    return img;
};

Loader.prototype.update = function() {
    if (this.allAdded) {
        if (this.total >= this.count) {
            this.resolver();
        }
    }
};