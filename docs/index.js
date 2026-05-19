// ============== AUDIO STUFF ==============
let currentAudio = null;
let muted = false;

const audio = {
    menu: new Audio('audio/menu.mp3'),
    victory: new Audio('audio/victory.mp3'),
    defeat: new Audio('audio/defeat.mp3'),
    tie: new Audio('audio/tie.mp3')
};

audio.menu.loop = true;

audio.victory.loop = false;
audio.defeat.loop = false;
audio.tie.loop = false;

function playAudio(type) {
    if (currentAudio) {
        currentAudio.pause();
        currentAudio.currentTime = 0;
    }

    currentAudio = audio[type];
    
    if (currentAudio) {
        currentAudio.volume = muted ? 0 : 0.7;
        currentAudio.play().catch(e => {
            console.log("Audio play prevented (user interaction needed)");
        });
    }
}
function toggleMute() {
    muted = !muted;
    
    document.querySelectorAll('.mute-btn').forEach(btn => {
            btn.textContent = muted ? '🔊' : '🔇';
    });

    if (currentAudio) {
        currentAudio.volume = muted ? 0 : 0.7;
    }
}
function stopAllAudio() {
    Object.values(audio).forEach(a => {
        a.pause();
        a.currentTime = 0;
    });
    currentAudio = null;
}

// ============== SCREEN MANAGEMENT ==============
const screens = {
    splash: document.getElementById('screen-splash'),
    menu: document.getElementById('screen-menu'),
    tutorial: document.getElementById('screen-tutorial'),
    game: document.getElementById('screen-game'),
    results: document.getElementById('screen-results'),
    test: document.getElementById('test-screen'),
};

function showScreen(screenName) {
    Object.values(screens).forEach(screen => {
        screen.classList.remove('active');
    });
    screens[screenName].classList.add('active');

    if (screenName === 'menu' || screenName === 'tutorial') {
        if (!currentAudio || currentAudio !== audio.menu) {
            playAudio('menu');
        }
    } 
    else if (screenName === 'results') {
    } 
    else {
        if (currentAudio) {
            currentAudio.pause();
        }
    }

    if (screenName === 'game') stopAllAudio();
}
function transitionFromSplash() {
    setTimeout(() => {
        const splashScreen = screens.splash;
        splashScreen.classList.add('fade-out');
        
        setTimeout(() => {
            showScreen('menu');
            // splashScreen.classList.remove('fade-out');
        }, 600);
    }, 2500);
}

// ================= RENDERING ====================
function createBattleArea(level) {
    const numSlots = level.enemyTeam.length;
    const container = document.getElementById('battle-container');
    container.innerHTML = ''; 

    const enemyRow = document.createElement('div');
    enemyRow.className = 'battle-row enemy-row';

    const vsRow = document.createElement('div');
    vsRow.className = 'battle-row vs-row';

    const playerRow = document.createElement('div');
    playerRow.className = 'battle-row player-row';

    for (let i = 1; i <= numSlots; i++) {
        const enemySlot = document.createElement('button');
        enemySlot.className = 'panel enemy-slot';
        enemySlot.id = `enemy-slot${i}`;
        enemyRow.appendChild(enemySlot);

        if (i === Math.ceil(numSlots / 2)) {
            const fightBtn = document.createElement('button');
            fightBtn.id = 'fight-btn';
            fightBtn.textContent = 'VS';
            vsRow.appendChild(fightBtn);
        }

        const playerSlot = document.createElement('button');
        playerSlot.className = 'panel player-slot';
        playerSlot.id = `player-slot${i}`;
        playerRow.appendChild(playerSlot);
    }

    container.appendChild(enemyRow);
    container.appendChild(vsRow);
    container.appendChild(playerRow);
}
function renderEnemies(level) {
    const enemySlots = getSlots('.enemy-slot');

    enemySlots.forEach((slot, i) => {
        const enemy = level.enemyTeam[i];
        if (!enemy) return;
        
        slot.innerHTML = `<img src="./images/${enemy.type}.png" alt="${enemy.icon}" class="unit-img">`;
        slot.dataset.type = enemy.type;
        slot.dataset.name = enemy.name;
        slot.classList.add('enemy', enemy.type);
    });
}
function renderPlayerUnits(level) {
    const unitSlots = getSlots('.unit-slot');

    unitSlots.forEach(slot => {
        slot.innerHTML = '';
        slot.className = 'unit-slot';
        delete slot.dataset.type;
        delete slot.dataset.id;
    });

    level.playerUnits.forEach((unit, i) => {
        if (i >= unitSlots.length) return;
        const slot = unitSlots[i];
        
        slot.innerHTML = `<img src="./images/${unit.type}.png" alt="${unit.icon}" class="unit-img">`;
        slot.dataset.type = unit.type;
        slot.dataset.name = unit.name;
        slot.dataset.id = i;
        slot.classList.add('unit', unit.type);
    });
}

