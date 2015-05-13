/**
 * Created by LadyLiu on 4/30/15.
 */
/*Great Dalmuti
Setup:
Cards numbered 1-12
Deck contains one 1, two 2s, three 3s, and so on up to twelve 12s.
There are 2 jokers (13).  They are valued at 13 if used individually or wild if used with any other card value.
Shuffle deck.
Deal cards.  Higher ranked players will have more cards if there's an uneven amount.

Currently implemented:
Game setup per above
Gameplay (turntaking, etc.  may implement AI no longer playing once out of cards.)
View
Simple AI - always plays the next highest down card (even when saving it may be more advantageous)
userRank based on previous play victory
Cards
Player turn indicator.
Delayed card plays on feed to simulate actual turn taking
Gameover
Card counting array for AI (unused)
Player trying to pass or play cards while it's the AI's turn will cause them to receive an error message that it's not their turn (prevents multiple passes unintentionally due to impatience).

Not yet implemented:
AI card counting
Taxes (no taxes first playthrough)
AI no longer playing once out of cards & announcing AI rank.
Wild functionality not yet added (though code to add to deck present)
Revolution (no taxes if anyone but the greater peon has 2 wilds)
Greater revolution (Everyone swaps ranks - greater peon = great dalmuti, lesser peon = lesser dalmuti)
Select userDeck randomly if first game
UI changes for desktop version so you can pretend the robots playing are people too even though currently the robot is one block of code.
Make prettier.

Need to refactor.
*/

