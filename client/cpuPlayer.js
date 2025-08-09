console.log("cpuPlayer.js executing");

let gameState = {
    playerChoice: null,
    cpuChoice: null,
    gameActive: true,
    playerScore: 0,
    cpuScore: 0
};

const choices = ['Keo', 'Bua', 'Bao'];

function getCpuChoice() {
    return choices[Math.floor(Math.random() * choices.length)];
}

function sendChoice(rpsValue) {
    if (!gameState.gameActive) return;
    
    gameState.playerChoice = rpsValue;
    gameState.gameActive = false;
    
    let playerChoiceButton = document.createElement('button');
    playerChoiceButton.classList.add(rpsValue.toString().toLowerCase());
    playerChoiceButton.innerText = rpsValue;
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
    cpuButton.innerText = cpuChoice;
    
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
        return 'd'; // draw
    }
    
    const winConditions = {
        'Keo': 'Bao',    // p1 wins if p1 choice beats cpu choice
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

    winnerArea.innerHTML = '';
    const winnerTextEl = document.createElement('div');
    winnerTextEl.id = 'winnerText';
    winnerTextEl.textContent = winnerText;

    const scoreEl = document.createElement('div');
    scoreEl.id = 'scoreText';
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
        <button onclick="sendChoice('Bua')">Bua</button>
        <button onclick="sendChoice('Bao')">Bao</button>
        <button onclick="sendChoice('Keo')">Keo</button>
    `;
    
    document.getElementById('player2Choice').innerHTML = `
        <p id="opponentState">CPU san sang!</p> 
    `;

    const winnerArea = document.getElementById('winnerArea');
    winnerArea.innerHTML = '';
    winnerArea.style.display = 'none'; 
    
    gameState.playerChoice = null;
    gameState.cpuChoice = null;
    gameState.gameActive = true;
}
