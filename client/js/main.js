import createGame from "./game.js";

const game = createGame();
const socket = io.connect(":3005", { transport: ["websocket"], withCredentials: true });

socket.on("connect", () => {
    const playerId = socket.id;

    while (!nickname || nickname == null || nickname == "") {
        var nickname = prompt("Insert your nickname", `ID-${playerId}`);
    }

    socket.emit("set-nickname", nickname);
    console.log(`${nickname} connected on Client with id: ${playerId}`);
});

const showPlayersOnline = players => {
    var playersOnline = $("#playersOnline");

    playersOnline.empty();

    players.forEach(player => {
        playersOnline.append(`<li class="list-group-item">${player.nickname}</li>`);
    });
};

socket.on("update-players", command => {
    game.addPlayer(command);
    game.setState(command.state);

    showPlayersOnline(command.state.players);
});

const addMessageTextArea = data => {
    var OutputMessage = $("#OutputMessage");
    
    OutputMessage.append(`<li class="list-group-item">${data.sender.nickname}: ${data.text}</li>`);

    $("#messageBox").scrollTop($("#messageBox")[0].scrollHeight);
};

socket.on("message", data => {
    addMessageTextArea(data);
});

const sendMessage = () => {
    var text = $("#inputMessage").val();

    if (text != "" && text != null) socket.emit("message", text);

    $("#inputMessage").val("");
    $("#inputMessage").focus();
};

$("#inputMessage").keypress(event => {
    if (event.which == 13) sendMessage();
});

$("#SendMessage").click(sendMessage);
