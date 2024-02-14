const playerNameArray = [...document.querySelectorAll('.player-name')];
const gameElements = [...document.querySelectorAll('.game-main')];
const formElement = document.querySelector('#form');
const winInfoBox = document.querySelector('.winner-name')
const holderArray = [...document.querySelectorAll('.holder')];
const boxArray = [...document.querySelectorAll('.tholder')];
const updateButton = document.getElementById('update');
const playerScoreDisplayArray = [...document.querySelectorAll('.player-score')];
const nextGameButton = document.querySelector('#win-btn');
const startGameButton = document.querySelector('#p-btn');
const inputs = [...document.querySelectorAll('input')];
const invalidInputBoxes = [...document.querySelectorAll('.invalid-input-box')];
const winningCombinations = [
    [0, 1, 2],  // Top Row
    [3, 4, 5],  // Middle Row
    [6, 7, 8],  // Bottom Row
    [0, 3, 6],  // Left Column
    [1, 4, 7],  // Middle Column
    [2, 5, 8],  // Right Column
    [0, 4, 8],  // Diagonal Top-Left to Bottom-Right
    [2, 4, 6]   // Diagonal Top-Right to Bottom-Left
];

let playerArray = [];

function setBoard() {
    const boardSize = 9;
    let board = new Array(boardSize).fill('');
    let turn = 0;
    let scoreUpdated = 0;
    let scoreArray = {p0: 0, p1: 0};
    function resetBoard() {
        board.fill('');
        turn = 0;
        scoreUpdated = 0;
    }
    function markBoard(xo, gridNum) {
        if ((board[gridNum] === '') && (playerArray[0].winCheck() != 'Win!') 
        && (playerArray[1].winCheck() != 'Win!')){
            board[gridNum] = xo;
            turn++;
        }
    }
    function checkBoard(xo) {
        let wIndexes = [];
        for (let i = 0; i < board.length; i++) {
            if (board[i] == xo) {
                wIndexes.push(i);
            } 
        }
        return wIndexes;
    }
    const getTurn = () => turn;
    const getScoreUpdated = () => scoreUpdated;
    function updateScoreUpdated(value) {
        scoreUpdated = value;
    }

    return {board, scoreUpdated, scoreArray, markBoard, checkBoard, getTurn, 
        resetBoard, getScoreUpdated, updateScoreUpdated};
}

const gameBoard = setBoard();

function managePlayer(player, xo) {
    const name = player;
    const id = `p${playerArray.length}`;
    let score = 0;
    const getScore = () => score;
    const addScore = () => score++;
    const markBoard = (gridNum) => gameBoard.markBoard(xo, gridNum);
    const winCheck = () => oper8r.isWinner(gameBoard.checkBoard(xo));
    return {name, id, getScore, addScore, markBoard, winCheck};
}

function gameLogic() {
    function checkArray(playerScoreArray, combinationArray) {
        return combinationArray.every(value => playerScoreArray.includes(value))
    }
    //this function returns true if all values in combinationArray are within playerArray
    function isWinner(playerScoreArray) {
        if ((gameBoard.getTurn() >= 9) && !(winningCombinations.some(combinationArray => 
            checkArray(playerScoreArray, combinationArray))))
            return 'Tie!'; //checks for max turns and if no winning combo is detected
        else if (winningCombinations.some(combinationArray => checkArray(playerScoreArray, combinationArray))) {
            return 'Win!';
        }
    }
    return {isWinner}
}

const oper8r = gameLogic();

