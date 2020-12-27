const state = {
  screen: {
    width: 50,
    height: 50
  },
  players: {
    player1: {
      x: Math.trunc(Math.random() * 50),
      y: Math.trunc(Math.random() * 50)
    }
  },
  fruits: {
    f1: {
      x: Math.trunc(Math.random() * 50),
      y: Math.trunc(Math.random() * 50)
    }
  }
};

const getState = () => state;

const createGame = () => {

  //Return a copy of game state here instead of sharing state with other files
};

const detectCollision = (playerId) => {
  const player = state.players[playerId];

  const { fruits } = state;
  for (const fid in fruits) {
    const f = fruits[fid];
    if (f.x === player.x && f.y === player.y) {
      delete fruits[fid];
    }
  }
};

const movePlayer = (command, socket) => {
  const players = state.players;

  const AllowedMovements = {
    ArrowUp: id => {
      if (players[id].y - 1 >= 0) {
        players[id].y -= 1;
      }
    },

    ArrowRight: id => {
      if (players[id].x + 1 < state.screen.width) {
        players[id].x += 1;
      }
    },
    ArrowDown: id => {
      if (players[id].y + 1 < state.screen.height) {
        players[id].y += 1;
      }
    },
    ArrowLeft: id => {
      if (players[id].x - 1 >= 0) {
        players[id].x -= 1;
      }
    },
  };

  const { keyPressed, playerId } = command;
  // console.log(keyPressed, playerId)
  const makeMove = AllowedMovements[keyPressed];

  if (makeMove && playerId) {
    makeMove(playerId);
    detectCollision(playerId);
    socket.emit('updateState', getState());
  }
};

const newPLayer = () => {
  //Math.trunc(Math.random() * canvas.width)
};

const newFruit = () => { };

module.exports = {
  createGame,
  movePlayer,
  newPLayer,
  newFruit,
  getState
};