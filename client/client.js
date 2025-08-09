console.log("client.js executing");

const socket = io();
let roomUniqueId = null;
let player1 = false;

function startCpuGame() {
    window.location.href = 'cpuPlayer.html';
}

function createGame() {
    player1 = true;
    socket.emit('createGame');
}

function joinGame() {
    roomUniqueId = document.getElementById('roomUniqueId').value;
    socket.emit('joinGame', {roomUniqueId: roomUniqueId});
}

socket.on("newGame", (data) => {
    roomUniqueId = data.roomUniqueId;
    document.getElementById('initial').style.display = 'none';
    document.getElementById('gamePlay').style.display = 'block';
    let copyButton = document.createElement('button');
    copyButton.style.display = 'block';
    copyButton.classList.add('btn','btn-primary','py-2', 'my-2')
    copyButton.innerText = 'Sao chep';
    copyButton.style.margin = '10px';
    copyButton.style.fontWeight = '400';
    copyButton.addEventListener('click', () => {
        navigator.clipboard.writeText(roomUniqueId).then(function() {
            console.log('Async: Copying to clipboard was successful!');
        }, function(err) {
            console.error('Async: Could not copy text: ', err);
        });
    });

    const waiting = document.getElementById('waitingArea');
    waiting.innerHTML = '';
    const msg = document.createElement('span');
    msg.textContent = `Dang doi doi thu, share code ${roomUniqueId} de moi vao`;
    msg.style.display = 'inline-block';
    msg.style.margin = '10px';
    msg.style.fontWeight = '400';
    waiting.appendChild(msg);
    waiting.appendChild(copyButton);
});

socket.on("playersConnected", () => {
    document.getElementById('initial').style.display = 'none';
    document.getElementById('waitingArea').style.display = 'none';
    document.getElementById('gameArea').style.display = 'flex';

    createOpponentState();
})

socket.on("p1Choice",(data)=>{
    if(!player1) {
        createOpponentChoiceButton(data);
    }
});

socket.on("p2Choice",(data)=>{
    if(player1) {
        createOpponentChoiceButton(data);
    }
});

socket.on("result",(data)=>{
    let winnerText = '';
    if(data.winner != 'd') {
        if(data.winner == 'p1' && player1) {
            winnerText = 'Ban la ke chien thang!!!!';
        } else if(data.winner == 'p1') {
            winnerText = 'Ban la ke thua cuoc....';
        } else if(data.winner == 'p2' && !player1) {
            winnerText = 'Ban la ke chien thang!!!!';
        } else if(data.winner == 'p2') {
            winnerText = 'Ban la ke thua cuoc ....';
        }
    } else {
        winnerText = `Hoa roi!?!?`;
    }
    
    const opponentState = document.getElementById('opponentState');
    const opponentButton = document.getElementById('opponentButton');
    const winnerArea = document.getElementById('winnerArea');
    
    if (opponentState) opponentState.style.display = 'none';
    if (opponentButton) opponentButton.style.display = 'block';
    if (winnerArea) {
        winnerArea.style.display = 'block';
        winnerArea.style.textAlign = 'center';
        winnerArea.style.padding = '8px 14px';
        winnerArea.style.margin = '10px';
        winnerArea.innerHTML = winnerText;
    }

    showRematchButton();
});

socket.on('rematchRequested', (data) => {
    const rematchStatus = document.getElementById('rematchStatus');
    if (rematchStatus) {
        rematchStatus.innerHTML = `${data.player === 'p1' ? 'doi thu' : 'doi thu'} muon danh lai!`;
    }
});

socket.on('rematchAccepted', () => {
    resetGameUI();
});

function showRematchButton() {
    const existingButton = document.getElementById('rematchButton');
    if (existingButton) {
        existingButton.remove();
    }
    const existingBack = document.getElementById('backButton');
    if (existingBack) {
        existingBack.remove();
    }

    const spacer = document.createElement('pr');
    const rematchButton = document.createElement('button');
    rematchButton.id = 'rematchButton';
    rematchButton.innerText = 'Danh Lai';
    rematchButton.addEventListener('click', requestRematch);
    rematchButton.style.display = 'block';

    const backButton = document.createElement('button');
    backButton.id = 'backButton';
    backButton.innerText = 'Ve lai trang chu';
    backButton.addEventListener('click', () => {
        window.location.href = 'index.html';
    });

    let rematchStatus = document.getElementById('rematchStatus');
    if (!rematchStatus) {
        rematchStatus = document.createElement('div');
        rematchStatus.id = 'rematchStatus';
    }
    
    const winnerArea = document.getElementById('winnerArea');
    winnerArea.appendChild(spacer);
    winnerArea.appendChild(rematchButton);
    winnerArea.appendChild(backButton);
    winnerArea.appendChild(rematchStatus);
}

function requestRematch() {
    socket.emit('requestRematch', {
        roomUniqueId: roomUniqueId,
        isPlayer1: player1
    });

    const rematchStatus = document.getElementById('rematchStatus');
    if (rematchStatus) {
        rematchStatus.innerHTML = 'Doi doi thu nhan choi lai';
        rematchStatus.style.textAlign = 'left';
    }
    
    const rematchButton = document.getElementById('rematchButton');

    if (rematchButton) {
        rematchButton.disabled = true;
        rematchButton.innerText = 'Dang doi..';
    }

    const winnerArea = document.getElementById('winnerArea');
    if (winnerArea) {
        winnerArea.style.display = 'block';
    }
}

function resetGameUI() {
    document.getElementById('player1Choice').innerHTML = `
        <button onclick="sendChoice('Bua')">Bua</button>
        <button onclick="sendChoice('Bao')">Bao</button>
        <button onclick="sendChoice('Keo')">Keo</button>
    `;
    document.getElementById('player2Choice').innerHTML = `
        <p id="opponentState">Dang doi doi thu ra tay</p> 
    `;

    document.getElementById('winnerArea').innerHTML = '';

 
}

function sendChoice(rpsValue) {
    const choiceEvent= player1 ? "p1Choice" : "p2Choice";
    socket.emit(choiceEvent,{
        rpsValue: rpsValue,
        roomUniqueId: roomUniqueId
    });
    let playerChoiceButton = document.createElement('button');
    playerChoiceButton.style.display = 'block';
    playerChoiceButton.classList.add(rpsValue.toString().toLowerCase());
    playerChoiceButton.innerText = rpsValue;
    document.getElementById('player1Choice').innerHTML = "";
    document.getElementById('player1Choice').appendChild(playerChoiceButton);

}

function createOpponentChoiceButton(data) {
    document.getElementById('opponentState').innerHTML = "Doi thu da ra tay";
    let opponentButton = document.createElement('button');
    opponentButton.id = 'opponentButton';
    opponentButton.classList.add(data.rpsValue.toString().toLowerCase());
    opponentButton.style.display = 'none';
    opponentButton.innerText = data.rpsValue;
    document.getElementById('player2Choice').appendChild(opponentButton);
}

function createOpponentState() {
    const player2choice = document.getElementById('player2Choice');
    if (player2choice && !document.getElementById('opponentState')) {
        const opponentState = document.createElement('p');
        opponentState.id = 'opponentState';
        opponentState.innerText = 'Dang doi doi thu ra tay';
        player2choice.appendChild(opponentState);
    }
}