function setupEventListeners() {
    setupUnitSlots();
    setupPlayerSlots();
    setupFightButton();
}
function setupUnitSlots() {
    const unitSlots = getSlots('.unit-slot');
    
    unitSlots.forEach(slot => {
        if (slot._unitClickHandler) {
            slot.removeEventListener('click', slot._unitClickHandler);
        }
        
        slot._unitClickHandler = createUnitSlotClickHandler();
        slot.addEventListener('click', slot._unitClickHandler);
    });
}
function setupPlayerSlots() {
    const playerSlots = getSlots('.player-slot');
    
    playerSlots.forEach(slot => {
        if (slot._playerClickHandler) {
            slot.removeEventListener('click', slot._playerClickHandler);
        }
        
        slot._playerClickHandler = createPlayerSlotClickHandler();
        slot.addEventListener('click', slot._playerClickHandler);
    });
}
function setupFightButton() {
    document.getElementById('battle-container').addEventListener('click', (e) => {
        if (e.target.id === 'fight-btn') {
            fight();
        }
    });
}

function createUnitSlotClickHandler() {
    return function handleUnitSlotClick() {
        const unitSlot = this;
        const img = unitSlot.querySelector('img');
        if (!img) return;

        const playerSlots = getSlots('.player-slot');
        const emptySlot = playerSlots.find(slot => !slot.querySelector('img'));

        if (!emptySlot) {
            alert("All player slots are full!");
            return;
        }

        // Move image
        emptySlot.innerHTML = img.outerHTML;
        emptySlot.dataset.id = unitSlot.dataset.id;
        emptySlot.dataset.type = unitSlot.dataset.type;
        emptySlot.classList.add('player-unit', unitSlot.dataset.type);

        // Clear source slot
        unitSlot.innerHTML = '';
        delete unitSlot.dataset.type;
    };
}
function createPlayerSlotClickHandler() {
    return function handlePlayerSlotClick() {
        const playerSlot = this;
        const img = playerSlot.querySelector('img');
        if (!img) return;

        const unitSlots = getSlots('.unit-slot');
        const id = parseInt(playerSlot.dataset.id);

        if (unitSlots[id]) {
            unitSlots[id].innerHTML = img.outerHTML;
            unitSlots[id].dataset.type = playerSlot.dataset.type;
        }

        // Clear player slot
        playerSlot.innerHTML = '';
        delete playerSlot.dataset.type;
        delete playerSlot.dataset.id;
    };
}

// ============== NAVIGATION BUTTONS ==============
document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('btn-play').addEventListener('click', () => {
        showScreen('game');
        loadLevel(1);
    });

    document.getElementById('btn-tutorial').addEventListener('click', () => {
        showScreen('tutorial');
    });

    document.querySelectorAll('.back-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            showScreen('menu');
            resetBattleArea();
        });
    });

    document.getElementById('btn-next-level').addEventListener('click', nextLevel);
    document.getElementById('btn-try-again').addEventListener('click', tryAgain);

    document.querySelectorAll('.mute-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            toggleMute();
        });
    });

    showScreen('splash');
    transitionFromSplash();
});

// ================= GAME LOGIC =================
const units = {
    Fire: { type: "fire", icon: "🔥"},
    Water: { type: "water", icon: "💧"},
    Wind: { type: "wind", icon: "🌪️" },
    Lightning: { type: "lightning", icon: "⚡️" },
    Rock: { type: "rock", icon: "⛰️" },
};
const counters = {
    fire: "water",      // water beats fire
    water: "lightning", // lightning beats water
    lightning: "rock",  // rock beats lightning
    rock: "wind",       // wind beats rock
    wind: "fire"        // fire beats wind
};
const allUnitTypes = ["fire", "water", "wind", "lightning", "rock"];

function getRandomUnit() {
    const type = allUnitTypes[Math.floor(Math.random() * allUnitTypes.length)];
    return { type: type, icon: units[Object.keys(units).find(k => units[k].type === type)].icon };
}
function shuffle(array) {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
}

