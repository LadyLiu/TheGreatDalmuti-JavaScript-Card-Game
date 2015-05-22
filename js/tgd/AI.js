//All the computer-made decisions!

AI = {
    takeTurn: function() {
        if(!gameCycle.gameOver) {
            setTimeout(AI.checkAvailableCards, 1500);
        }

    },
    //Check what cards the AI could play, then plays them or passes if none are available and controller.checkTurn() to continue rounds.
    checkAvailableCards: function() {
        var currentPlayer = players.getPlayerNum(gameCycle.rounds);
        var deck = cardsDeck.playerDecks[currentPlayer];
        var numCards = cardsDeck.currentInPlay[0];
        var currentCardVal = cardsDeck.currentInPlay[1];
        var newCardVal = undefined;

        //Checks if they are lead - if so, plays all their highest cards
        if(numCards === undefined) {
            newCardVal = deck[deck.length - 1]; //Sets newCard to highest value card
            var startIndex = deck.indexOf(newCardVal);
            var playArray = deck.slice(startIndex, deck.length);
            numCards = playArray.length;
            cardsDeck.updatePlayerDeck(playArray);
            //If not lead, checks to play cards the next lower than the current
        } else {
            for(var i = currentCardVal-1; i >= numCards; i--) {
                var startIndex = deck.indexOf(i);
                var endIndex = deck.lastIndexOf(i) + 1;
                var playArray = deck.slice(startIndex, endIndex);
                if (playArray.length >= numCards) {
                    playArray = playArray.slice(0, numCards);
                    //console.log(model.getPlayerTitle(currentPlayer)+ " Here's what I'll play! " + deck.slice(startIndex, startIndex + numCards));
                    cardsDeck.updatePlayerDeck(playArray);
                    newCardVal = i;
                    break;
                }
            }
        }
        if(!newCardVal) {
            view.pass();
        } else {
            view.playCards(numCards, newCardVal, playArray);
            controller.checkTurn();
        }
    },

    //Pays taxes - currently also takes userTaxes to pay as well from taxes.taxesViewButton,  but need to refactor.
    payTaxes: function(userTaxes) {
        var greatDalmuti = cardsDeck.playerDecks[0];
        var gdLength = greatDalmuti.length;
        var lesserDalmuti = cardsDeck.playerDecks[1];
        var ldLength = lesserDalmuti.length;
        var lesserPeon = cardsDeck.playerDecks[2];
        var greaterPeon = cardsDeck.playerDecks[3];
        var wildVal = cardsDeck.highestCard + 1;
        var userRank = players.userRank;
        var numPlayers = players.numPlayers;


        //greaterPeon paying taxes
        greatDalmuti.push(greaterPeon.slice(0, 2)[0]);
        greatDalmuti.push(greaterPeon.slice(0, 2)[1]);

        if (userRank === 0) {
            view.lastMoveUpdate("<b>The Greater Peon</b> paid you a " + greaterPeon.slice(0, 2)[0] + " and " + greaterPeon.slice(0, 2)[1] + " for taxes");
        }

        greaterPeon.splice(0, 2);

        //lesserPeon paying taxes
        lesserDalmuti.push(lesserPeon.slice(0, 1)[0]);
        if (userRank === 1) {
            view.lastMoveUpdate("<b>The Lesser Peon</b> paid you a " + lesserPeon.slice(0, 1)[0] + " for taxes");
        }
        if (userRank === numPlayers - 2) {
            view.lastMoveUpdate("You paid <b>The Lesser Dalmuti</b> a " + lesserPeon.slice(0, 1)[0] + " for taxes");
        }
        lesserPeon.splice(0, 1);


        /*for (var i = 1; i < 4; i++) {
         var j = i + 1;
         if (greatDalmuti[gdLength - i] !== wildVal) {
         greaterPeon.push(greatDalmuti.slice(gdLength - j, gdLength)[0]);
         greaterPeon.push(greatDalmuti.slice(gdLength - j, gdLength)[1]);
         if (userRank === numPlayers - 1) {
         view.lastMoveUpdate("<b>The Great Dalmuti</b> gave you a " + greatDalmuti.slice(gdLength - j, gdLength)[0] + " and a " + greatDalmuti.slice(gdLength - j, gdLength)[1] + " out of the kindness of her heart");
         }
         greatDalmuti.splice(gdLength - j, 2);
         if (userRank === numPlayers - 1) {
         view.lastMoveUpdate("<b>The Great Dalmuti</b> gave you a " + greatDalmuti.slice(gdLength - j, gdLength)[0] + " and a " + greatDalmuti.slice(gdLength - j, gdLength)[1] + " out of the kindness of her heart");
         }

         }
         }*/

        //greatDalmuti giving the greaterPeon cards - 2 highest value that aren't wilds - need to refactor
        if (userRank != 0) {
            if (greatDalmuti[gdLength - 1] !== wildVal) {
                greaterPeon.push(greatDalmuti.slice(gdLength - 2, gdLength)[0]);
                greaterPeon.push(greatDalmuti.slice(gdLength - 2, gdLength)[1]);
                if (userRank === numPlayers - 1) {
                    view.lastMoveUpdate("<b>The Great Dalmuti</b> gave you a " + greatDalmuti.slice(gdLength - 2, gdLength)[0] + " and a " + greatDalmuti.slice(gdLength - 2, gdLength)[1] + " out of the kindness of her heart");
                }
                greatDalmuti.splice(gdLength - 3, 2);
            } else if (greatDalmuti[gdLength - 2] !== wildVal) {
                greaterPeon.push(greatDalmuti.slice(gdLength - 3, gdLength)[0]);
                greaterPeon.push(greatDalmuti.slice(gdLength - 3, gdLength)[1]);
                if (userRank === numPlayers - 1) {
                    view.lastMoveUpdate("<b>The Great Dalmuti</b> gave you a " + greatDalmuti.slice(gdLength - 3, gdLength)[0] + " and a " + greatDalmuti.slice(gdLength - 3, gdLength)[1] + " out of the kindness of her heart");
                }
                greatDalmuti.splice(gdLength - 3, 2);

            } else {
                greaterPeon.push(greatDalmuti.slice(gdLength - 4, gdLength)[0]);
                greaterPeon.push(greatDalmuti.slice(gdLength - 4, gdLength)[1]);
                if (userRank === numPlayers - 1) {
                    view.lastMoveUpdate("<b>The Great Dalmuti</b> gave you a " + greatDalmuti.slice(gdLength - 4, gdLength)[0] + " and a " + greatDalmuti.slice(gdLength - 4, gdLength)[1] + " out of the kindness of her heart");
                }
                greatDalmuti.splice(gdLength - 4, 2);
            }
        } else {
            greaterPeon.push(userTaxes[0], userTaxes[1]);
            cardsDeck.updatePlayerDeck(userTaxes);
        }

        //lesserDalmuti giving lesserPeon cards - 1 highest value thats not a wild
        if (userRank != 1) {
            if (lesserDalmuti[ldLength - 1] !== wildVal) {
                lesserPeon.push(lesserDalmuti.slice(ldLength - 1, ldLength)[0]);
                if (userRank === numPlayers - 2) {
                    view.lastMoveUpdate("<b>The Lesser Dalmuti</b> gave you a " + lesserDalmuti.slice(ldLength - 1, ldLength)[0] + " out of the kindness of her heart");
                }
                lesserDalmuti.splice(ldLength - 1, 1);

            } else if (lesserDalmuti[ldLength - 2] !== wildVal) {
                lesserPeon.push(lesserDalmuti.slice(ldLength - 2, ldLength)[0]);
                if (userRank === numPlayers - 2) {
                    view.lastMoveUpdate("<b>The Lesser Dalmuti</b> gave you a " + lesserDalmuti.slice(ldLength - 2, ldLength)[0] + " out of the kindness of her heart");
                }
                lesserDalmuti.splice(ldLength - 2, 1);

            } else {
                lesserPeon.push(lesserDalmuti.slice(ldLength - 3, ldLength)[0]);
                if (userRank === numPlayers - 2) {
                    view.lastMoveUpdate("<b>The Lesser Dalmuti</b> gave you a " + lesserDalmuti.slice(ldLength - 3, ldLength)[0] + " out of the kindness of her heart");
                }
                lesserDalmuti.splice(ldLength - 3, 1);
            }
        } else {
            lesserPeon.push(userTaxes[0]);
            cardsDeck.updatePlayerDeck(userTaxes);
        }
    }
};