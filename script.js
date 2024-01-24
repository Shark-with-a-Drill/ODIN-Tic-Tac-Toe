function setBoard() {
    let board = new Array(9).fill('');
    let turn = 0;
    function markBoard(xo, gridNum) {
        if (!board[gridNum]){
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
    function getTurn() {
        return turn;
    }
    return {board, markBoard, checkBoard, getTurn};
}

const gameBoard = setBoard();

function managePlayer(player, xo) {
    const name = player;
    let score = 0;
    const getScore = () => score;
    const addScore = () => score++;
    const markBoard = (gridNum) => gameBoard.markBoard(xo, gridNum);
    // const checkBoard = () => gameBoard.checkBoard(xo);
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
        else {
            return winningCombinations.some(combinationArray => checkArray(playerScoreArray, combinationArray));
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