/** Determines if the game is over. */
this.isGameOver = function() {
		
    // No checkers
    if (!squares || squares.length == 0) {return true;}
    let b = this.getBlackCheckers(), w = this.getWhiteCheckers();
    if (b.length == 0 || w.length == 0) {return true;}
    
    // Check if the current player can move
    let checkers = this.isP1Turn? b : w;
    let move = false;
    for (let i=0; i<checkers.length; i++) {
        if (checkers[i].getMoves(true, this).length > 0) {
            move = true;
            break;
        }
    }
    
    return !move;
}
