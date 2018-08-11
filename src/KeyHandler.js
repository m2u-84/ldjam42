function KeyHandler(target, watchers) {
    this.attachTo(target);
    this.initListeners();
    this.watchers = watchers;
    this.keyStates = {
    };
    watchers.forEach( key => this.keyStates[key] = false );
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
    if (this.keyStates[keyDownEvent.key] != null) {
        this.keyStates[keyDownEvent.key] = true;
    }
}

KeyHandler.prototype.onKeyUp = function (keyUpEvent) {
    if (this.keyStates[keyUpEvent.key] != null) {
        this.keyStates[keyUpEvent.key] = false;
    }
}
