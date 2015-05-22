//Where to get your events for the UI!  Hooray, UI.
controller = {
    //Send event to initate when cards clicked.  Used by view object and taxes object.
    cardClickEvent: function(newEvent) {
        var cards = document.getElementsByClassName("userCard");
        for(var i = 0; i < cards.length; i++) {
            cards[i].addEventListener("click", newEvent);
        }
    },
    //Sets button onclick events
    buttonEvents: function() {
        document.getElementById("deselect-all").onclick = function() {
            helper.classChange("userCard", "userCard no-highlight");
        };

        document.getElementById("play-cards").onclick = view.userPlayCards;
        document.getElementById("pass").onclick = view.pass;
        document.getElementById("taxes").onclick = taxes.taxesViewButton;
    },
    //Allows play  history to be scrolled.
    scrollPlayHistory: function() {
        $(document).ready(function() {
            $("#lastmove").scroll(function () {});
        });
    },
    //Check whose turn it is - if it's not the player, they take a turn, if it's the user, they're informed
    checkTurn: function() {
        if(players.getPlayerNum(gameCycle.rounds) != players.userRank) {
            AI.takeTurn();

        } else {
            view.messageUpdate("It's your turn, <b>" + players.playerTitles[players.userRank] + "!</b>");
        }
    }
};