function generateLevel(levelNumber) {
    let numSlots;
    let enemyDuplicates = 0;
    let maxPlayerWins = Infinity;

    if (levelNumber === 1) numSlots = 3;
    else if (levelNumber === 2) numSlots = 4;
    else numSlots = 5;

    if (levelNumber === 4) {
        enemyDuplicates = 1;
        maxPlayerWins = 4;
    } else if (levelNumber === 5) {
        enemyDuplicates = 2;
        maxPlayerWins = 3;
    }

    let enemyTeam = [];

    const uniqueCount = numSlots - enemyDuplicates;
    const uniqueEnemies = shuffle(allUnitTypes).slice(0, uniqueCount)
        .map(type => ({
            type: type,
            icon: units[Object.keys(units).find(k => units[k].type === type)].icon
        }));

    enemyTeam = [...uniqueEnemies];

    for (let i = 0; i < enemyDuplicates; i++) {
        const randomEnemy = uniqueEnemies[Math.floor(Math.random() * uniqueEnemies.length)];
        enemyTeam.push({...randomEnemy});
    }

    enemyTeam = shuffle(enemyTeam);

    let playerUnits = enemyTeam.map(enemy => {
        const counterType = counters[enemy.type];
        return {
            type: counterType,
            icon: units[Object.keys(units).find(k => units[k].type === counterType)].icon
        };
    });

    if (maxPlayerWins < Infinity) {
        const numToReplace = playerUnits.length - maxPlayerWins;
        const indicesToReplace = shuffle([...Array(playerUnits.length).keys()]).slice(0, numToReplace);
        
        indicesToReplace.forEach(idx => {
            playerUnits[idx] = getRandomUnit();
        });
    }

    playerUnits = shuffle(playerUnits);

    return { playerUnits, enemyTeam };
}

let currentLevel = 1;

function loadLevel(levelNumber) {
    const levelData = generateLevel(levelNumber);
    
    createBattleArea(levelData);
    document.getElementById('level-number').textContent = `Level ${levelNumber}`;
    
    renderEnemies(levelData);
    renderPlayerUnits(levelData);
    setupEventListeners();
}

function getSlots(slotClass) {
    const slots = Array.from(document.querySelectorAll(slotClass));
    slots.sort((a, b) => {
        const idA = parseInt(a.id.replace(/\D/g, '')) || 0;
        const idB = parseInt(b.id.replace(/\D/g, '')) || 0;
        return idA - idB;
    });
    return slots;
}

function getResult(playerType, enemyType) {
    if (counters[enemyType] === playerType) {
        return 'win';
    }
    if (counters[playerType] === enemyType) {
        return 'lose';
    }

    return 'tie';
}

function fight() {
    const playerSlots = getSlots('.player-slot');
    const enemySlots = getSlots('.enemy-slot');

    let wins = 0, ties = 0, losses = 0;
    const total = enemySlots.length;

    for (let i = 0; i < total; i++) {
        const pType = playerSlots[i].dataset.type || '';
        const eType = enemySlots[i].dataset.type || '';
        
        if (!pType) {
            losses++;
            continue;
        }

        const result = getResult(pType, eType);
        if (result === 'win') wins++;
        else if (result === 'lose') losses++;
        else ties++;
    }

    const isVictory = wins > losses;
    const isTie = wins === losses;

    showResultsScreen(wins, ties, losses, isVictory, isTie );
}

function showResultsScreen(wins, ties, losses, isVictory, isTie) {
    const iconEl = document.getElementById('result-icon');
    const titleEl = document.getElementById('result-title');
    const subtitleEl = document.getElementById('result-subtitle');

    if (isVictory) {
        iconEl.textContent = "🏆";
        titleEl.textContent = "VITÓRIA!";
        titleEl.style.color = "#22c55e";
        subtitleEl.textContent = "Excelente estratégia!";
        playAudio('victory');
        
        document.getElementById('btn-next-level').style.display = 'block';
        document.getElementById('btn-try-again').style.display = 'none';
    } 
    else if (isTie) {
        iconEl.textContent = "🤝";
        titleEl.textContent = "EMPATE!";
        titleEl.style.color = "#eab308";
        subtitleEl.textContent = "Foi por pouco! Tente novamente.";
        playAudio('tie');
        
        document.getElementById('btn-next-level').style.display = 'none';
        document.getElementById('btn-try-again').style.display = 'block';
    } 
    else {
        iconEl.textContent = "💀";
        titleEl.textContent = "DERROTA";
        titleEl.style.color = "#ef4444";
        subtitleEl.textContent = "Tente uma formação diferente.";
        playAudio('defeat');
        
        document.getElementById('btn-next-level').style.display = 'none';
        document.getElementById('btn-try-again').style.display = 'block';
    }

    document.getElementById('battle-stats').innerHTML = `
        ✅ Vitórias: <strong>${wins}</strong><br>
        🤝 Empates: <strong>${ties}</strong><br>
        ❌ Derrotas: <strong>${losses}</strong><br>
    `;

    document.getElementById('btn-next-level').style.display = isVictory ? 'block' : 'none';
    document.getElementById('btn-try-again').style.display = isVictory ? 'none' : 'block';

    showScreen('results');
}

function nextLevel() {
    currentLevel++;
    if (currentLevel > 5) {
        alert("🎉 Parabéns! Você completou todos os níveis!");
        showScreen('menu');
        return;
    }
    showScreen('game');
    loadLevel(currentLevel);
}

function tryAgain() {
    showScreen('game');
    loadLevel(levels, currentLevel);
}

function resetBattleArea() {
    const battleContainer = document.getElementById('battle-container');
    if (battleContainer) battleContainer.innerHTML = '';
    document.getElementById('result-area').innerHTML = '';
}
