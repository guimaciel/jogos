const PLAYER_SIGN = ["X", "O"];
let score1 = 0;
let score2 = 0;

let playerTime = 0;
let moves = 0;
let gameEnded = false;
let modeGame = 2;

const board = [
  ["", "", ""],
  ["", "", ""],
  ["", "", ""],
];

const posGrid = [
  ["pos0", "pos1", "pos2"],
  ["pos3", "pos4", "pos5"],
  ["pos6", "pos7", "pos8"],
];

clearBoard();

function clearBoard() {
  playerTime = 0;
  moves = 0;
  gameEnded = false;

  for (row = 0; row < 3; row++) {
    for (col = 0; col < 3; col++) {
      board[row][col] = "";
      const elementId = posGrid[row][col];
      const element = document.getElementById(elementId);
      element.textContent = "";
      element.className = "pos";
    }
  }

  document.getElementById("p1").className = "score p1";
  document.getElementById("p2").className = "score p2";
  document.getElementById("p1").classList.add("playing");
  document.getElementById("btnReset").textContent = "Clear Game";

  document.getElementById("score-p1").textContent = score1;
  document.getElementById("score-p2").textContent = score2;
}

function checkWinner(board, player, row, col) {
  // clone board array
  const checkBoard = [];
  for (i = 0; i < 3; i++) {
    checkBoard[i] = [...board[i]];
  }

  checkBoard[row][col] = player;

  const winningCombos = [
    // Rows
    [
      [0, 0],
      [0, 1],
      [0, 2],
    ],
    [
      [1, 0],
      [1, 1],
      [1, 2],
    ],
    [
      [2, 0],
      [2, 1],
      [2, 2],
    ],

    // Cols
    [
      [0, 0],
      [1, 0],
      [2, 0],
    ],
    [
      [0, 1],
      [1, 1],
      [2, 1],
    ],
    [
      [0, 2],
      [1, 2],
      [2, 2],
    ],

    // Diagonals
    [
      [0, 0],
      [1, 1],
      [2, 2],
    ],
    [
      [0, 2],
      [1, 1],
      [2, 0],
    ],
  ];

  const comp = winningCombos.map((combo) =>
    combo.every(([row, col]) => checkBoard[row][col] === player)
  );

  const winner = {
    status: false,
    idx: undefined,
    arr: [],
  };

  const winn = comp.filter((status, idx, arr) => {
    if (status) {
      winner.status = true;
      winner.idx = idx;
      winner.arr = winningCombos[idx];
      return winner;
    }
  });

  return winner;
}

// Click event - game
document.addEventListener("click", (e) => {
  if (e.target.className === "pos" && !gameEnded) {
    const pos = e.target.id;

    moves++;

    const element = document.getElementById(pos);

    const row = element.getAttribute("data-row");
    const col = element.getAttribute("data-col");

    const winner = checkWinner(board, PLAYER_SIGN[playerTime], row, col);

    element.textContent = PLAYER_SIGN[playerTime];
    element.classList.add(PLAYER_SIGN[playerTime]);
    board[row][col] = PLAYER_SIGN[playerTime];

    if (winner.status) {
      hasWinner(winner);
    }

    playerTime = moves % 2;
    if (modeGame !== 2 && moves < 9) {
      computerPlay();
    }
    if (playerTime === 0) {
      document.getElementById("p1").classList.add("playing");
      document.getElementById("p2").classList.remove("playing");
    } else {
      document.getElementById("p1").classList.remove("playing");
      document.getElementById("p2").classList.add("playing");
    }

    if (moves > 8) {
      noWinners();
    }
  }
});

function hasWinner(winner) {
  gameEnded = true;
  if (playerTime === 0) {
    score1++;
    document.getElementById("p1").classList.add("winner-score");
    document.getElementById("p2").classList.add("loose");
  } else {
    score2++;
    document.getElementById("p2").classList.add("winner-score");
    document.getElementById("p1").classList.add("loose");
  }
  document.getElementById("score-p1").textContent = score1;
  document.getElementById("score-p2").textContent = score2;
  document.getElementById("btnReset").textContent = "New Game";
  winner.arr.map(([row, col]) => {
    document.getElementById(posGrid[row][col]).classList.add("winner");
  });
}

function noWinners() {
  const arr = posGrid.flat(1);
  arr.map((pos) => {
    const element = document.getElementById(pos);
    element.classList.add("no-winner");
  });
  document.getElementById("p1").classList.remove("playing");
  document.getElementById("p2").classList.remove("playing");
  document.getElementById("btnReset").textContent = "New Game";
}

function computerPlay() {
  if (gameEnded) return;
  document.getElementById("p1").classList.remove("playing");
  document.getElementById("p2").classList.add("playing");

  let winner = { status: false };

  // Check if wins with one position
  for (row = 0; row < 3; row++) {
    for (col = 0; col < 3; col++) {
      if (board[row][col] === "") {
        winner = checkWinner(board, PLAYER_SIGN[playerTime], row, col);

        if (winner.status) {
          computerFillingPos(row, col);
          return;
        }
      }
    }
  }

  // Check if looses with one position
  for (row = 0; row < 3; row++) {
    for (col = 0; col < 3; col++) {
      if (board[row][col] === "") {
        winner = checkWinner(
          board,
          PLAYER_SIGN[(playerTime + 1) % 2],
          row,
          col
        );

        if (winner.status) {
          computerFillingPos(row, col);
          return;
        }
      }
    }
  }

  // Choose randon
  if (!winner.status) {
    let loopStop = false;
    while (!loopStop) {
      const randRow = Math.floor(Math.random() * 3);
      const randCol = Math.floor(Math.random() * 3);
      if (board[randRow][randCol] === "") {
        loopStop = true;
        computerFillingPos(randRow, randCol);
      }
    }
  }
}

function computerFillingPos(row, col) {
  winner = checkWinner(board, PLAYER_SIGN[playerTime], row, col);
  const element = document.getElementById(posGrid[row][col]);

  element.textContent = PLAYER_SIGN[playerTime];
  element.classList.add(PLAYER_SIGN[playerTime]);
  board[row][col] = PLAYER_SIGN[playerTime];
  if (winner.status) {
    hasWinner(winner);
  }
  moves++;
  playerTime = moves % 2;

  document.getElementById("p1").classList.add("playing");
  document.getElementById("p2").classList.remove("playing");
}

function selectChange() {
  const select = document.getElementById("slct-player");
  modeGame = select.options[select.selectedIndex].value;

  if (modeGame == 1) {
    document.getElementById("player2-name").textContent = "Computer";
  } else {
    document.getElementById("player2-name").textContent = "Player 2";
  }
  clearBoard();
}
