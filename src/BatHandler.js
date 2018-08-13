function BatHandler() {
    this.lastCheck = 0;
    this.minTimeBetweenSpawns = 0.08;
    this.spawnProbability = .5;
}

BatHandler.prototype.update = function(delta) {
    let playerPos = state.player.position;
    // console.log(playerPost);
    if (state.bat) {
        const timeSinceSpawning = state.dayTime - this.spawningTime;
        let animationProgress = timeSinceSpawning / this.animationDuration;
        animationProgress = animationProgress > 1 ? 1 : animationProgress;
        state.bat.position = [
            this.startPos[0] + (this.endPos[0] - this.startPos[0]) * animationProgress,
            this.startPos[1] + (this.endPos[1] - this.startPos[1]) * animationProgress,
        ];
        if (animationProgress === 1) {
            state.bat = null;
        }
    }
    if (state.dayTime % 1 <= 0.25 || state.dayTime % 1 >= 0.75 && !state.bat) {
        if (state.dayTime - this.lastCheck > this.minTimeBetweenSpawns) {
            if (Math.random() < this.spawnProbability) {
                this.startPos = [playerPos[0] - 8, Math.floor(playerPos[1] - 6 + Math.random() * 12)];
                this.endPos = [playerPos[0] + 12, Math.floor(playerPos[1] - 6 + Math.random() * 12)];
                this.animationDuration = 0.015 + Math.random() * 0.015;
                this.mirrored = true;
                // make bat fly in other direction
                if (Math.random() < .5) {
                    const swap = this.startPos;
                    this.startPos = this.endPos;
                    this.endPos = swap;
                    this.mirrored = false;
                }
                state.bat = new Bat([this.startPos[0], this.startPos[1]]);
                state.bat.mirrored = this.mirrored;
                this.spawningTime = state.dayTime;
                this.lastCheck = state.dayTime;
            }
        }
    }
}