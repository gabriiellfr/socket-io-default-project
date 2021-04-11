const createGame = () => {
    const subscribe = observerFunction => {
            observers.push(observerFunction);
        },
        notifyAll = command => {
            for (const observerFunction of observers) {
                observerFunction(command);
            }
        },
        setState = newState => {
            Object.assign(state, newState);
        },
        addPlayer = command => {
            const playerId = command.playerId;
            const nickname = command.nickname;

            state.players.push({
                playerId: playerId,
                nickname: nickname
            });

            notifyAll({
                type: "update-players",
                state
            });
        },
        filterPlayer = playerId => {
            return state.players.findIndex(player => player.playerId === playerId);
        },
        removePlayer = command => {
            const playerId = command.playerId;
            state.players.splice(filterPlayer(playerId), 1);

            notifyAll({
                type: "update-players",
                state
            });
        },
        state = {
            players: []
        },
        observers = [];

    return {
        addPlayer,
        removePlayer,
        state,
        setState,
        subscribe
    };
};

module.exports = createGame;