function domLogic() {
    function markSymbol(gridNum) {
        if ((gameBoard.getTurn() % 2 == 0)) {
            playerArray[0].markBoard(gridNum);
        }
        else if ((gameBoard.getTurn() % 2 != 0)) {
            playerArray[1].markBoard(gridNum);
        }
    }
    function createWinMessage(player) {
        if (player.winCheck() !== 'Win!') {
            return null;
        }

        const winMessage = `${player.name} wins!`;
        const playerKey = player.id;
        if (gameBoard.getScoreUpdated() == 0) {
            player.addScore();
            gameBoard.scoreArray[playerKey] = player.getScore();
            gameBoard.updateScoreUpdated(1);
        }
        
        const playerScore = gameBoard.scoreArray;
        return [winMessage, playerScore];
    }
    function updateWinner() {
        let winnerMessage = createWinMessage(playerArray[0]);
        if (!winnerMessage) {
            winnerMessage = createWinMessage(playerArray[1]);
        }
        if (winnerMessage) {
            winInfoBox.innerText = winnerMessage[0];
            const scores = winnerMessage[1];
            const scoreHolder = [scores.p0, scores.p1]
            playerScoreDisplayArray.forEach((element, index) => 
            element.innerText = scoreHolder[index]);
            return; //exits early if wins, if win on 9, shows win but if tie on 9, doesn't exit and tie overwrites the box
            }
            if (gameBoard.getTurn() > 8) {
                winInfoBox.innerText = 'Tie!';
            }
    }
    function populateArray() {
        boxArray.forEach((box, index) => 
        box.innerText = gameBoard.board[index]);
    }
    function resetGame() {
        gameBoard.resetBoard();
        winInfoBox.innerText = '';
    }
    function createPlayer() {
        const p1Info = document.querySelector('#p1-name').value;
        const p2Info = document.querySelector('#p2-name').value;
        const playerDetails = [
            {name: p1Info, symbol: 'X'},
            {name: p2Info, symbol: 'O'}
        ]
        //? playerDetails.forEach(player => playerArray.push(managePlayer(player.name, player.symbol))); 
        //? multi line version of above code:
        playerDetails.forEach((gamer) => {
            const player = managePlayer(gamer.name, gamer.symbol);
            playerArray.push(player);
        })
        
    }
    // ! array.entries()
    //? this lets you do a for ... of on objects (entries) in an (iterable) array, instead of 
    //?the object itself which isn't iterable
    //* works like python enumerate, but only for arrays
    function updatePlayerName() {
        for (const [index, player] of playerArray.entries()) {
            playerNameArray[index].innerText = player.name
        }
    }
    function showGameArea() {
        formElement.classList.add('form-hide');
        formElement.classList.remove('form-display');
        gameElements.forEach(element => {
            element.classList.remove('game-hide');
            element.classList.add('game-display');
        })
    }
    function checkInputValidity() {
        const allValid = inputs.every((input) => input.checkValidity());
        return allValid;
    }
    function changeStartGreen() {
        startGameButton.classList.remove('invalid-button');
        startGameButton.classList.add('valid-button');
    }
    function changeStartRed() {
        startGameButton.classList.remove('valid-button');
        startGameButton.classList.add('invalid-button');
    }
    function showInputBoxInvalid(input) {
        invalidInputBoxes[input].innerText = 'A - Z / a - z only';
    }
    function hideInputBoxInvalid(input) {
        invalidInputBoxes[input].innerText = '';
    }
    return {markSymbol, populateArray, updateWinner, resetGame, createPlayer, 
        updatePlayerName, showGameArea, checkInputValidity, changeStartGreen, 
        changeStartRed, showInputBoxInvalid,hideInputBoxInvalid}
}

const manipul8r = domLogic();

inputs.forEach((input, index) => {
    input.addEventListener('input', () => {
        if (input.checkValidity() || input.value == '') {
            manipul8r.hideInputBoxInvalid(index);
        }
        else if (!input.checkValidity() && input.value != '') {
            manipul8r.showInputBoxInvalid(index)
        }
        if (manipul8r.checkInputValidity()) {
            manipul8r.changeStartGreen();
        }
        else if(!manipul8r.checkInputValidity()) {
            manipul8r.changeStartRed();
        }
    })
})

//?change commas to semicolons in future possibly
holderArray.forEach((box, index) => {
    box.addEventListener('click', () => {
        manipul8r.markSymbol(index);
        manipul8r.populateArray();
        manipul8r.updateWinner();
    });
})

nextGameButton.addEventListener('click', (event) => {
    event.preventDefault();
    manipul8r.resetGame();
    manipul8r.populateArray();
})

startGameButton.addEventListener('click', (event) => {
    event.preventDefault();
    if (manipul8r.checkInputValidity()) {
        manipul8r.createPlayer();
        manipul8r.updatePlayerName();
        manipul8r.showGameArea();
    }
})