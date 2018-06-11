/** Determines if the game is over. */
this.isGameOver = function() {
		
    // No checkers
    if (!squares || squares.length == 0) {return true;}
    var b = this.getBlackCheckers(), w = this.getWhiteCheckers();
    if (b.length == 0 || w.length == 0) {return true;}
    
    // Check if the current player can move
    var checkers = this.isP1Turn? b : w;
    var move = false;
    for (var i=0; i<checkers.length; i++) {
        if (checkers[i].getMoves(true, this).length > 0) {
            move = true;
            break;
        }
    }
    
    return !move;
}
