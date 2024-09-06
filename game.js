// 游戏状态
let gameState = {
    selectedUltraman: null,
    selectedMonster: null,
    ultramanHealth: 100,
    monsterHealth: 100,
    turn: 'player'
};

// 角色数据
const characters = {
    ultramen: [
        { id: 'u1', name: '迪迦', attack: 80, defense: 70, speed: 60, skill: '光线射击', image: 'tiga.jpg' },
        { id: 'u2', name: '赛文', attack: 75, defense: 65, speed: 80, skill: '眼镜光线', image: 'seven.jpg' },
        { id: 'u3', name: '雷欧', attack: 85, defense: 60, speed: 75, skill: '雷欧飞踢', image: 'leo.jpg' },
        { id: 'u4', name: '艾斯', attack: 70, defense: 75, speed: 70, skill: '等离子火花', image: 'ace.jpg' },
    ],
    monsters: [
        { id: 'm1', name: '哥尔赞', attack: 70, defense: 80, speed: 50, skill: '火球', image: 'golza.jpg' },
        { id: 'm2', name: '美尔巴', attack: 65, defense: 60, speed: 90, skill: '音波攻击', image: 'melba.jpg' },
        { id: 'm3', name: '杰顿', attack: 85, defense: 75, speed: 60, skill: '火球连射', image: 'zetton.jpg' },
        { id: 'm4', name: '贝蒙斯坦', attack: 75, defense: 85, speed: 40, skill: '电击', image: 'bemstar.jpg' },
    ]
};

// DOM元素
const startScreen = document.getElementById('start-screen');
const characterSelectScreen = document.getElementById('character-select-screen');
const battleScreen = document.getElementById('battle-screen');
const endScreen = document.getElementById('end-screen');
const startButton = document.getElementById('start-button');
const battleButton = document.getElementById('battle-button');
const replayButton = document.getElementById('replay-button');
const ultramanList = document.getElementById('ultraman-list');
const monsterList = document.getElementById('monster-list');
const battleArea = document.getElementById('battle-area');
const actionButtons = document.getElementById('action-buttons');
const ultramanStats = document.getElementById('ultraman-stats');
const monsterStats = document.getElementById('monster-stats');

// 事件监听器
startButton.addEventListener('click', showCharacterSelect);
battleButton.addEventListener('click', startBattle);
replayButton.addEventListener('click', resetGame);

// 初始化游戏
function initGame() {
    populateCharacterList(ultramanList, characters.ultramen, 'ultraman');
    populateCharacterList(monsterList, characters.monsters, 'monster');
}

// 填充角色列表
function populateCharacterList(listElement, characters, type) {
    characters.forEach(character => {
        const card = document.createElement('div');
        card.className = 'character-card';
        card.innerHTML = `
            <img src="${character.image}" alt="${character.name}">
            <span>${character.name}</span>
        `;
        card.addEventListener('click', () => selectCharacter(character, type));
        listElement.appendChild(card);
    });
}

// 选择角色
function selectCharacter(character, type) {
    if (type === 'ultraman') {
        if (gameState.selectedUltraman) {
            document.querySelector(`#ultraman-list .selected`)?.classList.remove('selected');
        }
        gameState.selectedUltraman = character;
    } else {
        if (gameState.selectedMonster) {
            document.querySelector(`#monster-list .selected`)?.classList.remove('selected');
        }
        gameState.selectedMonster = character;
    }
    event.currentTarget.classList.add('selected');
    updateCharacterSelection();
}

// 更新角色选择
function updateCharacterSelection() {
    battleButton.disabled = !(gameState.selectedUltraman && gameState.selectedMonster);
}

// 显示角色选择屏幕
function showCharacterSelect() {
    startScreen.classList.add('hidden');
    characterSelectScreen.classList.remove('hidden');
}

// 开始战斗
function startBattle() {
    characterSelectScreen.classList.add('hidden');
    battleScreen.classList.remove('hidden');
    setupBattleScreen();
}

// 设置战斗屏幕
function setupBattleScreen() {
    updateHealthDisplay();
    createActionButtons();
    updateBattleArea();
}

// 更新生命值显示
function updateHealthDisplay() {
    ultramanStats.innerHTML = `${gameState.selectedUltraman.name}: ${gameState.ultramanHealth}HP`;
    monsterStats.innerHTML = `${gameState.selectedMonster.name}: ${gameState.monsterHealth}HP`;
}

// 创建动作按钮
function createActionButtons() {
    actionButtons.innerHTML = `
        <button onclick="attack('normal')">普通攻击</button>
        <button onclick="attack('skill')">技能攻击</button>
    `;
}

// 更新战斗区域
function updateBattleArea() {
    battleArea.innerHTML = `
        <img src="${gameState.selectedUltraman.image}" alt="${gameState.selectedUltraman.name}" style="width:100px;height:100px;">
        <img src="${gameState.selectedMonster.image}" alt="${gameState.selectedMonster.name}" style="width:100px;height:100px;">
    `;
}

// 攻击函数
function attack(type) {
    if (gameState.turn === 'player') {
        const damage = calculateDamage(gameState.selectedUltraman, gameState.selectedMonster, type);
        gameState.monsterHealth -= damage;
        battleArea.innerHTML += `<p>${gameState.selectedUltraman.name}对${gameState.selectedMonster.name}造成了${damage}点伤害！</p>`;
        gameState.turn = 'monster';
        setTimeout(monsterAttack, 1000);
    }
    updateHealthDisplay();
    checkBattleEnd();
}

// 怪兽攻击
function monsterAttack() {
    const damage = calculateDamage(gameState.selectedMonster, gameState.selectedUltraman, 'normal');
    gameState.ultramanHealth -= damage;
    battleArea.innerHTML += `<p>${gameState.selectedMonster.name}对${gameState.selectedUltraman.name}造成了${damage}点伤害！</p>`;
    gameState.turn = 'player';
    updateHealthDisplay();
    checkBattleEnd();
}

// 计算伤害
function calculateDamage(attacker, defender, type) {
    let baseDamage = attacker.attack - defender.defense / 2;
    if (type === 'skill') {
        baseDamage *= 1.5;
    }
    return Math.max(Math.floor(baseDamage * (Math.random() * 0.4 + 0.8)), 1);
}

// 检查战斗是否结束
function checkBattleEnd() {
    if (gameState.ultramanHealth <= 0) {
        endBattle(gameState.selectedMonster.name);
    } else if (gameState.monsterHealth <= 0) {
        endBattle(gameState.selectedUltraman.name);
    }
}

// 结束战斗
function endBattle(winner) {
    battleScreen.classList.add('hidden');
    endScreen.classList.remove('hidden');
    document.getElementById('result').textContent = `${winner} 获胜！`;
}

// 重置游戏
function resetGame() {
    gameState = {
        selectedUltraman: null,
        selectedMonster: null,
        ultramanHealth: 100,
        monsterHealth: 100,
        turn: 'player'
    };
    endScreen.classList.add('hidden');
    startScreen.classList.remove('hidden');
    document.querySelectorAll('.character-card.selected').forEach(card => card.classList.remove('selected'));
    battleButton.disabled = true;
}

// 初始化游戏
initGame();