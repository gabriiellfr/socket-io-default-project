const path = require("path"),
    express = require("express"),
    morgan = require("morgan"),
    compression = require("compression"),
    socketio = require("socket.io"),
    createGame = require("./game.js"),
    PORT = 3005,
    app = express();

module.exports = app;

const createApp = () => {
    // logging middleware
    app.use(morgan("dev"));

    // body parsing middleware
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));

    // compression middleware
    app.use(compression());
};

const startListening = () => {
    const server = app.listen(PORT, () => console.log(`Mixing it up on port ${PORT}`));
    const io = socketio(server, {
        cors: {
            origin: ["http://192.168.1.3:8080"],
            methods: ["GET", "POST"],
            transports: ["websocket"],
            credentials: true
        }
    });

    ioFeatures(io);
};

const ioFeatures = io => {
    const game = createGame();

    game.subscribe(command => {
        io.emit(command.type, command);
    });

    io.on("connection", socket => {
        const playerId = socket.id;

        socket.on("message", text => {
            const sender = game.state.players.find(player => player.playerId == playerId);

            io.emit("message", { text: text, sender: sender });
        });

        socket.on("set-nickname", nickname => {
            console.log(playerId, "connected");

            if (nickname && nickname != null && nickname != "")
                game.addPlayer({ playerId: playerId, nickname: nickname });
        });

        socket.on("disconnect", () => {
            console.log(playerId, "disconnect");

            game.removePlayer({ playerId: playerId });
        });
    });
};

async function bootApp() {
    await createApp();
    await startListening();
}

bootApp();
