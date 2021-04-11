const path = require("path"),
    express = require("express"),
    morgan = require("morgan"),
    compression = require("compression"),
    socketio = require("socket.io"),
    app = express();

const io = socketio(server, {
    cors: {
        origin: ["http://localhost:8080", "http://127.0.0.1:8080"],
        methods: ["GET", "POST"],
        transports: ["websocket"],
        credentials: true
    }
});

const createGame = require("./game.js");
const game = createGame();

game.start();
game.subscribe(command => {
    console.log(`> Emitting ${command.type}`);
    sockets.emit(command.type, command);
});

sockets.on("connection", socket => {
    const playerId = socket.id;
    console.log(`> Player connected: ${playerId}`, game.state);

    game.addPlayer({ playerId: playerId });
});

server.listen(3001, () => {
    console.log(`> Server listening on port: 3001`);
});
