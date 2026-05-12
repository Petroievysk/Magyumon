const levelTest = {
    enemyTeam: [
        { type: "fire",  icon: "🔥", name: "Fire" },
        { type: "water", icon: "💧", name: "Water" },
        { type: "wind",  icon: "🌪️", name: "Wind" }
    ]
};

function renderEnemies(level) {
    const enemySlots = [
        document.getElementById('enemy-slot1'),
        document.getElementById('enemy-slot2'),
        document.getElementById('enemy-slot3')
    ];

    level.enemyTeam.forEach((enemy, i) => {
        if (i >= enemySlots.length) return;
        const slot = enemySlots[i];
        slot.textContent = enemy.icon;
        slot.classList.add('enemy', enemy.type);
    });
}

function setupUnitSlots() {
    const unitSlots = document.querySelectorAll('.unit-slot');

    unitSlots.forEach(slot => {
        slot.addEventListener('click', () => {
            const icon = slot.dataset.icon || slot.textContent.trim();
            if (!icon) return;

            const playerSlots = [
                document.getElementById('player-slot1'),
                document.getElementById('player-slot2'),
                document.getElementById('player-slot3')
            ];

            const emptySlot = playerSlots.find(s => s.textContent.trim() === '');

            if (!emptySlot) {
                alert("All player slots are full!");
                return;
            }

            emptySlot.textContent = icon;
            emptySlot.classList.add('player-unit');

            slot.textContent = '';
            delete slot.dataset.icon;
        });
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

function fight() {
    const playerSlots = [
        document.getElementById('player-slot1'),
        document.getElementById('player-slot2'),
        document.getElementById('player-slot3')
    ];

    const enemySlots = [
        document.getElementById('enemy-slot1'),
        document.getElementById('enemy-slot2'),
        document.getElementById('enemy-slot3')
    ];

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
    renderEnemies(levelTest);
    setupUnitSlots();
    setupFightButton();
});
