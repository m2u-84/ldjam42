function CorpseHandler() {
    this.lastDayTime = 0;
    this.numCorpses = 10;
}
CorpseHandler.prototype.update = function(delta) {
    let relativeDayTime = state.dayTime - Math.floor(state.dayTime);
    if ((state.dayTime - this.lastDayTime) < 0) {
        console.log('Midnight');
    }

    if (this.lastDayTime <= 0.25 && state.dayTime > 0.25) {
        console.log('Sunrise');
        console.dir(state.map);
        for (let i = 0; i < this.numCorpses; i++) {
            const corpse = new Corpse([16,31]);//state.map.spawningZone);
            state.corpses.push(corpse);
        }

    }

    if (this.lastDayTime <= 0.4 && state.dayTime > 0.4) {
        console.log('Morning');
    }
    this.lastDayTime = state.dayTime;
}