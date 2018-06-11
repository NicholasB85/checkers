/** The Square object represents a black tile that can contain a checker or be empty. */
function Square(x, y, id) {
	this.x = x; this.y = y;

	/** Checks if this square contains no checker. */
	this.isEmpty = function() {return this.id.id == ID_EMPTY.id;}

	/** Checks if this square contains a king. */
	this.isKing = function() {
		return this.id.id == ID_BLACK_KING.id || this.id.id == ID_WHITE_KING.id;
	}

	/** Checks if this square contains a black checker. */
	this.isBlackChecker = function() {
		return this.id.id == ID_BLACK.id || this.id.id == ID_BLACK_KING.id;
	}

	/** Checks if this square contains a white checker. */
	this.isWhiteChecker = function() {
		return this.id.id == ID_WHITE.id || this.id.id == ID_WHITE_KING.id;
	}

	/** Gets the distance between a test square and this one. */
	this.dist = function(endSquare) {
		if (!endSquare) {return {"dx": null, "dy": null};}
		var dx = endSquare.x - x, dy = endSquare.y - y;
		return {"dx": dx, "dy": dy};
	}

	/** Checks if another square is an enemy checker. */
	this.isEnemy = function(test) {
		if (this.isEmpty() || test.isEmpty()) {return false;}
		if (this.isBlackChecker()) {return test.isWhiteChecker();}
		return test.isBlackChecker();
	}

	/** Sets the selected state of this square. If the square has at least one move,
	* the selected colour is green. Otherwise, it will be red. */
	this.setSelected = function(selected) {
		var obj = document.getElementById('p'+x+''+y);
		if (selected) {
			var skipsAvail = false, right = !this.isEmpty() && (game.isP1Turn ^ this.isWhiteChecker());
			right = right && this.getMoves(false, game).length > 0;
			if (right) {
				var checkers = game.isP1Turn? game.getBlackCheckers() : game.getWhiteCheckers();
				for (var i=0; i<checkers.length; i++) {
					if (checkers[i].getSkips(game).length > 0) {
						skipsAvail = true;
						break;
					}
				}
				if (skipsAvail && this.getSkips(game).length == 0) {
					right = false;
				}
			}
			obj.style.backgroundColor = right? '#00FF00' : 'orange';
		} else {
			obj.style.backgroundColor = 'black';
		}
	}

	/** Sets the ID of this square and updates the HTML being displayed. */
	this.setID = function(id) {
		this.id = id;
		var obj = document.getElementById('p'+x+''+y);
		obj.innerHTML = id.html;
	}
	this.setID(id);

	/** Gets the available moves, including possible skips. If a skip is available,
	* no regular moves are checked as the skip would have to be taken. Returns an
	* array with the final location of each move, or an empty array if no moves exist. */
	this.getMoves = function(ignoreTurn, board) {
		if (this.isEmpty()) {return [];}
		var moves = [];
		var possibleMoves = [board.get(x-2,y-2),board.get(x+2,y-2),board.get(x-2,y+2),board.get(x+2,y+2),
		board.get(x-1,y-1),board.get(x+1,y-1),board.get(x-1,y+1),board.get(x+1,y+1)];
		for (var i=0; i<possibleMoves.length; i++) {
			var m = possibleMoves[i];
			if (!m) {continue;}
			if (board.isValid(this,m,ignoreTurn)) {
				moves.push(m);
			}
			if (i == possibleMoves.length/2 && moves.length > 0) {
				break; // a skip is available, so it must be taken
			}
		}
		
		return moves;
	}

	/** Gets the skips available to the checker in this square. If no skips are
	* available, then an empty array is returned. Returns an array with the final
	* location of each skip. */
	this.getSkips = function(board) {
		if (this.isEmpty()) {return [];}
		let skips = [], white = this.isWhiteChecker(), king = this.isKing();
		let possibleMoves = [board.get(x-2,y-2),board.get(x+2,y-2),board.get(x-2,y+2),board.get(x+2,y+2)]
		for (let i=0; i<possibleMoves.length; i++) {
			let m = possibleMoves[i];
			if (!m || !m.isEmpty()) {continue;}
			let dist = this.dist(m);
			let enemy = this.isEnemy(board.get(this.x + dist.dx/2, this.y + dist.dy/2));
			if (king) {
				if (enemy) {skips.push(m);}
			} else {
				if (white) {
					if (enemy && dist.dy < 0) {skips.push(m);}
				} else {
					if (enemy && dist.dy > 0) {skips.push(m);}
				}
			}
		}
		return skips;
	}

}