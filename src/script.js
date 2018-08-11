

window.onload = () => {
    var gameDiv = document.getElementById("game");
    gameHandler = new GameHandler(gameDiv);
};

var inherit = function (child, parent) {
    child.prototype = Object.create(parent.prototype);
};

function getRandom(array) {
    if (array.length < 1) { return null; }
    var index = Math.floor(Math.random() * array.length);
    return array[index];
};
