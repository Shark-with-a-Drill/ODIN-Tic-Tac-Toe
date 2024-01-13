function setBoard() {
    let board = new Array(9).fill('N');
    function markBoard(xo, gridNum) {
        board[gridNum] = xo;
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
    return {board, markBoard, checkBoard};
}
const gameBoard = setBoard();

function managePlayer(player, markBoard) {
    const name = player;
    let score = 0;
    const getScore = () => score;
    const addScore = () => score++;
    return {name, getScore, addScore, markBoard};
}

const p1 = managePlayer('Shark', gameBoard.markBoard);
const p2 = managePlayer('Tiger', gameBoard.markBoard);