

function RenderSorter() {
    this.elements = [];
}

RenderSorter.prototype.clear = function() {
    this.elements = [];
};

RenderSorter.prototype.add = function(x, y, drawCallback) {
    this.elements.push({
        x,
        y,
        drawCallback
    });
};

RenderSorter.prototype.remove = function(e) {
    var i = this.elements.indexOf(e);
    if (i >= 0) {
        this.elements.splice(i, 1);
    }
};

RenderSorter.prototype.render = function(ctx, camera) {
    // Sort
    this.elements.sort((a,b) => a.y - b.y);

    // Remove duplicates
    /*
    for (var i = this.elements.length - 1; i >= 1; i--) {
        if (this.elements[i] == this.elements[i - 1]) {
            this.elements.splice(i);
        }
    }*/

    // Render
    for (i = 0; i < this.elements.length; i++) {
        this.elements[i].drawCallback();
    }
};
