function CorpseHandler() {
    this.lastDayTime = 0;
}
CorpseHandler.prototype.update = function(delta) {
    let relativeDayTime = state.dayTime - Math.floor(state.dayTime);
    // New Day
    if ((relativeDayTime - this.lastDayTime) < 0) {
    }

    if (this.lastDayTime <= 0.25 && relativeDayTime > 0.25) {
        console.log('New Corpses!');
        const spawningAmount = state.initialSpawnAmount * (1 + Math.floor(state.dayTime) * state.spawnIncreaseRate);
        console.log('spawningAmount: ' + spawningAmount);
        for (let i = 0; i < spawningAmount; i++) {
            const corpse = new Corpse([Math.random() * 20, 30]);
            state.corpses.push(corpse);
        }

    }

    if (this.lastDayTime <= 0.4 && relativeDayTime > 0.4) {
    }
    this.lastDayTime = relativeDayTime;
}