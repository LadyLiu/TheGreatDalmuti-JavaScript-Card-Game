//Player object with player information!  Function to get titles based on rank.  getPlayerNum will determine rank based on rounds.
players = {
    numPlayers: 4,
    playerTitles: ["Great Dalmuti", "Lesser Dalmuti", "Lesser Peon", "Greater Peon"],
    userRank: 0, //Rank in game for human player.  Can set to something for first game, or generate randomly as done below.

    //Send model.rounds -1 for current player - send model.rounds for next player. (rounds start at 1, arrays index starts at 0.)

    getPlayerTitle: function(rank) {
        return players.playerTitles[players.getPlayerNum(rank)];
    },

    getPlayerNum: function(rounds) {
        return (rounds) % players.numPlayers;
    }
};
