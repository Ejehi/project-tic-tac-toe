function gameBoard() {
    let gameBoard = [
        ['', '', ''],
        ['', '', ''],
        ['', '', ''],
    ];

    const winningCombinations = [
        // Rows
        [[0,0], [0,1], [0,2]],
        [[1,0], [1,1], [1,2]],
        [[2,0], [2,1], [2,2]],

        // Columns
        [[0,0], [1,0], [2,0]],
        [[0,1], [1,1], [2,1]],
        [[0,2], [1,2], [2,2]],

        // Diagonals
        [[0,0], [1,1], [2,2]],
        [[0,2], [1,1], [2,0]],
    ];


    return {gameBoard, winningCombinations};
}

function gameController() {
    const board = gameBoard();

    const players = [
        {
            name: 'Player 1',
            marker: 'X',
            color: 'red',
            wins: 0
        },
        {
            name: 'Player 2',
            marker: 'O',
            color: 'cornflowerblue',
            wins: 0
        }
    ];

    const cellMapping = {
        "one": {
            row: 0,
            column: 0,
        },
        "two": {
            row: 0,
            column: 1,
        },
        "three": {
            row: 0,
            column: 2,
        },
        "four": {
            row: 1,
            column: 0,
        },
        "five": {
            row: 1,
            column: 1,
        },
        "six": {
            row: 1,
            column: 2,
        },
        "seven": {
            row: 2,
            column: 0,
        },
        "eight": {
            row: 2,
            column: 1,
        },
        "nine": {
            row: 2,
            column: 2,
        },
    };

    let activePlayer = players[0];

    function switchActivePlayer() {
        activePlayer = activePlayer == players[0] ? players[1] : players[0];
        return activePlayer;
    }

    function getActivePlayer() {
        return activePlayer;
    }

    function getCellMapping() {
        return cellMapping;
    }

    function getGameBoard() {
        return board.gameBoard;
    }

    function resetGameBoard() {
        for (let row = 0; row < 3; row++) {
            for (let column = 0; column < 3; column++) {
                board.gameBoard[row][column] = '';
            }
        }
        activePlayer = players[0];
    }

    function checkWinner() {
        for (const combination of board.winningCombinations) {
            const [[r1, c1], [r2, c2], [r3, c3]] = combination;

            if (
                board.gameBoard[r1][c1] !== '' &&
                board.gameBoard[r1][c1] === board.gameBoard[r2][c2] &&
                board.gameBoard[r1][c1] === board.gameBoard[r3][c3]
            ) {
                return board.gameBoard[r1][c1]; // 'X' or 'O'
            }
        }

        return null; // No winner
    }

    return {players, getCellMapping, switchActivePlayer, checkWinner, getGameBoard, resetGameBoard, getActivePlayer};

}

const game = gameController();


const turnIndicator = document.querySelector("#turn-indicator");
const firstPlayer = document.createElement("div");
const secondPlayer = document.createElement("div");

const dialogBox = document.querySelector("dialog");
const cancelDialog = document.querySelector("#close");
const submitDialog = document.querySelector("#submit");
const scoreBoard = document.querySelector("#score-board");
const restartBtn = document.querySelector("#restart");
const cells = document.querySelectorAll(".cell");
const playerOneInput = document.querySelector("#player-one");
const playerTwoInput = document.querySelector("#player-two");

function switchTurnIndicator() {
    if (firstPlayer.classList.contains('active')) {
        firstPlayer.classList.toggle("active", false);
        firstPlayer.classList.toggle("in-active", true);
    }
    else {
        firstPlayer.classList.toggle("in-active", false);
        firstPlayer.classList.toggle("active", true);
    }

    if (secondPlayer.classList.contains('active')) {
        secondPlayer.classList.toggle("active", false);
        secondPlayer.classList.toggle("in-active", true);
    }
    else {
        secondPlayer.classList.toggle("in-active", false);
        secondPlayer.classList.toggle("active", true);
    }
    
}

function setTurnIndicator() {
    firstPlayer.textContent = game.players[0].name;
    secondPlayer.textContent = game.players[1].name;

    firstPlayer.classList.add('active');
    secondPlayer.classList.add('in-active');

    turnIndicator.appendChild(firstPlayer);
    turnIndicator.appendChild(secondPlayer);
}

window.addEventListener('load', () =>{
    dialogBox.showModal();
});

cancelDialog.addEventListener('click', (event) =>{
    event.preventDefault();
    dialogBox.close();
    setTurnIndicator();
});

dialogBox.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
    }
    setTurnIndicator();
});

submitDialog.addEventListener('click', (event) =>{
    event.preventDefault();
    if (playerOneInput.value !== '') {
        game.players[0].name = playerOneInput.value;
    }
    if (playerTwoInput.value !== '') {
        game.players[1].name = playerTwoInput.value;
    }
    dialogBox.close();
    setTurnIndicator();
});

cells.forEach((cell) => cell.addEventListener('mouseover', (event) => {
    if (game.checkWinner() == null) {
        if (cell.textContent == '' && game.getGameBoard()[game.getCellMapping()[cell.getAttribute('id')].row][game.getCellMapping()[cell.getAttribute('id')].column] == '') {
            cell.textContent = game.getActivePlayer().marker;
            cell.style.color = game.getActivePlayer().color;
        }
    }
    else {

    }
}));

cells.forEach((cell) => cell.addEventListener('mouseout', (event) => {
    if (game.checkWinner() == null) {
        if (game.getGameBoard()[game.getCellMapping()[cell.getAttribute('id')].row][game.getCellMapping()[cell.getAttribute('id')].column] == '') {
            cell.textContent = '';
        }
    }
}));

cells.forEach((cell) => cell.addEventListener('click', (event) => {
    if (game.checkWinner() == null) {
        if (game.getGameBoard()[game.getCellMapping()[cell.getAttribute('id')].row][game.getCellMapping()[cell.getAttribute('id')].column] == '') {
            cell.textContent = game.getActivePlayer().marker;
            cell.style.color = game.getActivePlayer().color;
            game.getGameBoard()[game.getCellMapping()[cell.getAttribute('id')].row][game.getCellMapping()[cell.getAttribute('id')].column] = game.getActivePlayer().marker;
            if (game.checkWinner() == null) {
                switchTurnIndicator();
                game.switchActivePlayer();
            }
            else {
                scoreBoard.textContent = `${game.getActivePlayer().name} has won this round!`;
            }
        }
    }
    else {
        scoreBoard.textContent = `${game.getActivePlayer().name} has won this round!`;
    }
}));

restartBtn.addEventListener('click', (event) => {
    game.resetGameBoard();
    scoreBoard.textContent = '';
    cells.forEach((cell) => cell.textContent = '');
    setTurnIndicator();
});