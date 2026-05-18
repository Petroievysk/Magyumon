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
}

// ============== NAVIGATION BUTTONS ==============
document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('btn-play').addEventListener('click', () => {
        showScreen('game');
        loadLevel(levels, 1);
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

    showScreen('splash');
    transitionFromSplash();
});

function transitionFromSplash() {
    setTimeout(() => {
        const splashScreen = screens.splash;
        splashScreen.classList.add('fade-out');
        
        setTimeout(() => {
            showScreen('menu');
            splashScreen.classList.remove('fade-out');
        }, 600);
    }, 2500);
}

const levels = {
    1: { 
        playerUnits: [
            { type: "fire", icon: "🔥"},
            { type: "water", icon: "💧"},
            { type: "wind", icon: "🌪️"}
        ],
        enemyTeam: [
            { type: "fire", icon: "🔥" },
            { type: "wind", icon: "🌪️" },
            { type: "rock", icon: "⛰️" }
        ],
    },
    2: { 
        playerUnits: [
            { type: "rock", icon: "⛰️" },
            { type: "wind", icon: "🌪️" },
            { type: "fire", icon: "🔥" },
            { type: "lightning", icon: "⚡️" }
        ],
        enemyTeam: [
            { type: "water", icon: "💧" },
            { type: "wind", icon: "🌪️" },
            { type: "lightning", icon: "⚡️" },
            { type: "rock", icon: "⛰️" }
        ],
    },
    3: { 
        playerUnits: [
            { type: "fire", icon: "🔥" },
            { type: "water", icon: "💧" },
            { type: "wind", icon: "🌪️" },
            { type: "lightning", icon: "⚡️" },
            { type: "rock", icon: "⛰️" }
        ],
        enemyTeam: [
            { type: "water", icon: "💧" },
            { type: "wind", icon: "🌪️" },
            { type: "lightning", icon: "⚡️" },
            { type: "rock", icon: "⛰️" },
            { type: "fire", icon: "🔥" }
        ],
    },
    4: {
        playerUnits: [
            { type: "fire", icon: "🔥" },
            { type: "water", icon: "💧" },
            { type: "wind", icon: "🌪️" },
            { type: "lightning", icon: "⚡️" },
            { type: "rock", icon: "⛰️" }
        ],
        enemyTeam: [
            { type: "fire", icon: "🔥" },
            { type: "rock", icon: "⛰️" },
            { type: "fire", icon: "🔥" },
            { type: "water", icon: "💧" },
            { type: "wind", icon: "🌪️" }
        ],
    },
    5: {
        playerUnits: [
            { type: "fire", icon: "🔥" },
            { type: "water", icon: "💧" },
            { type: "wind", icon: "🌪️" },
            { type: "lightning", icon: "⚡️" },
            { type: "rock", icon: "⛰️" }
        ],
        enemyTeam: [
            { type: "water", icon: "💧" },
            { type: "water", icon: "💧" },
            { type: "lightning", icon: "⚡️" },
            { type: "lightning", icon: "⚡️" },
            { type: "rock", icon: "⛰️" }
        ],
    }
};

let currentLevel = 1;

function loadLevel(levels, levelNumber) {
    const level = levels[levelNumber];
    createBattleArea(level);
    const levelNum = document.getElementById('level-number');
    levelNum.textContent = `Level ${levelNumber}`;
    renderEnemies(level);
    renderPlayerUnits(level);
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

function getResult(playerType, enemyType) {
    if (
        (playerType === 'water' && enemyType === 'fire') ||     // Water beats Fire
        (playerType === 'fire' && enemyType === 'wind') ||      // Fire beats Wind
        (playerType === 'wind' && enemyType === 'rock') ||      // Wind beats Rock
        (playerType === 'rock' && enemyType === 'lightning') || // Rock beats Lightning
        (playerType === 'lightning' && enemyType === 'water')   // Lightning beats Water
    ) {
        return 'win';
    } else if (
        (playerType === 'fire' && enemyType === 'water') ||
        (playerType === 'wind' && enemyType === 'fire') ||
        (playerType === 'rock' && enemyType === 'wind') ||
        (playerType === 'lightning' && enemyType === 'rock') ||
        (playerType === 'water' && enemyType === 'lightning')
    ) {
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

    const isVictory = wins > total / 2;
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
        
        document.getElementById('btn-next-level').style.display = 'block';
        document.getElementById('btn-try-again').style.display = 'none';
    } 
    else if (isTie) {
        iconEl.textContent = "🤝";
        titleEl.textContent = "EMPATE!";
        titleEl.style.color = "#eab308";
        subtitleEl.textContent = "Foi por pouco! Tente novamente.";
        
        document.getElementById('btn-next-level').style.display = 'none';
        document.getElementById('btn-try-again').style.display = 'block';
    } 
    else {
        iconEl.textContent = "💀";
        titleEl.textContent = "DERROTA";
        titleEl.style.color = "#ef4444";
        subtitleEl.textContent = "Tente uma formação diferente.";
        
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
    if (!levels[currentLevel]) {
        alert("🎉 Parabéns! Você completou todos os níveis!");
        showScreen('menu');
        return;
    }
    showScreen('game');
    loadLevel(levels, currentLevel);
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
