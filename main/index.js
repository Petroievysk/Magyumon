const levelTest = {
    playerFighters: [
        { id: 1, type: "fire",  icon: "🔥", name: "Fire" },
        { id: 2, type: "water", icon: "💧", name: "Water" },
        { id: 3, type: "wind",  icon: "🌪️", name: "Wind" }
    ],
    
    enemyTeam: [
        { type: "fire",  icon: "🔥", name: "Fire" },
        { type: "water", icon: "💧", name: "Water" },
        { type: "wind",  icon: "🌪️", name: "Wind" }
    ]
};

function renderFighters(level) {
    const container = document.getElementById('available');
    container.innerHTML = '';

    level.playerFighters.forEach(fighter => {
        const unit = document.createElement('div');
        unit.className = `unit ${fighter.type}`;
        unit.draggable = true;
        unit.id = fighter.id;
        unit.innerHTML = `
            <div class="icon">${fighter.icon}</div>
            <div class="name">${fighter.name}</div>
        `;
        container.appendChild(unit);
    });
}

function renderEnemies(level) {
    const container = document.getElementById('enemy-team');
    container.innerHTML = '';

    level.enemyTeam.forEach(enemy => {
        const unit = document.createElement('div');
        unit.className = `enemy ${enemy.type}`;
        unit.innerHTML = `
            <div class="icon">${enemy.icon}</div>
            <div class="name">${enemy.name}</div>
        `;
        container.appendChild(unit);
    });
}

document.addEventListener('DOMContentLoaded', () => {
    renderFighters(levelTest);
    renderEnemies(levelTest);
});
