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

    function Turn() {
        logGame(`${activePlayer['name']}'s Turn`);

    }

    const getActivePlayers = () => activePlayer;

    const playRound = (row, col) => {
        if (board.getBoard()[row][col].getValue() === 0) {
            board.getBoard()[row][col].addToken(activePlayer.token);
            if (winCondition(row, col)) {
                logGame("game is over, ");
                return;
            }
            board.getConsoleBoard();
            switchPlayer();
            Turn();
        } else {
            logGame(`${getActivePlayers()['name']} doing an ilegal move`);
        }
    }

    const winCondition = (row, col) => {
        const horizontal = board.getBoard()[row];
        const vertical = board.getBoard().map( row => row[col]);
        const diagonal1 = [board.getBoard()[0][0], board.getBoard()[1][1], board.getBoard()[2][2]];
        const diagonal2 = [board.getBoard()[0][2], board.getBoard()[1][1], board.getBoard()[2][0]]
                      
        if (horizontal.every(token => token.getValue() === activePlayer.token) ||
            vertical.every(token => token.getValue() === activePlayer.token) ||
            diagonal1.every(token => token.getValue() === activePlayer.token) ||
            diagonal2.every(token => token.getValue() === activePlayer.token)) {
            logGame(`The winner is ${activePlayer.name}`);
            return true;
        }
    }

    const logGame = (msg) => {
        const logGame = document.querySelector(".log");
        logGame.innerHTML += `-- > ${msg}<br>`;
    }
    return {getActivePlayers, playRound}
}