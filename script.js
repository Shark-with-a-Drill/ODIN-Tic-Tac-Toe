function setBoard() {
    let board = new Array(9).fill('');
    let turn = 0;
    let scoreUpdated = 0;
    let scoreArray = {p1: 0, p2: 0};
    function resetBoard() {
        board.fill('');
        turn = 0;
        scoreUpdated = 0;
    }
    function markBoard(xo, gridNum) {
        if ((board[gridNum] === '') && (p1.winCheck() != 'Win!') 
        && (p2.winCheck() != 'Win!')){
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

    return {board, scoreUpdated, scoreArray, markBoard, checkBoard, getTurn, resetBoard, getScoreUpdated, updateScoreUpdated};
}

const gameBoard = setBoard();

function managePlayer(player, xo) {
    const name = player;
    let score = 0;
    const getScore = () => score;
    const addScore = () => score++;
    const markBoard = (gridNum) => gameBoard.markBoard(xo, gridNum);
    const winCheck = () => oper8r.isWinner(gameBoard.checkBoard(xo));
    return {name, getScore, addScore, markBoard, winCheck};
}

const p1 = managePlayer('Shark', 'x');
const p2 = managePlayer('Tiger', 'o');

function gameLogic() {
    function checkArray(playerScoreArray, combinationArray) {
        return combinationArray.every(value => playerScoreArray.includes(value))
    }
    //this function returns true if all values in combinationArray are within playerArray
    function isWinner(playerScoreArray) {
        if ((gameBoard.getTurn() >= 9) && !(winningCombinations.some(combinationArray => checkArray(playerScoreArray, combinationArray))))
            return 'Tie!'; //checks for max turns and if no winning combo is detected
        else if (winningCombinations.some(combinationArray => checkArray(playerScoreArray, combinationArray))) {
            return 'Win!';
        }
    }
    return {isWinner}
}

const oper8r = gameLogic();

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

function domLogic() {
    function markSymbol(gridNum) {
        if ((gameBoard.getTurn() % 2 == 0)) {
            p1.markBoard(gridNum);
        }
        else if ((gameBoard.getTurn() % 2 != 0)) {
            p2.markBoard(gridNum);
        }
    }
    function createWinMessage(player) {
        if (player.winCheck() == 'Win!') {
            const winMessage = `${player.name} wins!`;
            const playerKey = player.name === 'Shark' ? 'p1' : 'p2';
            if (gameBoard.getScoreUpdated() == 0) {
                player.addScore();
                gameBoard.scoreArray[playerKey] = player.getScore();
                gameBoard.updateScoreUpdated(1);
            }
            const playerScore = gameBoard.scoreArray;
            return [winMessage, playerScore];
        }
        return null;
    }
    function updateWinner() {
        let winnerMessage = createWinMessage(p1);
        if (!winnerMessage) {
            winnerMessage = createWinMessage(p2);
        }
        if (winnerMessage) {
            winInfoBox.innerText = winnerMessage[0];
            const scores = winnerMessage[1];
            const scoreHolder = [scores.p1, scores.p2]
            playerScoreDisplayArray.forEach((element, index) => element.innerText = scoreHolder[index]);
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
    return {markSymbol, populateArray, updateWinner, resetGame}
}

const manipul8r = domLogic();

const winInfoBox = document.querySelector('.winner-name')
const holderArray = [...document.querySelectorAll('.holder')];
const boxArray = [...document.querySelectorAll('.tholder')];
const updateButton = document.getElementById('update');

const playerScoreDisplayArray = [...document.querySelectorAll('.player-score')];

const nextGameButton = document.querySelector('#win-btn');

holderArray.forEach((box, index) => {
    box.addEventListener('click', () => {
        manipul8r.markSymbol(index), manipul8r.populateArray(), manipul8r.updateWinner();
    });
});

nextGameButton.addEventListener('click', () => {
    manipul8r.resetGame(), manipul8r.populateArray();
})