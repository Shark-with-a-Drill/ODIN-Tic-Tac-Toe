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
    const checkBoard = () => gameBoard.checkBoard(xo);
    return {name, getScore, addScore, markBoard, checkBoard};
}

const p1 = managePlayer('Shark', 'x');
const p2 = managePlayer('Tiger', 'o');

function gameLogic() {
    let p1ScoreArray = [];
    let p2ScoreArray = [];
    function updateScoreArray() {
        if (gameBoard.getTurn() % 2 != 0) {
            p1ScoreArray = p1.checkBoard();
            return p1ScoreArray;
        }
        else {
            p2ScoreArray = p2.checkBoard()
            return p2ScoreArray;
        }
    }
    return {updateScoreArray}
}

const oper8r = gameLogic();