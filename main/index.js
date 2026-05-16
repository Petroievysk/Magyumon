const levelTest = {
    playerUnits: [
        { type: "fire",  icon: "🔥", name: "Fire" },
        { type: "water", icon: "💧", name: "Water" },
        { type: "wind",  icon: "🌪️", name: "Wind" }
    ],
    enemyTeam: [
        { type: "fire",  icon: "🔥", name: "Fire" },
        { type: "water", icon: "💧", name: "Water" },
        { type: "wind",  icon: "🌪️", name: "Wind" }
    ]
};
function loadLevel(level){
    renderEnemies(level);
    renderUnits(level);
    setupSlots();
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

function renderEnemies(level) {
    const enemySlots = getSlots('.enemy-slot');

    level.enemyTeam.forEach((enemy, i) => {
        if (i >= enemySlots.length) return;
        const slot = enemySlots[i];
        slot.textContent = enemy.icon;
        slot.dataset.type = enemy.type;
        slot.dataset.name = enemy.name;

        slot.classList.add('enemy', enemy.type);
    });
}
function renderUnits(level) {
    const unitSlots = getSlots('.unit-slot');

    unitSlots.forEach(slot => {
        slot.innerHTML = '';
        slot.className = 'unit-slot';
    });

    level.playerUnits.forEach((unit, i) => {
        if (i >= unitSlots.length || i >= level.playerUnits.length) return;
        const slot = unitSlots[i];
        slot.textContent = unit.icon;
        slot.dataset.type = unit.type;
        slot.dataset.name = unit.name;
        slot.dataset.id = i;

        slot.classList.add('unit', unit.type);
    });
}

function setupSlots() {
    setupUnitSlots();
    setupPlayerSlots();
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

function normalizeIcon(icon) {
    if (!icon) return '';
    if (icon === '🌬️') return '🌪️';
    return icon;
}

function getResult(playerIcon, enemyIcon) {
    playerIcon = normalizeIcon(playerIcon);
    enemyIcon = normalizeIcon(enemyIcon);

    if (playerIcon === enemyIcon) return 'tie';

    if (
        (playerIcon === '💧' && enemyIcon === '🔥') ||  // Water beats Fire
        (playerIcon === '🔥' && enemyIcon === '🌪️') ||  // Fire beats Wind
        (playerIcon === '🌪️' && enemyIcon === '💧')     // Wind beats Water
    ) {
        return 'win';
    }

    return 'lose';
}

function createUnitSlotClickHandler() {
    return function handleUnitSlotClick() {
        const unitSlot = this;
        const icon = unitSlot.textContent.trim();
        if (!icon) return;

        // === DYNAMIC: Get ALL player slots (no hardcoding) ===
        const playerSlots = getSlots('.player-slot');
        
        // Find the first empty slot
        const emptySlot = playerSlots.find(slot => slot.textContent.trim() === '');

        if (!emptySlot) {
            alert("All player slots are full!");
            return;
        }

        // Place the unit
        emptySlot.textContent = icon;
        emptySlot.dataset.id = unitSlot.dataset.id;
        emptySlot.classList.add('player-unit');

        if (unitSlot.dataset.type) {
            emptySlot.classList.add(unitSlot.dataset.type);
        }

        // Remove from the unit list
        unitSlot.textContent = '';
        delete unitSlot.dataset.type;
    };
}
function createPlayerSlotClickHandler() {
    return function handlePlayerSlotClick() {
        const playerSlot = this;
        const id = playerSlot.dataset.id;
        const icon = playerSlot.textContent.trim();
        if (!icon) return;

        const unitSlot = getSlots('.unit-slot');

        // Place the unit
        unitSlot[id].textContent = playerSlot.textContent;
        unitSlot[id].dataset.type = playerSlot.dataset.type;

        // Remove from the player slot
        playerSlot.textContent = '';
        delete playerSlot.dataset.type;
        delete playerSlot.dataset.id;
    };
}

function fight() {
    const playerSlots = getSlots('.player-slot');
    const enemySlots = getSlots('.enemy-slot');

    let wins = 0, ties = 0, losses = 0;

    for (let i = 0; i < 3; i++) {
        const pIcon = playerSlots[i].textContent.trim();
        const eIcon = enemySlots[i].textContent.trim();

        if (!pIcon) {
            losses++;
            continue;
        }

        const result = getResult(pIcon, eIcon);

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

function setupFightButton() {
    const fightBtn = document.getElementById('fight-btn');
    fightBtn.addEventListener('click', fight);
}

document.addEventListener('DOMContentLoaded', () => {
    loadLevel(levelTest);
    setupFightButton();
});
