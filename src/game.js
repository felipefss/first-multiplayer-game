const game = () => {
  const screen = {
    width: 50,
    height: 50
  };
  const state = {
    players: {},
    fruits: {
      f1: {
        x: Math.trunc(Math.random() * 50),
        y: Math.trunc(Math.random() * 50)
      }
    }
  };
  const playerSockets = [];

  const getState = () => state;

  const getScreenSize = () => screen;

  const subscribe = (observerFn) => {
    playerSockets.push(observerFn);
  };

  const notifyAll = () => {
    for (const sock of playerSockets) {
      sock.emit('updateState', getState());
    }
  };

  const detectCollision = (playerId) => {
    const player = state.players[playerId];
  
    const { fruits } = state;
    for (const fid in fruits) {
      const f = fruits[fid];
      if (f.x === player.x && f.y === player.y) {
        delete fruits[fid];
        player.points += 1;
      }
    }
  };

  const movePlayer = (command) => {
    const players = state.players;

    const AllowedMovements = {
      ArrowUp: id => {
        if (players[id].y - 1 >= 0) {
          players[id].y -= 1;
        }
      },

      ArrowRight: id => {
        if (players[id].x + 1 < screen.width) {
          players[id].x += 1;
        }
      },
      ArrowDown: id => {
        if (players[id].y + 1 < screen.height) {
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
    const makeMove = AllowedMovements[keyPressed];

    if (makeMove && playerId) {
      makeMove(playerId);
      detectCollision(playerId);
      notifyAll();
    }
  };

  const newPLayer = (socket) => {
    const player = {
      x: Math.trunc(Math.random() * screen.width),
      y: Math.trunc(Math.random() * screen.height),
      points: 0
    };
  
    state.players[socket.id] = player;
    subscribe(socket);
    notifyAll();
  };
  
  const removePlayer = (socket) => {
    delete state.players[socket.id];
    const index = playerSockets.findIndex(s => s.id === socket.id);
    playerSockets.splice(index, 1);
    notifyAll();
  };

  return {
    getScreenSize,
    newPLayer,
    removePlayer,
    movePlayer
  };
};

module.exports = game;