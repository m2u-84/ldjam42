function BatHandler() {
    this.lastCheck = 0;
}

BatHandler.prototype.update = function(delta) {
    let playerPos = state.player.position;
    // console.log(playerPost);
    if (state.dayTime % 1 <= 0.25 || state.dayTime % 1 >= 0.75) {
        if (state.dayTime - this.lastCheck > 0.024) {
            // if (!state.bat) {
                this.startPos = [playerPos[0] - 8, Math.floor(playerPos[1] - 6 + Math.random() * 12)];
                this.endPos = [playerPos[0] + 8, Math.floor(playerPos[1] - 6 + Math.random() * 12)];
                state.bat = new Bat([this.startPos[0],this.startPos[1]]);
            // }
            this.lastCheck = state.dayTime;
        }
    }
}