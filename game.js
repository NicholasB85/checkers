/** The Game object represents an instance of the checkers game. */
function Game(squares,) {
	this.squares = squares;
	this.isP1Turn = true;
	this.selected = null;

	/** Gets the checkers square based on the x, y coordinates. Returns null if invalid. */
	this.get = function(x, y) {
		
		// Special cases
		if (x%2 == y%2) {return null;}
		if (x < 0 || x > 7 || y < 0 || y > 7) {return null;}
		
		// Convert to square
		let index = y*4 + Math.floor(x/2);
		return index >= 0 && index < squares.length? this.squares[index] : null;
	}

	/** Gets the 4 (diagonal) adjacent squares to the current one. If a square
	* is out of bounds, the value of that square in the array returned is null. */
	this.getAdjacent = function(square) {
		if (!square) {return [];}
		let x = square.x, y = square.y;
		return [this.get(x-1,y-1), this.get(x+1,y-1), this.get(x-1,y+1), this.get(x+1,y+1)];
	}

	/** Validates a move. */
	this.isValid = function(start, end, ignoreTurn) {
		if (!start || !end || start.isEmpty() || !end.isEmpty()) {return false;}
		let dist = start.dist(end);
		
		// Check if valid move for checker
		let isKing = start.isKing();
		let isWhiteChecker = start.isWhiteChecker();
		if (!ignoreTurn && (isWhiteChecker ^ !game.isP1Turn)) { // not that player's turn
			return false;
		}
		if (!isKing) {
			if (isWhiteChecker && dist.dy > 0) {
				return false;
			} else if (!isWhiteChecker && dist.dy < 0) {
				return false;
			}
		}
		
		// Check distance
		let isSkip = Math.abs(dist.dx) == 2;
		if (Math.abs(dist.dx) != Math.abs(dist.dy) || Math.abs(dist.dx) > 2 || Math.abs(dist.dx) == 0) {
			return false;
		}
		let middle = isSkip? game.get(start.x + dist.dx/2, start.y + dist.dy/2) : null;
		if (middle && !middle.isEnemy(start)) {
			return false;
		}
		
		// Check if skip available
		let skipsAvail = false;
		let checkers = game.isP1Turn? game.getBlackCheckers() : game.getWhiteCheckers();
		for (let i=0; i<checkers.length; i++) {
			if (checkers[i].getSkips(game).length > 0) {
				skipsAvail = true;
				break;
			}
		}
		if (skipsAvail && start.getSkips(game).length == 0) {
			return false; // a skip is available, but not with this checker
		} else if (skipsAvail && !isSkip) {
			return false; // a skip is available, but the move is not a skip
		}
		
		return true;
	}

	/** Determines if the game is over. */
	this.isGameOver = function() {
		
		// No checkers
		if (!squares || squares.length == 0) {return true;}
		let b = this.getBlackCheckers(), w = this.getWhiteCheckers();
		if (b.length == 0 || w.length == 0) {return true;}
		
		// Check if the current player can move
		let checkers = this.isP1Turn? b : w;
		let move = false;
		for (var i=0; i<checkers.length; i++) {
			if (checkers[i].getMoves(true, this).length > 0) {
				move = true;
				break;
			}
		}
		
		return !move;
	}

	/** Gets all the current squares with black checkers. */
	this.getBlackCheckers = function() {
		let checkers = [];
		for (let i=0; i<squares.length; i++) {
			if (squares[i].isBlackChecker()) {checkers.push(squares[i]);}
		}
		return checkers;
	}

	/** Gets all the current squares with white checkers. */
	this.getWhiteCheckers = function() {
		let checkers = [];
		for (let i=0; i<squares.length; i++) {
			if (squares[i].isWhiteChecker()) {checkers.push(squares[i]);}
		}
		return checkers;
	}

}
