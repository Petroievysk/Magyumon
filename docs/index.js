// ============== SCREEN MANAGEMENT ==============
const screens = {
    menu: document.getElementById('screen-menu'),
    tutorial: document.getElementById('screen-tutorial'),
    game: document.getElementById('screen-game'),
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
    // Button listeners
    document.getElementById('btn-play').addEventListener('click', () => {
        showScreen('game');
        loadLevel(levelTest);
    });

    document.getElementById('btn-tutorial').addEventListener('click', () => {
        showScreen('tutorial');
    });

    document.getElementById('btn-back').addEventListener('click', () => {
        showScreen('menu');
    });

    // Start on main menu
    showScreen('menu');
});

const levelTest = {
    playerUnits: [
        { type: "fire",  icon: "🔥", name: "Fire" },
        { type: "water", icon: "💧", name: "Water" },
        { type: "wind",  icon: "🌪️", name: "Wind" },
        { type: "lightning",  icon: "⚡️", name: "Lightning" },
        { type: "rock",  icon: "⛰️️", name: "Rock" },
    ],
    enemyTeam: [
        { type: "fire",  icon: "🔥", name: "Fire" },
        { type: "water", icon: "💧", name: "Water" },
        { type: "wind",  icon: "🌪️", name: "Wind" },
        { type: "lightning",  icon: "⚡️", name: "Lightning" },
        { type: "rock",  icon: "⛰️️", name: "Rock" },
    ]
};

function loadLevel(level) {
    createBattleArea(level);
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
    let numSlots = level.enemyTeam.length;
    const container = document.getElementById('battle-container');
    container.innerHTML = ''; 

    for (let i = 1; i <= numSlots; i++) {
        const lane = document.createElement('div');
        lane.className = 'battle-lane';
        
        // VS button roughly in the middle
        const isMiddle = (i === Math.ceil(numSlots / 2));
        
        lane.innerHTML = `
            <button class="panel player-slot" id="player-slot${i}"></button>
            
            ${isMiddle ? `
                <div class="fight-wrapper">
                    <button id="fight-btn">VS</button>
                </div>
            ` : `<div class="spacer"></div>`}
            
            <button class="panel enemy-slot" id="enemy-slot${i}"></button>
        `;
        
        container.appendChild(lane);
    }
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
        // remove any old data
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
        // Remove old listener if exists
        if (slot._unitClickHandler) {
            slot.removeEventListener('click', slot._unitClickHandler);
        }
        
        // Create and attach new handler
        slot._unitClickHandler = createUnitSlotClickHandler();
        slot.addEventListener('click', slot._unitClickHandler);
    });
}
function setupPlayerSlots() {
    const playerSlots = getSlots('.player-slot');
    
    playerSlots.forEach(slot => {
        // Remove old listener if exists
        if (slot._playerClickHandler) {
            slot.removeEventListener('click', slot._playerClickHandler);
        }
        
        // Create and attach new handler
        slot._playerClickHandler = createPlayerSlotClickHandler();
        slot.addEventListener('click', slot._playerClickHandler);
    });
}
function setupFightButton() {
    // The button is created dynamically
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

function fight() {
    const playerSlots = getSlots('.player-slot');
    const enemySlots = getSlots('.enemy-slot');

    let wins = 0, ties = 0, losses = 0;

    for (let i = 0; i < playerSlots.length; i++) {
        const pSlot = playerSlots[i];
        const eSlot = enemySlots[i];
        
        // Get type from dataset (this is what you asked for)
        const pType = pSlot.dataset.type || '';
        const eType = eSlot.dataset.type || '';
        
        if (!pType) {
            losses++;
            continue;
        }

        const result = getResult(pType, eType);

        if (result === 'win') wins++;
        else if (result === 'tie') ties++;
        else losses++;
    }

    const resultArea = document.getElementById('result-area');
    resultArea.innerHTML = `
        <strong>Battle Result</strong><br>
        ✅ Wins: ${wins} &nbsp;&nbsp;
        🤝 Ties: ${ties} &nbsp;&nbsp;
        ❌ Losses: ${losses}
    `;
}
function getResult(playerType, enemyType) {
    if (playerType === enemyType) return 'tie';

    if (
        (playerType === 'water' && enemyType === 'fire') ||     // Water beats Fire
        (playerType === 'fire' && enemyType === 'wind') ||      // Fire beats Wind
        (playerType === 'wind' && enemyType === 'rock') ||      // Wind beats Rock
        (playerType === 'rock' && enemyType === 'lightning') || // Rock beats Lightning
        (playerType === 'lightning' && enemyType === 'water')   // Lightning beats Water
    ) {
        return 'win';
    }

    return 'lose';
}

document.addEventListener('DOMContentLoaded', () => {
    loadLevel(levelTest);
});
