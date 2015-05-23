gameCycle = {
    gameOver: false,
    passCount: 0, //Number of players that passed in a row
    rounds: 0, //number of plays in the game so far

//Only used for initial game setup currently.  Check if can be reused elsewhere.
    gameSetUp: function () {
        var highestCard = cardsDeck.highestCard;
        var numPlayers = players.numPlayers;
        var deck = cardsDeck.createDeck(highestCard);

        deck = cardsDeck.shuffle(deck);
        cardsDeck.playerDecks = cardsDeck.dealCards(deck, numPlayers);
        cardsDeck.playerDecks = cardsDeck.sortDecks(cardsDeck.playerDecks, numPlayers);
        cardsDeck.createAllCardsPlayed();

    },
//Used after first game to load new games.
    loadNewGame: function(newUserRank) {
        setTimeout(function() {
            cardsDeck.playerDecks = [];
            cardsDeck.currentInPlay =  [];
            cardsDeck.allCardsPlayed = [];
            gameCycle.passCount = 0;
            players.userRank = newUserRank;
            gameCycle.rounds = 0;
            view.moveHistoryText = [];
            init();
            view.messageUpdate("");
            view.lastMoveUpdate("Let's start another round, <b>" + players.getPlayerTitle(newUserRank) + "</b>!");

            controller.cardClickEvent(taxes.taxesCheckSelect);
            taxes.taxes();

            $('#taxes').show();
            $("#taxes").prop("disabled", true);

            gameCycle.gameOver = false;
            //controller.checkTurn();
        }, 10000);
    },
//Used for first game load
    firstGameLoad: function () {
        controller.cardClickEvent(view.checkCardSelect);
        view.lastMoveUpdate("Let's start our first round, <b>" + players.getPlayerTitle(players.userRank) + "</b>!");
        controller.checkTurn();
        $("#taxes").hide();
    },
//Check passes and resets currentInPlay if all players passed.  Returns true if reset, and false if not.
    checkPasses: function () {
        gameCycle.passCount += 1;
        gameCycle.rounds += 1;

        if (gameCycle.passCount === players.numPlayers - 1) {
            cardsDeck.currentInPlay[0] = undefined;
            cardsDeck.currentInPlay[1] = undefined;
            gameCycle.passCount = 0;
            return true;
        } else {
            return false;
        }
    },
//Checks if the game is over.  If yes, sets gameOver to true to stop further AI plays, and sets newRank.
    checkGameOver: function (deck) {
        if (deck.length === 0) {
            gameCycle.gameOver = true;
            var newRank = 0;
            for (var i = 0; i < players.numPlayers; i++) {
                if (i != players.userRank && cardsDeck.playerDecks[i].length === 0) {
                    newRank += 1;
                }
            }
            view.gameOverMessage(newRank);

            gameCycle.loadNewGame(newRank);
        }
    }
};

players.userRank = helper.getRandomNumber(0, players.numPlayers);
window.onload = init();
window.onload = gameCycle.firstGameLoad();

//window.onload = taxTest();

function init() {
    gameCycle.gameSetUp();
    view.generateGameView(cardsDeck.playerDecks[players.userRank]);

    window.onresize = view.responsiveCheck;
    controller.buttonEvents();
    controller.scrollPlayHistory();
}

/*
function taxTest() {
    controller.cardClickEvent(taxes.taxesCheckSelect);
    taxes.taxes();

    $('#taxes').show();
    $("#taxes").prop("disabled", true);

}
*/

