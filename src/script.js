

window.onload = () => {
    var gameDiv = document.getElementById("game");
    gameHandler = new GameHandler(gameDiv);
};

var inherit = function (child, parent) {
    child.prototype = Object.create(parent.prototype);
};