//Tax system!  Used after first game.
taxes = {
    //GreaterPeon gives greatDalmuti best 2 cards, lesserPeon gives lesserDalmuti best card, greatDalmuti gives any 2 cards, lesserDalmuti gives any 1 card
    //Dalmutis do not see received taxes before selecting cards they give.
    //Need to add player decision making if they're greatDalmuti or lesserDalmuti
    taxes: function() {
        $("#play-cards").hide();
        $("#taxes").show();

        view.lastMoveUpdate("TAX SEASON!  Everyone loves this part of the game, <b>"+ players.getPlayerTitle(players.userRank) + "</b>!");
         if(players.userRank === 0) {
             view.messageUpdate("Please select any 2 cards to give to the Greater Peon.  They will be giving you their best 2 cards.");
         } else if(players.userRank === 1) {
             view.messageUpdate("Please select any 1 card to give to the Lesser Peon.  They will be giving you their best card.");
         } else if(players.userRank === 2) {
             view.messageUpdate("Please select you lowest card to give to the Lesser Dalmuti.  They will give you any one card.")
         } else if(players.userRank === 3) {
             view.messageUpdate("Please select your lowest 2 cards to give to the Great Dalmuti.  They will give you any two cards.")
         }

         cardsDeck.sortDecks(cardsDeck.playerDecks, players.numPlayers);


     },

    //Checks selected cards.  Highlights if none highlighted, sends error if highlighting too many or if values don't match required for greater peon.
    taxesCheckSelect: function(cardEvent) {
        var card = cardEvent.target;
        var userRank = players.userRank;
        var highlightOKCards = document.getElementsByClassName("highlight-ok");

        view.messageUpdate("");
        if(card.className.indexOf("no-highlight") > -1) {
            if(userRank === 0 && highlightOKCards.length < 2) {
                view.highlightOK(card);
            } else if(userRank === 0 && highlightOKCards.length >= 2) {
                view.messageUpdate("You can only pass 2 cards, <b>" + players.getPlayerTitle(userRank) + "</b>");
            } else if (userRank === 1 && highlightOKCards.length < 1) {
                view.highlightOK(card);
            } else if (userRank === 1 && highlightOKCards.length >= 1) {
                view.messageUpdate("You can only pass 1 card, <b>" + players.getPlayerTitle(userRank) + "</b>");
            } else if(userRank === 2) {
                if(view.getCardValBySrc(card.src) === cardsDeck.playerDecks[userRank][0] && highlightOKCards.length < 1) {
                    view.highlightOK(card);
                } else {
                    view.highlightNoMatch(card);
                    view.messageUpdate("You must pay only your lowest card in taxes.");
                }
            } else {
                if(view.getCardValBySrc(card.src) === cardsDeck.playerDecks[userRank][0] || view.getCardValBySrc(card.src) === cardsDeck.playerDecks[userRank][1] && highlightOKCards.length < 2) {
                    if(highlightOKCards.length > 0 && view.getCardValBySrc(highlightOKCards[0].src) != cardsDeck.playerDecks[userRank][0] && view.getCardValBySrc(card.src) != cardsDeck.playerDecks[userRank][0]) {
                        view.highlightNoMatch(card);
                        view.messageUpdate("You must pay only your lowest 2 cards in taxes.");
                    } else {
                        view.highlightOK(card);
                    }
                } else {
                    view.highlightNoMatch(card);
                    view.messageUpdate("You must pay only your lowest 2 cards in taxes.");
                }
            }
            //Deselects card if card is highlighted
        } else {
            view.noHighlight(card);
        }
        //Disabled taxes button if submit value isn't valid.
        $("#taxes").prop("disabled", !taxes.canSubmitTaxes());

    },
    //Checks if requirements met to submit taxes.  Returns true if it can be submitted (then enables button), or false if not (disables taxes button).
    canSubmitTaxes: function() {
        var highlightOKCards = document.getElementsByClassName("highlight-ok");
        var highlightNoMatchCards = document.getElementsByClassName("highlight-no-match");
        var userRank = players.userRank;

        if(userRank >= 2) { //increased by 1 to do abs value to determine # of cards they should play
            userRank += 1;
        }

        /*if(highlightOKCards.length != Math.abs(2-userRank) && view.message=="") {
            view.messageUpdate("You have not selected enough cards for taxes.  Please select " + Math.abs(2-userRank) + " cards.");
        }*/

        if(highlightOKCards.length === Math.abs(2-userRank) && highlightNoMatchCards.length === 0) {
            return true;
        } else {
            return false;
        }

    },

    taxesViewButton: function() {

        var userRank = players.userRank;
        var highlightOKCards = document.getElementsByClassName("highlight-ok");
        var giveTitles = players.playerTitles.slice(0); //Copies array by value instead of copying by reference
        giveTitles.reverse();

        var cardValArr = [];
        for(i = 0; i < highlightOKCards.length; i++) {
            cardValArr.push(view.getCardValBySrc(highlightOKCards[i].src));
        }

        if(userRank === 0 || userRank === 3) {
            view.lastMoveUpdate("You passed the cards " + cardValArr[0] + " and " + cardValArr[1] + " to <b>" + giveTitles[userRank] + "</b>");
        } else if(userRank === 1 || userRank === 2) {
            view.lastMoveUpdate("You passed the card " + cardValArr[0] + " to <b>" + giveTitles[userRank] + "</b>");
        }

        AI.payTaxes(cardValArr);

        cardsDeck.sortDecks(cardsDeck.playerDecks, players.numPlayers);


        view.eraseCurrentView();
        setTimeout(view.generateGameView(cardsDeck.playerDecks[players.userRank]), 5);
        controller.cardClickEvent(view.checkCardSelect);
        controller.buttonEvents();

        controller.checkTurn();


        $("#taxes").hide();
        $("#play-cards").show();


    }
};
/*
 */