function gameBoard () {
    const board = [];
    const row = 3;
    const column = 3;

    for(r = 0;r < row; r++) {
        board[r] = [];
        for (c = 0; c < column; c++) {
            board[r].push(cell(`${r}${c}`));
        }
    }

    const getBoard = () => board;
    const getConsoleBoard = () => {
        const consoleBoard = board.map((row) => row.map((cell) => cell.getValue()))
        console.table(consoleBoard);
    }
    return {getBoard, getConsoleBoard}
}  

function cell(id) {
    let value = 0;
    const idCell = id;  
    const getValue = () => value;
    const getId = () =>idCell;
    const addToken = (player) =>{
        value = player;
    }
    
    return {addToken,getValue, getId}
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
        logGame('newRound');
        roundTurn++
        document.querySelector('.turn').innerHTML = `turn ${getTurn()}`
    }

    const getTurn = () => roundTurn;

    const getActivePlayers = () => activePlayer;

    const playRound = (row, col) => {
        if (board.getBoard()[row][col].getValue() === 0) {
            turn();
            board.getBoard()[row][col].addToken(activePlayer.token);
            document.querySelector(`.c${row}${col}`).innerHTML = activePlayer.token;
            if (winCondition(row, col)) {
                logGame('winner');
                return;
            } else if (getTurn() === 10) {
                logGame('noRound')
            }
            board.getConsoleBoard();
            switchPlayer();
            
        } else {
            logGame('illegalMove');
        }
    }

    const winCondition = (row, col) => {
        const horizontal = board.getBoard()[row];
        const vertical = board.getBoard().map( row => row[col]);
        const diagonal1 = [board.getBoard()[0][0], board.getBoard()[1][1], board.getBoard()[2][2]];
        const diagonal2 = [board.getBoard()[0][2], board.getBoard()[1][1], board.getBoard()[2][0]]
        const lines = [horizontal,vertical,diagonal1,diagonal2]
        let cellIds;
        lines.forEach(line => {
            if (line.every(token => token.getValue() === activePlayer.token)) {
                cellIds = line.map(cell => {
                    document.querySelector(`.c${cell.getId()}`).style.background = 'red'
                    return cell.getId()
                });
            }
        })
        return cellIds;
    }

    const logGame = (msg) => {
        const logGame = document.querySelector(".log");
        const logLib = {
            'winner': `==>  The winner is ${getActivePlayers()['name']}  <==`,
            'newRound': `==>  ${getActivePlayers()['name']}'s Turn  <==`,
            'noRound' : `==>  Game is Over, All cell has been filled  <==`,
            'illegalMove' : `===>  ${getActivePlayers()['name']} doing an illegal move  <==`
        }
        logGame.innerHTML = logLib[msg];
    }

    turn()
    return {getActivePlayers, playRound}
}


// HTML Build
function gameUI() {

    const boardHTML = document.querySelector(".board");
    const game = gameController()
    for (rows = 0; rows < 3; rows++) {
        for (cols = 0; cols < 3; cols++) {
            const col = document.createElement('div')
            col.className = `c${rows}${cols} row-${rows} col-${cols} cell`;
            col.addEventListener('click', (cell)=>{
                const action = cell.target.className.slice(1,3).split('');
                game.playRound(Number(action[0]), Number(action[1]))
            });
            boardHTML.appendChild(col);
        }
    }
}

gameUI()
