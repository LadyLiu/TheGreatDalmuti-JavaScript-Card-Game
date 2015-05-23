//Object for all cards & deck variables and methods
cardsDeck = {
    highestCard: 12,
    playerDecks: [],
    currentInPlay: [], //currentInPlay[0] is # of cards and currentInPlay[1] is card value
    allCardsPlayed: [], //Array loaded based highestCard +1 (for wild) to store past played cards.  Allows AI card counting.

    //Creates deck based on highestCard - lowest is always 1.  Returns the deck.
    createDeck: function(highestCard) {
        var deck = [];
        for(var i = 1; i <= highestCard; i++ ) {
            for(var j = 1; j <= i; j++) {
                deck.push(i);
            }
        }
        deck.push(cardsDeck.highestCard+1, cardsDeck.highestCard+1); //add 2 jokers/wild cards/13s
        return deck;
    },
    //Shuffle! Based on the Futurama brain-shuffling episode
    shuffle: function (array) {
        for(var i = array.length-1; i > 0; i--) {
            var x, j = Math.floor(Math.random() * i);
            x = array[i];
            array[i] = array[j];
            array[j] = x;
        }
        return array;
    },
    //Deals cards from created deck function to players.  Returns the players decks array.
    dealCards: function(deck, players) {
        var playerDecks = [];
        for(var i = 0; i < players; i++) {
            playerDecks[i] = [];
        }

        //Player then rotates back to first player.  Terminates when out of cards.
        for(var j = 0, i = deck.length; i > 0; j++, i--) {
            if (j === players)
                j = 0;
            playerDecks[j].push(deck.pop());
        }
        return playerDecks;
    },
    //Organizes decks cards from least to greatest.
    sortDecks: function(playerDecks, players) {
        for(var j = 0; j < players; j++) {
            playerDecks[j].sort(helper.sortNumber);
        }
        return playerDecks;
    },
    //Initializes with all empty based on highest card #.
    createAllCardsPlayed: function() {
        for(var i = cardsDeck.highestCard + 1; i > 0; i--) {
            cardsDeck.allCardsPlayed.unshift([0, i]);
        }
    },
    //Updates model after cards played in view or from AI
    updateCardsPlayed: function(numCards, cardVal, playArray) {
        cardsDeck.currentInPlay = [numCards, cardVal];
        gameCycle.rounds += 1;
        gameCycle.passCount = 0;
        for(var j = 0; j < playArray.length; j++) {
            for(var i = 0; i < cardsDeck.allCardsPlayed.length; i++) {
                var cardLocation = cardsDeck.allCardsPlayed[i].indexOf(playArray[j]);
                if(cardLocation === 1) {
                    cardsDeck.allCardsPlayed[i][0] += 1;
                    break;
                }
            }
        }
    },
    //Updates based on played cards array.
    updatePlayerDeck: function(playArray, rank) {
        if(typeof(rank) === "number") {
            var deck = cardsDeck.playerDecks[rank];
        } else {
            var deck = cardsDeck.playerDecks[players.getPlayerNum(gameCycle.rounds)];
        }

        for(var i = 0; i < playArray.length; i++) {
            var index = deck.indexOf(playArray[i]);
            deck.splice(index, 1);
        }
    }

};