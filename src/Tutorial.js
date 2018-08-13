

function Tutorial() {
    var tx = 15, ty = 21;
    var tile = this.tile = [tx, ty];
    var torchTile = [tx + 1, ty];
    var nbtile = [tx, ty - 1];
    var treeTile = this.treeTile = [tx - 2, ty - 2];
    this.corpse = null;
    var corpseTile = [19, 15]; 
    this.shopTile = null;
    this.stages = [
        ["Welcome to Grave Heart!\n(press Space to continue)", null, " "],
        ["Note you can always skip this tutorial\nby pressing Enter on your keyboard\n(Space to proceed)", null, " "],
        ["You can Move using the arrow keys.\nGet to the spot highlighted by a blue square", tile, () => equalTile(state.player.tile, tile)],
        ["Note the green square beside you\nIt indicates which tile you can interact with\n(Space to proceed)", null, " "],
        ["Now go look at that tree very closely", treeTile, () => equalTile(state.player.targetTile, treeTile)],
        ["Hold E while targeting it to cut it down", treeTile, () => !isType(treeTile, TileTypes.TREE)],
        ["Very well. It's not that you need the wood.\nYou just despise trees I guess.\n(Space)", null, " "],
        ["Time for some terraforming.\nGo target the previous spot again", tile, () => equalTile(state.player.targetTile, tile)],
        ["Hold E to turn it into a path", tile, () => isType(tile, TileTypes.PATH)],
        ["Hold E once more, to dig a hole there", tile, () => isType(tile, TileTypes.HOLE) || isType(tile, TileTypes.GRAVE)],
        ["Dig a hole right next to it, to build a grave", nbtile, () => isType(tile, TileTypes.GRAVE), () => state.corpses.push(this.corpse = new Corpse(corpseTile))],
        ["Quite the grave digger.\nNow find a corpse. There surely\nis one lying around somewhere.", this.corpse, () => equalTile(state.player.targetTile, corpseTile, 2)],
        ["Press E while looking at it to drag it", this.corpse, () => state.player.pulling],
        ["Time to dispose it. Take it back to the grave.", this.tile, () => equalTile(state.player.targetTile, this.tile, 2)],
        ["Press E while pulling a corpse and looking\nat a grave to bury it", this.tile, () => state.corpses.length == 0],
        ["Press F to pay respect.", null, () => state.keyStates.f],
        ["Just kidding, there is no respect in this game.", null, 3000],
        ["Buried bodies usually decompose\nwithin three days (obviously). After that,\nthe grave may be repurposed.\n(Space)", null, " "],
        ["Sometimes however, the dead arise.\nBut don't be afraid.\n(Space)", null, " "],
        ["They're only a minor nuisance.\nThey don't hurt you, but they slow you down.\n(Space)", null, " ", makeTheZombie],
        ["You can fight by pressing F", this.zombie, "f"],
        ["Now get rid of the zombie.\nIt might take a few hits.", this.zombie, () => state.zombies.length < 1],
        ["Good work! We're almost done here.\n(Space)", null, " ", () => this.shopTile = [state.map.shopTile.x, state.map.shopTile.y]],
        ["Look out for the shop now,\nwe need to buy stuff", this.shopTile, () => equalTile(state.player.tile, state.map.shopTile, 1)],
        ["Open the shop and buy a torch", this.shopTile, () => state.player.torch],
        ["Go place it next to the grave", torchTile, () => isType(torchTile, TileTypes.TORCH)],
        ["Torches naturally accelerate\nthe decay of nearby graves. Which is good,\nbecause you need to deal with a lot of corpses.\n(Space)", null, " "],
        ["Last thing before the actual\ngame starts: The sassy zombie left\nits grave unusable.\n(Space)", null, " "],
        ["Hold E once more while looking\nat it to remove the grave\nso it doesn't waste any space.", null, () => isType(tile, TileTypes.PATH)],
        ["Well done.\nThe sun will rise soon.\nYou'll get your first\ntruckload of corpses.\nBetter prepare the graves!\n(Space)", null, " "],
        ["Just one last hint:\nYou can press P or Escape to pause the game\nand see the controls.\nHave a look!", null, () => state.pauseScreen],
        ["", null, () => !state.pauseScreen],
        ["Great, that's all.\nGet digging already.\nEnjoy!", null, 5000]
    ].map(stage => {
        // Make sure third element is always a callback
        var func = stage[2];
        if (typeof func == "number") {
            stage[2] = () => (+Date.now()) - this.lastStageChange >= func;
        } else if (typeof func == "string") {
            stage[2] = () => state.keyStates[func];
        }
        return stage;
    });
    this.currentStage = -1;
    this.lastStageChange = +Date.now();
    this.active = true;
    this.lines = [];
    this.nextStage();

    function equalTile(t1, t2, tolerance) {
        if (!tolerance) {
            return getX(t1) == getX(t2) && getY(t1) == getY(t2);
        } else {
            return Math.abs(getX(t1) - getX(t2)) <= tolerance && Math.abs(getY(t2) - getY(t1)) <= tolerance;
        }

        function getX(t) { return t.x != null ? t.x : t[0]; }
        function getY(t) { return t.y != null ? t.y : t[1]; }
    }
    function isType(tile, tp) {
        return state.map.getTile(tile[0], tile[1]).type == tp;
    }
    function makeTheZombie() {
        var graves = state.graves.filter(g => !g.empty);
        if (graves.length > 0) {
            var grave = graves[0];
            this.zombie = grave.spawnZombie();
        }
        if (!this.zombie) {
            this.zombie = new Zombie(this.tile.slice());
            state.zombies.push(zombie);
        }
    }
}