model = {
    highestCard: 12,
    players: 4,
    playerDecks: [],
    userRank: 0, //Rank in game for human player.  Starts in 1st.
    playerTitles: ["The Great Dalmuti", "The Lesser Dalmuti", "The Lesser Peon", "The Greater Peon"],
    gameOver: false,
    currentInPlay: [], //currentInPlay[0] is # of cards and currentInPlay[1] is card value
    allCardsPlayed: [], //Array loaded based highestCard +1 (for wild) to store past played cards.  Allows AI card counting.
    passCount: 0, //Number of players that passed in a row
    rounds: 0, //number of plays in the game so far
    //Sets everything in the model based on the methods and properties
    gameSetUp: function() {
        var highestCard = this.highestCard;
        var players = this.players;
        var deck = this.createDeck(highestCard);
        //var deckSize = deck.length;

        deck = this.shuffle(deck);
        this.playerDecks = this.dealCards(deck, players);
        this.playerDecks = this.sortDecks(this.playerDecks, players);
        this.createAllCardsPlayed();

    },
    //Creates deck based on highestCard - lowest is always 1
    createDeck: function(highestCard) {
        var deck = [];
        for(var i = 1; i <= highestCard; i++ ) {
            for(var j = 1; j <= i; j++) {
                deck.push(i);
            }
        }
        deck.push(model.highestCard+1, model.highestCard+1); //add 2 jokers/wild cards/13s
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
    sortNumber: function(a , b) {
        return a - b; //sorts smallest to largest when used with .sort
    },
    sortDecks: function(playerDecks, players) {
        for(var j = 0; j < players; j++) {
            playerDecks[j].sort(this.sortNumber);
        }
        return playerDecks;
    },
    //Initializes with all empty based on highest card #.
    createAllCardsPlayed: function() {
        for(var i = model.highestCard + 1; i > 0; i--) {
            model.allCardsPlayed.unshift([0, i]);
        }
    },
    //Updates model after cards played in view or from AI
    updateCardsPlayed: function(numCards, cardVal) {
            model.currentInPlay = [numCards, cardVal];
            model.rounds += 1;
            model.passCount = 0;

        for(var i = 0; i < model.allCardsPlayed.length; i++) {
            var cardLocation = model.allCardsPlayed[i].indexOf(cardVal);
            if(cardLocation === 1) {
                model.allCardsPlayed[i][0] += numCards;
                break;
            }
        }
    },
    checkPasses: function() {
        model.passCount += 1;
        model.rounds += 1;

        if(model.passCount === model.players-1) {
            model.currentInPlay[0] = undefined;
            model.currentInPlay[1] = undefined;
            model.passCount = 0;
            return true;
        } else {
            return false;
        }
    },

    //Send model.rounds -1 for current player - send model.rounds for next player. (rounds start at 1, arrays index starts at 0.)
    getPlayerTitle: function(rounds) {
        return model.playerTitles[model.getPlayerNum(rounds)];
    },
    getPlayerNum: function(rounds) {
        return (rounds) % model.players;
    },
    checkGameOver: function(deck) {
        if(deck.length === 0) {
            model.gameOver = true;
            var newRank = 0;
            for(var i = 0; i < model.players; i++) {
                if(i != model.userRank && model.playerDecks[i].length === 0) {
                    newRank += 1;
                }
            }
            if(model.userRank > newRank) {
                view.messageUpdate("Game Over!  You've moved up in the world!  You were the " + model.getPlayerTitle(model.userRank) + ", and you are now the " + model.getPlayerTitle(newRank) + "!");
            } else if (model.userRank === newRank) {
                view.messageUpdate("Game Over!  Maintaining the status quo!  You were the " + model.getPlayerTitle(model.userRank) + ", and you still are!");
            } else {
                view.messageUpdate("Game Over!  You have fallen from your former glory!  You were the " + model.getPlayerTitle(model.userRank) + ", and you are now the " + model.getPlayerTitle(newRank) + ".");
            }

            view.lastMoveUpdate("<b>A new round will start in 10 seconds!</b>");
            model.loadNewGame(newRank);
        }
    },
    loadNewGame: function(newUserRank) {
        setTimeout(function() {
            model.playerDecks = [];
            model.currentInPlay =  [];
            allCardsPlayed = [];
            model.passCount = 0;
            model.userRank = newUserRank;
            model.rounds = 0;
            view.moveHistoryText = [];
            init();
            view.messageUpdate("");
            view.lastMoveUpdate("Let's start another round, <b>" + model.getPlayerTitle(newUserRank) + "</b>!");
            model.gameOver = false;
            if(model.userRank != 0) {
                AI.takeTurn();
            }
        }, 10000);
    }
};

view = {
    moveHistoryText: [], //Array to store move history in text for view
    generateGameView: function(userDeck) {
        var row = null;
        var view = document.getElementById("view");
        for (var i = 0; i < userDeck.length; i++) {
            //Generates cards with card listed inside - width based on screen size
            var firstInnerHTML = '<div class="';
            var secondInnerHTML = ' carddiv" id="' + i + '">' + '<img class="userCard no-highlight" src="images/cards/card' + userDeck[i] + '.jpg">' + '</div>';
            if(window.innerWidth >= 992) {
                view.innerHTML += firstInnerHTML + 'col-md-1' + secondInnerHTML;
            } else if(window.innerWidth < 992 && window.innerWidth >= 500) {
                view.innerHTML += firstInnerHTML + 'col-xs-2' + secondInnerHTML;
            } else {
                view.innerHTML += firstInnerHTML + 'col-xs-3' + secondInnerHTML;
            }
        }
    },
    getCardValBySrc: function(cardSrc) {
        var cardVal = cardSrc.slice(cardSrc.search("cards/card") + 10, cardSrc.length - 4); //slices after cards/card and before .jpg
        cardVal = parseInt(cardVal);
        return cardVal;
    },
    checkCardSelect: function(event) {
        var card = event.target;
        var cardVal = view.getCardValBySrc(card.src);
        var wildVal = model.highestCard + 1;


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
    responsiveCheck: function() {
        if (window.innerWidth >= 992) {
            classChange("carddiv", "col-md-1 carddiv");
        } else if (window.innerWidth < 992 && window.innerWidth >= 500) {
            classChange("carddiv", "col-xs-2 carddiv");
        } else if (window.innerWidth < 500) {
            classChange("carddiv", "col-xs-3 carddiv");
        }
    },
    //Displays current cards in play and who played them
    playCards: function(numCards, cardVal) {
        model.updateCardsPlayed(numCards, cardVal);

        var player = model.getPlayerTitle(model.rounds-1);
        var message = "Move " + model.rounds + ": " + player + " played <b>" + numCards + "</b> of <b><i>#" + cardVal + "</i></b>";
        view.lastMoveUpdate(message);
    },

    userPlayCards: function() {
        if(model.getPlayerNum(model.rounds) != model.userRank) {
            view.messageUpdate("It's not your turn!");
        } else {

            var highlightOKCards = document.getElementsByClassName("highlight-ok");
            var highlightNoMatchCards = document.getElementsByClassName("highlight-no-match");
            var deck = model.playerDecks[model.userRank];
            if (highlightOKCards.length > 0 && highlightNoMatchCards.length < 1) {
                var numCards = highlightOKCards.length;

                //To get the value of the card from HTML elements selected
                var cardVal = highlightOKCards[0].src;
                cardVal = cardVal.slice(cardVal.search("cards/card") + 10, cardVal.length - 4); //slices after cards/card and before .jpg
                cardVal = parseInt(cardVal);

                //If selected is capable of being played, removes played cards from player's deck array, updates view info, clears errors, removes cards from view, then checks if it's game over
                if ((numCards === model.currentInPlay[0] && cardVal < model.currentInPlay[1]) || model.currentInPlay[1] === undefined) {
                    var startIndex = deck.indexOf(cardVal);
                    deck.splice(startIndex, numCards);

                    //Updates model to list current inPlay Cards & number
                    view.playCards(numCards, cardVal);

                    //Removes any previous error messages
                    view.messageUpdate("");

                    //removes containing div class so cards will relocate & card itself from player's view
                    $(".highlight-ok").parent().remove();
                    $(".highlight-ok").remove();

                    model.checkGameOver(deck);
                    controller.checkTurn();


                } else {
                    view.messageUpdate("You must play " + model.currentInPlay[0] + " card(s) of a value lower than " + model.currentInPlay[1]);
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
    lastMoveUpdate: function(newmessage) {
        if(view.moveHistoryText.length > 0)
            view.moveHistoryText[0] = "<br/>" + view.moveHistoryText[0];
        view.moveHistoryText.unshift(newmessage);
        var lastmove = document.getElementById("last-move");
        lastmove.innerHTML = view.moveHistoryText;
    },
    messageUpdate: function(newmessage) {
        var messagediv = document.getElementById("message");
        messagediv.innerHTML = newmessage;
    },
    pass: function() {
        var newLead = model.checkPasses();
        var player = model.getPlayerTitle(model.rounds-1);
        if(model.getPlayerNum(model.rounds-1) === model.userRank) {
            view.messageUpdate(""); //Clears messages
        }
        view.lastMoveUpdate("Move " + model.rounds + ": " + player + " has passed");

        if (newLead) {
            nextPlayer = model.getPlayerTitle(model.rounds);
            view.lastMoveUpdate("Everyone has passed.  <b>" + nextPlayer + "</b> takes the lead");
        }

        controller.checkTurn();
    }
};

controller = {
    cardClickEvent: function() {
        var cards = document.getElementsByClassName("userCard");
        for(var i = 0; i < cards.length; i++) {
            cards[i].addEventListener("click", view.checkCardSelect);
        }
    },
    buttonEvents: function() {
        document.getElementById("deselect-all").onclick = function() {
            classChange("userCard", "userCard no-highlight");
        };

        document.getElementById("play-cards").onclick = view.userPlayCards;
        document.getElementById("pass").onclick = view.pass;
    },
    scrollPlayHistory: function() {
        $(document).ready(function() {
            $("#lastmove").scroll(function () {});
        });
    },

    checkTurn: function() {
        if(model.getPlayerNum(model.rounds) != model.userRank) {
            AI.takeTurn();

        } else {
            view.messageUpdate("It's your turn, <b>" + model.playerTitles[model.userRank] + "!</b>");
        }
    }
};

AI = {
    goAI: undefined,
    takeTurn: function() {
        if(!model.gameOver) {
            goAI = setTimeout(AI.checkAvailableCards, 1500);
        }

    },
    checkAvailableCards: function() {
        var currentPlayer = model.getPlayerNum(model.rounds);
        var deck = model.playerDecks[currentPlayer];
        var numCards = model.currentInPlay[0];
        var currentCardVal = model.currentInPlay[1];
        var newCardVal = undefined;

        //Checks if they are lead - if so, plays all their highest cards
        if(numCards === undefined) {
            newCardVal = deck[deck.length - 1];
            var startIndex = deck.indexOf(newCardVal);
            numCards = deck.slice(startIndex, deck.length).length;
            deck.splice(startIndex, numCards);
        //If not lead, checks to play cards the next lower than the current
        } else {
            for(var i = currentCardVal-1; i >= numCards; i--) {
                var startIndex = deck.indexOf(i);
                var endIndex = deck.lastIndexOf(i) + 1;
                if (deck.slice(startIndex, endIndex).length >= numCards) {
                    //console.log(model.getPlayerTitle(currentPlayer)+ " Here's what I'll play! " + deck.slice(startIndex, startIndex + numCards));
                    deck.splice(startIndex, numCards);
                    newCardVal = i;
                    break;
                }
            }
        }
        if(!newCardVal) {
            view.pass();
        } else {
            view.playCards(numCards, newCardVal);
            controller.checkTurn();
        }
    }
};

window.onload = init();

function init() {
    model.gameSetUp();
    view.generateGameView(model.playerDecks[model.userRank]);
    controller.cardClickEvent();
    window.onresize = view.responsiveCheck;
    controller.buttonEvents();
    controller.scrollPlayHistory();
}

function classChange(oldClass, newClass) { //Changes class name when given old class and new class
    var changingObj = document.getElementsByClassName(oldClass);
    for (i = 0; i < changingObj.length; i++) {
        changingObj[i].setAttribute("class", newClass);
    }
}
