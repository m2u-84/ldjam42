function CorpseHandler() {
    this.lastDayTime = 0;
    this.unloadingCorpses = [];
}
CorpseHandler.prototype.update = function(delta) {
    let relativeDayTime = state.dayTime - Math.floor(state.dayTime);
    // Animate corpses that are being unloaded
    for (let i = 0; i < this.unloadingCorpses.length; i++) {
        const corpseToAnimate = this.unloadingCorpses[i];
        const timeSinceSpawning = state.dayTime - corpseToAnimate.spawningTime;
        let unloadingProgress = timeSinceSpawning / state.spawnAnimationTime;
        unloadingProgress = unloadingProgress > 1 ? 1 : unloadingProgress;
        corpseToAnimate.setPosition([
            corpseToAnimate.spawningPosition[0] + (corpseToAnimate.finalDestination[0] - corpseToAnimate.spawningPosition[0]) * unloadingProgress,
            corpseToAnimate.spawningPosition[1] + (corpseToAnimate.finalDestination[1] - corpseToAnimate.spawningPosition[1]) * unloadingProgress
        ]);
        corpseToAnimate.angle = unloadingProgress * corpseToAnimate.rotationAmount;
        if (unloadingProgress === 1 ) {
            this.unloadingCorpses.splice(i, 1);
        }
    }
    
    // Spawning-Time  -  Add new corpses
    if (this.lastDayTime <= 0.25 && relativeDayTime > 0.25) {
        const spawningAmount = state.initialSpawnAmount * (1 + Math.floor(state.dayTime) * state.spawnIncreaseRate);
        for (let i = 0; i < spawningAmount; i++) {
            const corpse = new Corpse([ 16, 45 ]);
            corpse.finalDestination = [10 + Math.random() * 12, 30];
            corpse.rotationAmount = Math.random() * 5 * Math.PI * 2; // Max 5 Rotationen
            corpse.spawningPosition = [ 16, 45 ];
            corpse.spawningTime = state.dayTime;
            this.unloadingCorpses.push(corpse);
            state.corpses.push(corpse);
        }
    }

    
    this.lastDayTime = relativeDayTime;
}