function KeyHandler(target, watchers) {
    this.attachTo(target);
    this.initListeners();
    this.watchers = watchers;
    this.keyStates = {
    };
    watchers.forEach( key => this.keyStates[key.toLowerCase()] = false );
}

KeyHandler.prototype.eventTarget = null;

KeyHandler.prototype.initListeners = function () {
    this.eventTarget.addEventListener('keydown', this.onKeyDown.bind(this));
    this.eventTarget.addEventListener('keyup', this.onKeyUp.bind(this));
}

KeyHandler.prototype.attachTo = function(target) {
    this.eventTarget = target;
}

KeyHandler.prototype.detach = function() {
    this.eventTarget.removeEventListener('keydown', this.onKeyDown.bind(this));
    this.eventTarget.removeEventListener('keyup', this.onKeyUp.bind(this));
}

KeyHandler.prototype.onKeyDown = function (keyDownEvent) {
    var key = keyDownEvent.key.toLowerCase();
    if (this.keyStates[key] != null) {
        this.keyStates[key] = true;
    }
}

KeyHandler.prototype.onKeyUp = function (keyUpEvent) {
    var key = keyUpEvent.key.toLowerCase();
    if (this.keyStates[key] != null) {
        this.keyStates[key] = false;
    }
}
