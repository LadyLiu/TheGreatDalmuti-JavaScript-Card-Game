//Views - includes methods for most of UI.
//Taxes-based UI methods included in taxes object except those shared with view normally which are located in Views
view = {
    moveHistoryText: [], //Array to store move history in text for view

    //Generates view based on screen size & images loaded for card number based on userDeck array.
    generateGameView: function(userDeck) {
        var view = document.getElementById("view");
        for (var i = 0; i < userDeck.length; i++) {
            //Generates cards with card listed inside - width based on screen size
            var firstInnerHTML = '<div class="';
            var secondInnerHTML = ' carddiv" id="' + i + '">' + '<img class="userCard no-highlight" src="images/cards/card' + userDeck[i] + '.jpg">' + '</div>';
            if(window.innerWidth >= 850) {
                view.innerHTML += firstInnerHTML + 'col-xs-1' + secondInnerHTML;
            } else if(window.innerWidth < 850 && window.innerWidth >= 450) {
                view.innerHTML += firstInnerHTML + 'col-xs-2' + secondInnerHTML;
            } else {
                view.innerHTML += firstInnerHTML + 'col-xs-3' + secondInnerHTML;
            }
        }
    },
    //Removes current view entirely.  Currently used for updating view after paying taxes.
    eraseCurrentView: function() {
        for(var i = 0; i < cardsDeck.playerDecks[players.userRank].length; i++) {
            $("#" + i).remove();
        }
    },
    //When given src of image, you get the value of the card.
    getCardValBySrc: function(cardSrc) {
        var cardVal = cardSrc.slice(cardSrc.search("cards/card") + 10, cardSrc.length - 4); //slices after cards/card and before .jpg
        cardVal = parseInt(cardVal);
        return cardVal;
    },
    //Checks if clicked card matches requirement to highlight (wild cards always ok, equal to other highlighted cards values)
    checkCardSelect: function(event) {
        var card = event.target;
        var cardVal = view.getCardValBySrc(card.src);
        var wildVal = cardsDeck.highestCard + 1;


        if(card.className.indexOf("no-highlight") > -1) {
            var highlightOKCards = document.getElementsByClassName("highlight-ok");
            if (highlightOKCards.length > 0) {
                var highlightOKVal = view.getCardValBySrc(highlightOKCards[0].src);
                //Highlights if either card val is wild or if they're equal
                if (highlightOKVal === cardVal || cardVal === wildVal || highlightOKVal === wildVal) {
                    view.highlightOK(card);
                    //If not, highlights red to indicate they aren't a match
                } else {
                    view.highlightNoMatch(card);
                    view.messageUpdate("The card you selected does not have the same value as the others.");
                }
                //Highlights if there are no other highlighted cards
            } else {
                view.highlightOK(card);
            }
            //Deselect card.
        } else {
            view.noHighlight(card);
        }
    },
    //Adjusts # of cards displayed per row based on window width
    responsiveCheck: function() {
        if (window.innerWidth >= 850) {
            helper.classChange("carddiv", "col-xs-1 carddiv");
        } else if (window.innerWidth < 850 && window.innerWidth >= 450) {
            helper.classChange("carddiv", "col-xs-2 carddiv");
        } else if (window.innerWidth < 450) {
            helper.classChange("carddiv", "col-xs-3 carddiv");
        }
    },
    //Displays current cards in play and who played them
    playCards: function(numCards, cardVal, playArray) {
        var wildVal = cardsDeck.highestCard + 1;
        cardsDeck.updateCardsPlayed(numCards, cardVal, playArray);

        var player = players.getPlayerTitle(gameCycle.rounds-1);
        var rounds = gameCycle.rounds;

        //Reports # of wilds played.
        if(playArray.length > 2 && playArray.indexOf(wildVal) === playArray.length-2) {
            var message = "Move " + rounds + ": " + player + " played <b>" + numCards + "</b> of <b><i>#" + cardVal + "</i></b>. 2 were wild cards" ;
        } else if(playArray.length > 1 && playArray.indexOf(wildVal) === playArray.length-1){
            var message = "Move " + rounds + ": " + player + " played <b>" + numCards + "</b> of <b><i>#" + cardVal + "</i></b>. 1 was a wild card" ;
        } else {
            var message = "Move " + rounds + ": " + player + " played <b>" + numCards + "</b> of <b><i>#" + cardVal + "</i></b>";
        }
        view.lastMoveUpdate(message);
    },
    //updates view and calls methods to update model objects for cards.
    userPlayCards: function() {
        if(players.getPlayerNum(gameCycle.rounds) != players.userRank) {
            view.messageUpdate("It's not your turn!");
        } else {

            var highlightOKCards = document.getElementsByClassName("highlight-ok");
            var highlightNoMatchCards = document.getElementsByClassName("highlight-no-match");
            var deck = cardsDeck.playerDecks[players.userRank];
            if (highlightOKCards.length > 0 && highlightNoMatchCards.length < 1) {
                var numCards = highlightOKCards.length;

                //To get the value of the card from HTML elements selected
                var cardValArr = [];
                for(i = 0; i < highlightOKCards.length; i++) {
                    cardValArr.push(view.getCardValBySrc(highlightOKCards[i].src));
                }

                //If selected is capable of being played, removes played cards from player's deck array, updates view info, clears errors, removes cards from view, then checks if it's game over
                if ((numCards === cardsDeck.currentInPlay[0] && cardValArr[0] < cardsDeck.currentInPlay[1]) || cardsDeck.currentInPlay[1] === undefined) {


                    cardsDeck.updatePlayerDeck(cardValArr);

                    //Updates model to list current inPlay Cards & number
                    view.playCards(numCards, cardValArr[0], cardValArr);

                    //Removes any previous error messages
                    view.messageUpdate("");

                    //removes containing div class so cards will relocate & card itself from player's view
                    $(".highlight-ok").parent().remove();
                    $(".highlight-ok").remove();


                    gameCycle.checkGameOver(deck);
                    controller.checkTurn();
                } else {
                    view.messageUpdate("You must play " + cardsDeck.currentInPlay[0] + " card(s) of a value lower than " + cardsDeck.currentInPlay[1]);
                }

                //Error messages if didn't meet criteria to play cards
            } else if (highlightNoMatchCards.length > 0) {
                view.messageUpdate("The cards you play must all have the same value. Please check any cards with a red border.");
            } else if (highlightOKCards.length <= 0) {
                view.messageUpdate("There are no selected cards.");
            }
        }

    },
    highlightOK: function(card) {
        card.setAttribute("class", "userCard highlight-ok");
    },
    highlightNoMatch: function(card) {
        card.setAttribute("class", "userCard highlight-no-match")
    },
    noHighlight: function(card) {
        card.setAttribute("class", "userCard no-highlight");
    },
    //Updates lastMove in Matrix when given string/value for message.  All values kept until end of game when cleared.
    lastMoveUpdate: function(newmessage) {
        if(view.moveHistoryText.length > 0)
            view.moveHistoryText[0] = "<br/>" + view.moveHistoryText[0];
        view.moveHistoryText.unshift(newmessage);
        var lastmove = document.getElementById("last-move");
        lastmove.innerHTML = view.moveHistoryText;
    },
    //Updates messages portion of UI.  Overwritten each time a new message is sent.
    messageUpdate: function(newmessage) {
        var messagediv = document.getElementById("message");
        messagediv.innerHTML = newmessage;
    },
    //Players pass, if all passed then last player to play a card takes the lead.
    pass: function() {
        var newLead = gameCycle.checkPasses();
        var player = players.getPlayerTitle(gameCycle.rounds-1);
        if(players.getPlayerNum(gameCycle.rounds-1) === players.userRank) {
            view.messageUpdate(""); //Clears messages
        }
        view.lastMoveUpdate("Move " + gameCycle.rounds + ": " + player + " has passed");

        if (newLead) {
            var nextPlayer = players.getPlayerTitle(gameCycle.rounds);
            view.lastMoveUpdate("Everyone has passed.  <b>" + nextPlayer + "</b> takes the lead");
        }

        controller.checkTurn();
    },
    //Reports ranks, sets ranks for next game, tells player growth or regression.
    gameOverMessage: function(newRank) {
        var oldTitle = players.getPlayerTitle(players.userRank);
        var newTitle = players.getPlayerTitle(newRank);
        if(players.userRank > newRank) {
            view.messageUpdate("Game Over!  You've moved up in the world!  You were the " + oldTitle + ", and you are now the " + newTitle + "!");
        } else if (players.userRank === newRank) {
            view.messageUpdate("Game Over!  Maintaining the status quo!  You were the " + oldTitle + ", and you still are!");
        } else {
            view.messageUpdate("Game Over!  You have fallen from your former glory!  You were the " + oldTitle + ", and you are now the " + newTitle + ".");
        }

        view.lastMoveUpdate("<b>A new round will start in 10 seconds!</b>");
    }
};