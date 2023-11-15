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
    let roundTurn = 0;

    function switchPlayer() {
        activePlayer = activePlayer === players[0] ? players[1] : players[0];
    }

    function turn() {
        logGame(`${activePlayer['name']}'s Turn`);
        roundTurn++
        document.querySelector('.turn').innerHTML = `turn ${getTurn()}`
    }

    const getTurn = () => roundTurn;

    const getActivePlayers = () => activePlayer;

    const playRound = (row, col) => {
        if (board.getBoard()[row][col].getValue() === 0) {
            board.getBoard()[row][col].addToken(activePlayer.token);
            document.querySelector(`.c${row}${col}`).innerHTML = activePlayer.token;
            if (winCondition(row, col) || getTurn() === 10) {
                logGame("game is over");
                return;
            }
            board.getConsoleBoard();
            switchPlayer();
            turn();
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
        logGame.innerHTML = `-- > ${msg} < -- <br>`;
    }

    turn()
    return {getActivePlayers, playRound}
}


// HTML Build
const boardHTML = document.querySelector(".board");

for (rows = 0; rows < 3; rows++) {
    for (cols = 0; cols < 3; cols++) {
        const col = document.createElement('div')
        col.className = `c${rows}${cols} row-${rows} col-${cols} cell`;
        col.addEventListener('click', (cell)=>{
            const action = cell.target.className.slice(1,3).split('');
            a.playRound(Number(action[0]), Number(action[1]))
        });
        boardHTML.appendChild(col);
    }
}

a = gameController()