Tutorial.prototype.load = function() {
    state.map.set(this.treeTile[0], this.treeTile[1], TileTypes.TREE);
    state.map.set(this.tile[0], this.tile[1], TileTypes.GROUND);
    state.map.getTile(this.tile[0], this.tile[1]).decoImage = null;
};

Tutorial.prototype.update = function() {
    if (!this.active) { return; }
    // Current Stage done?
    var t = +Date.now();
    if (t > this.lastStageChange + 1000) {
        var stage = this.stages[this.currentStage];
        if (stage[2]()) {
            // Proceed to next stage
            this.nextStage();
        }
    }
    // Cancel tutorial?
    if (state.keyStates.Enter) {
        this.active = false;
    }
};

Tutorial.prototype.nextStage = function() {
    // Action of current stage
    if (this.currentStage >= 0) {
        var action = this.stages[this.currentStage][3];
        if (action) {
            action();
        }
    }
    // Proceed to next
    this.currentStage++;
    this.lastStageChange = +Date.now();
    if (this.currentStage >= this.stages.length) {
        this.active = false;
    } else {
        this.lines = this.stages[this.currentStage][0].split("\n");
    }
};

Tutorial.prototype.drawTile = function(ctx) {
    if (!this.active) { return; }
    var stage = this.stages[this.currentStage];
    var tile = stage[1];
    if (tile) {
        var pos = tile.position;
        if (!pos) { pos = [tile[0], tile[1]]; }
        var x = pos[0] * state.map.tw, y = pos[1] * state.map.th;
        ctx.strokeStyle = "rgba(120,180,255,0.75)";
        var off = (Math.floor(-Date.now() / 300) % 3) + 3;
        ctx.strokeRect(x - off, y - off, state.map.tw + 2 * off, state.map.th + 2 * off);
    }
};

Tutorial.prototype.drawHUD = function(ctx) {
    if (!this.active || state.pauseScreen ) { return; }
    var stage = this.stages[this.currentStage];
    // Text
    var text = this.lines;
    ctx.textAlign = "center";
    var x = ctx.canvas.width / 2;
    var y = 20, sy = 14;
    ctx.fillStyle = "rgba(255,255,255,1)";
    for (var i = 0; i < text.length; i++) {
        ctx.fillText(text[i], x, y + sy * i);
    }
};
