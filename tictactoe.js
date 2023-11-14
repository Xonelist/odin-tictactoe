function gameBoard () {
    const board = [];
    const row = 3;
    const column = 3;

    for(r = 0;r < row; r++) {
        board[r] = [];
        for (c = 0; c < column; c++) {
            board[r].push(cell());
        }
    }

    const getBoard = () => board;
    const getConsoleBoard = () => {
        const consoleBoard = board.map((row) => row.map((cell) => cell.getValue()))
        console.table(consoleBoard);
    }
    return {getBoard, getConsoleBoard}
}  

function cell() {
    let value = 0;

    const getValue = () => value;
    const addToken = (player) =>{
        value = player;
    }

    return {addToken,getValue}
}

function gameController(
    playerOneName = "Player One",
    playerTwoName = "Player Two"
) {
    const board = gameBoard();

    const players = [{
        name: playerOneName,
        token: 'O'
    },{
        name: playerTwoName,
        token: 'X'
    }]

    let activePlayer = players[0]

    function switchPlayer() {
        activePlayer = activePlayer === players[0] ? players[1] : players[0];
    }

    
    const getActivePlayers = () => activePlayer;

    const playRound = (row, col) => {
        if (board.getBoard()[row][col].getValue() === 0) {
            board.getBoard()[row][col].addToken(activePlayer.token);
            winCondition(row, col)
            board.getConsoleBoard();
            switchPlayer();
        } else {
            console.log(`${getActivePlayers()['name']} doing an ilegal move`);
        }
    }

    const winCondition = (row, col) => {
        if (board.getBoard()[row].every(token => token.getValue() === activePlayer.token)) {
            console.log(`The winner is ${activePlayer.name}`)
        }
    }
    return {getActivePlayers, playRound}
}