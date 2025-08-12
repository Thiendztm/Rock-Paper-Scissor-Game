console.log("cpuPlayer.js executing");

let gameState = {
    playerChoice: null,
    cpuChoice: null,
    gameActive: true,
    playerScore: 0,
    cpuScore: 0
};

const choices = ['Bua', 'Bao', 'Keo'];

function getChoiceIcon(choice) {
    const iconMap = {
        'Bua': 'fist.jpg',
        'Bao': 'paper.jpg', 
        'Keo': 'scissor.jpg'
    };
    return iconMap[choice] || choice;
}

function getCpuChoice() {
    return choices[Math.floor(Math.random() * choices.length)];
}

function sendChoice(rpsValue) {
    if (!gameState.gameActive) return;
    
    gameState.playerChoice = rpsValue;
    gameState.gameActive = false;
    
    let playerChoiceButton = document.createElement('button');
    playerChoiceButton.classList.add(rpsValue.toString().toLowerCase());
    playerChoiceButton.classList.add('choice-button');
    
    const img = document.createElement('img');
    img.src = getChoiceIcon(rpsValue);
    img.alt = rpsValue;
    img.className = 'icon';
    playerChoiceButton.appendChild(img);
    
    document.getElementById('player1Choice').innerHTML = "";
    document.getElementById('player1Choice').appendChild(playerChoiceButton);

    const opponentState = document.getElementById('opponentState');
    if (opponentState) {
        opponentState.innerText = "CPU da ra tay";
    }

    setTimeout(() => {
        processCpuTurn();
    }, 800 + Math.random() * 400); 
}

function processCpuTurn() {
    gameState.cpuChoice = getCpuChoice();
    
    createCpuChoiceButton(gameState.cpuChoice);
    
    setTimeout(() => {
        calculateResult();
    }, 500);
}

function createCpuChoiceButton(cpuChoice) {
    let cpuButton = document.createElement('button');
    cpuButton.id = 'opponentButton';
    cpuButton.classList.add(cpuChoice.toString().toLowerCase());
    cpuButton.classList.add('choice-button');
    
    const img = document.createElement('img');
    img.src = getChoiceIcon(cpuChoice);
    img.alt = cpuChoice;
    img.className = 'icon';
    cpuButton.appendChild(img);
    
    const player2Choice = document.getElementById('player2Choice');
    player2Choice.innerHTML = '';
    player2Choice.appendChild(cpuButton);
}

function calculateResult() {
    const result = determineWinner(gameState.playerChoice, gameState.cpuChoice);
    
    if (result === 'p1') {
        gameState.playerScore++;
    } else if (result === 'p2') {
        gameState.cpuScore++;
    }
    
    displayResult(result);
    showRematchButton();
}

function determineWinner(playerChoice, cpuChoice) {
    if (playerChoice === cpuChoice) {
        return 'd';
    }
    
    const winConditions = {
        'Keo': 'Bao',   
        'Bua': 'Keo',
        'Bao': 'Bua'
    };
    
    if (winConditions[playerChoice] === cpuChoice) {
        return 'p1';
    } else {
        return 'p2';
    }
}

function displayResult(result) {
    let winnerText = '';
    
    if (result === 'p1') {
        winnerText = 'Ban la ke chien thang!!!!';
    } else if (result === 'p2') {
        winnerText = 'Ban la ke thua cuoc...';
    } else {
        winnerText = 'Hoa roi!?!?';
    }
    
    const winnerArea = document.getElementById('winnerArea');
    winnerArea.style.display = 'block'; 
    winnerArea.style.textAlign = 'center';
    winnerArea.style.padding = '8px 14px';
    winnerArea.style.margin = '10px';
    winnerArea.className = 'glow';

    winnerArea.innerHTML = '';
    const winnerTextEl = document.createElement('div');
    winnerTextEl.id = 'winnerText';
    winnerTextEl.textContent = winnerText;

    const scoreEl = document.createElement('div');
    scoreEl.id = 'scoreText';
    scoreEl.className = 'glow';
    scoreEl.textContent = `Diem so: Ban ${gameState.playerScore} - ${gameState.cpuScore} CPU`;

    winnerArea.appendChild(winnerTextEl);
    winnerArea.appendChild(scoreEl);
}

function showRematchButton() {
    const existingActions = document.getElementById('actions');
    if (existingActions) existingActions.remove();
    const existingRematch = document.getElementById('rematchButton');
    if (existingRematch) existingRematch.remove();
    const existingBack = document.getElementById('backButton');
    if (existingBack) existingBack.remove();

    const rematchButton = document.createElement('button');
    rematchButton.id = 'rematchButton';
    rematchButton.innerText = 'Danh Lai';
    rematchButton.addEventListener('click', resetGameUI);

    const backButton = document.createElement('button');
    backButton.id = 'backButton';
    backButton.innerText = 'Ve lai trang chu';
    backButton.addEventListener('click', () => {
        window.location.href = 'index.html';
    });

    const actions = document.createElement('div');
    actions.id = 'actions';
    const actReMatch = document.createElement('div');
    actReMatch.className = 'action-rematch-button';
    const actBackWrap = document.createElement('div');
    actBackWrap.className = 'action-back-button';

    actReMatch.appendChild(rematchButton);
    actBackWrap.appendChild(backButton);
    actions.appendChild(actReMatch);
    actions.appendChild(actBackWrap);

    const winnerArea = document.getElementById('winnerArea');
    winnerArea.appendChild(actions);
}

function resetGameUI() {
    document.getElementById('player1Choice').innerHTML = `
        <button onclick="sendChoice('Bua')" id="but1"><img src="fist.jpg" alt="" class="icon"></button>
        <button onclick="sendChoice('Bao')" id="but2"><img src="paper.jpg" alt="" class="icon"></button>
        <button onclick="sendChoice('Keo')" id="but3"><img src="scissor.jpg" alt="" class="icon"></button>
    `;
    
    document.getElementById('player2Choice').innerHTML = `
        <p id="opponentState" style="color: white;">CPU san sang!</p> 
    `;

    const winnerArea = document.getElementById('winnerArea');
    winnerArea.innerHTML = '';
    winnerArea.style.display = 'none'; 
    
    gameState.playerChoice = null;
    gameState.cpuChoice = null;
    gameState.gameActive = true;
}
