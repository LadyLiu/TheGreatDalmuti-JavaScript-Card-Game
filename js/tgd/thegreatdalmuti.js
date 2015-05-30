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
Cards including Wilds
Player turn indicator.
Delayed card plays on feed to simulate actual turn taking
Gameover
Card counting array for AI (unused)
Player trying to pass or play cards while it's the AI's turn will cause them to receive an error message that it's not their turn (prevents multiple passes unintentionally due to impatience).
Taxes (no taxes first playthrough)
Random userDeck selection if first game

Not yet implemented:
AI no longer playing once out of cards & announcing AI rank.
Revolution (no taxes if anyone but the greater peon has 2 wilds)
Greater revolution (Everyone swaps ranks - greater peon = great dalmuti, lesser peon = lesser dalmuti)
UI changes for desktop && mobile version so you can pretend the robots playing are people too even though currently the robot is one block of code.
Above including number of cards remaining for each player.
Make prettier.  Ask friend to make pretty cards? D:
AI card counting

Need to refactor.
5/22/15: Did some refactoring to help self locate things in code.
        Added taxes!  The greastest of additions!
5/30/15: Fixed a bug in taxes.  Made version compatible with my homepage visually.

*/



