
CorpseHandler.gameplayConstants = [
    {
        initialSpawnAmount: 4,
        spawnIncreaseRate: 0.3,
        maximumSpawningAmount: 20,
        spawnAnimationTime: 0.02,
        spawningGap: 0.002,
    },
    {
        initialSpawnAmount: 6,
        spawnIncreaseRate: 0.37,
        maximumSpawningAmount: 25,
        spawnAnimationTime: 0.02,
        spawningGap: 0.002,
    },
    {
        initialSpawnAmount: 7,
        spawnIncreaseRate: 0.39,
        maximumSpawningAmount: 38,
        spawnAnimationTime: 0.02,
        spawningGap: 0.005,
    }
];


function CorpseHandler() {
    this.lastDayTime = 0;

    const truck = {
        src: "sounds/truck.mp3",
        playbackRate: 1,
        volume: 0.2
    }
    this.thud2 = {
        src: "sounds/thud2.mp3",
        playbackRate: 1,
        volume: 1
    }
    this.truckSound = loader.loadAudio(truck);
}

CorpseHandler.load = function() {
    CorpseHandler.thud2 = loader.loadAudio({
        src: "sounds/thud2.mp3",
        playbackRate: 1,
        volume: 1
    });
};

CorpseHandler.prototype.update = function(delta) {

    var constants = this.gameplayConstants = CorpseHandler.gameplayConstants[state.difficulty || 0];

    let relativeDayTime = state.dayTime - Math.floor(state.dayTime);
    // Animate corpses that are being unloaded
    for (let i = 0; i < state.unloadingCorpses.length; i++) {
        const corpseToAnimate = state.unloadingCorpses[i];
        const timeSinceSpawning = state.dayTime - corpseToAnimate.spawningTime;
        let unloadingProgress = timeSinceSpawning / constants.spawnAnimationTime;
        unloadingProgress = unloadingProgress > 1 ? 1 : unloadingProgress;
        corpseToAnimate.setPosition([
            corpseToAnimate.spawningPosition[0] + (corpseToAnimate.finalDestination[0] - corpseToAnimate.spawningPosition[0]) * unloadingProgress,
            corpseToAnimate.spawningPosition[1] + (corpseToAnimate.finalDestination[1] - corpseToAnimate.spawningPosition[1]) * unloadingProgress
        ]);
        corpseToAnimate.angle = unloadingProgress * corpseToAnimate.rotationAmount;
        if (unloadingProgress === 1 ) {
            state.unloadingCorpses.splice(i, 1);
            CorpseHandler.thud2.volume = Math.random() * 0.8 + 0.2;
            CorpseHandler.thud2.play();
        }
    }

    // Spawning-Time  -  Add new corpses
    if (this.lastDayTime <= 0.25 && relativeDayTime > 0.25) {
        this.truckSound.trigger();
        let spawningAmount = Math.min(
            constants.initialSpawnAmount * (1 + Math.floor(state.dayTime) * constants.spawnIncreaseRate),
            constants.maximumSpawningAmount
        );
        if (state.unlocks.peace) { spawningAmount *= 0.7; }
        for (let i = 0; i < spawningAmount; i++) {
            const corpse = new Corpse([ 16, 45 ]);
            corpse.finalDestination = [10 + Math.random() * 12, 29 + Math.random() * 2];
            corpse.rotationAmount = Math.random() * 5 * Math.PI * 2; // Max 5 Rotationen
            corpse.spawningPosition = [ 16, 45 ];
            corpse.spawningTime = state.dayTime + i * 0.5 * (constants.spawningGap + constants.spawningGap * Math.random());
            state.unloadingCorpses.push(corpse);
            state.corpses.push(corpse);
        }
    }


    this.lastDayTime = relativeDayTime;
}
