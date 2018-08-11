function KeyHandler(target) {
    this.attachTo(target);
    this.initListeners();
}

KeyHandler.prototype.keyStates = {
    right: false,
    left: false,
    up: false,
    down: false,
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
    switch (keyDownEvent.key) {
        case 'ArrowLeft':
            this.keyStates.left = true;
            break;
        case 'ArrowRight':
            this.keyStates.right = true;
            break;
        case 'ArrowUp':
            this.keyStates.up = true;
            break;
        case 'ArrowDown':
            this.keyStates.down = true;
            break;
        default:
            break;
    }
}

KeyHandler.prototype.onKeyUp = function (keyUpEvent) {
    switch (keyUpEvent.key) {
        case 'ArrowLeft':
            this.keyStates.left = false;
            break;
        case 'ArrowRight':
            this.keyStates.right = false;
            break;
        case 'ArrowUp':
            this.keyStates.up = false;
            break;
        case 'ArrowDown':
            this.keyStates.down = false;
            break;
        default:
            break;
    }
}