#The Great Dalmuti
###Setup:
+ Cards numbered 1-12
+ Deck contains one 1, two 2s, three 3s, and so on up to twelve 12s.
+ There are 2 jokers (13).  They are valued at 13 if used individually or
wild if used with any other card value.
+ Shuffle deck.
+ Deal cards.  Higher ranked players will have more cards if there's an
uneven amount.

###Currently implemented:
+ Game setup per above
+ Gameplay
+ Wild Cards
+ Taxes after first round
+ View
+ Simple AI - always plays the next highest down card (even when saving
it may be more advantageous)
+ userRank random for first game
+ userRank based on previous play victory
+ Cards
+ Player turn indicator.
+ Delayed card plays on feed to simulate actual turn taking
+ Gameover
+ Card counting array for AI (unused)
+ Player trying to play cards while it's the AI's turn will cause them to receive an error message that it's not their turn (prevents multiple passes unintentionally due to impatience).

###Not yet implemented:
+ AI card counting
+ AI using Wild Cards
+ AI no longer playing once out of cards & announcing AI rank.
+ Revolution (no taxes if anyone but the greater peon has 2 wilds)
+ Greater revolution (Everyone swaps ranks - greater peon = great
dalmuti, lesser peon = lesser dalmuti)
+ UI changes for desktop version so you can pretend the robots playing
are people too even though currently the robot is one block of code.
+ Make prettier.

###Possible depending on attention span:
+ Multiplayer

###Dependencies:
+ jQuery 2-1-4
+ Twitter Bootstrap (w/ JS & CSS)
