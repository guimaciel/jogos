const PLAYER_SIGN = ["X", "O"];
let score1 = 0;
let score2 = 0;

let playerTime = 0;
let moves = 0;
let gameEnded = false;
let modeGame = 2;
let humanCanPlay = true;

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
  humanCanPlay = true;

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

function checkWinner(
  board,
  player,
  row,
  col,
  row2 = undefined,
  col2 = undefined
) {
  // clone board array
  const checkBoard = [];
  for (i = 0; i < 3; i++) {
    checkBoard[i] = [...board[i]];
  }

  checkBoard[row][col] = player;
  if (row2) {
    checkBoard[row2][col2] = player;
  }

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

    if (humanCanPlay) {
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
  humanCanPlay = false;
  if (gameEnded) return;
  document.getElementById("p1").classList.remove("playing");
  document.getElementById("p2").classList.add("playing");

  let winner = { status: false };

  const timeout = Math.floor(Math.random() * 1500) + 500;
  setTimeout(() => {
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

    // Check 2 positions
    let loopStop = false;

    if (!winner.status) {
      for (row1 = 0; row1 < 3; row1++) {
        for (col1 = 0; col1 < 3; col1++) {
          if (board[row1][col1] !== "") {
            continue;
          }
          for (row2 = 0; row2 < 3; row2++) {
            for (col2 = 0; col2 < 3; col2++) {
              if (board[row2][col2] !== "") {
                continue;
              }
              if (row1 !== row2 || col1 !== col2) {
                winner = checkWinner(
                  board,
                  PLAYER_SIGN[playerTime],
                  row1,
                  col1,
                  row2,
                  col2
                );
                if (winner.status) {
                  computerFillingPos(row1, col1);

                  return;
                }
                // winner = checkWinner(
                //   board,
                //   PLAYER_SIGN[(playerTime + 1) % 2],
                //   row1,
                //   col1,
                //   row2,
                //   col2
                // );

                // if (winner.status) {
                //   computerFillingPos(row1, col1);
                //   return;
                // }
              }
            }
          }
        }
      }
    }

    // Choose randon
    if (!winner.status) {
      loopStop = false;
      let tryCorner = true;
      let randRow, randCol;
      const priorities = [
        [[1, 1]],
        [
          [0, 0],
          [0, 2],
          [2, 0],
          [2, 2],
        ],
        [
          [0, 1],
          [1, 0],
          [1, 2],
          [2, 1],
        ],
      ];

      for (let i = 0; i < priorities.length; i++) {
        const options = priorities[i].filter(([row, col]) => {
          return board[row][col] === "";
        });
        if (options.length > 0) {
          const rand = Math.floor(Math.random() * options.length);
          computerFillingPos(options[rand][0], options[rand][1]);
          break;
        }
      }
    }
  }, timeout);
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
  humanCanPlay = true;
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
