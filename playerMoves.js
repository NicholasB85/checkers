/** Responds to black tiles being clicked and responds accordingly. */
function clickEvent(index) {
	if (over) {return;}
	
	// Nothing selected
	if (!game.selected) {
		game.selected = game.squares[index];
		game.squares[index].setSelected(true);
		return;
	}
	
	// Invalid move
	if (!game.isValid(game.selected,game.squares[index],false)) {
		game.selected.setSelected(false);
		game.selected = game.squares[index];
		game.selected.setSelected(true);
		return;
	}
	
	// Valid move; update board
	move(game.selected,game.squares[index],game);
}

/** Makes a move on the game board. This is called after the move has been validated. */
function move(start, end, board) {
	if (!start || !end) {return false;}
	if (timeOut) {
		clearTimeout(timeOut);
		timeOut = null;
	}
	
	// Update IDs
	var endID = start.id;
	if (start.isBlackChecker() && end.y == 7) {
		endID = ID_BLACK_KING;
	} else if (start.isWhiteChecker() && end.y == 0) {
		endID = ID_WHITE_KING;
	}
	end.setID(endID);
	start.setID(ID_EMPTY);
	var dist = start.dist(end), isSkip = Math.abs(dist.dx) == 2, otherSkip = false;
	if (isSkip) {
		var middle = board.get(start.x + dist.dx/2, start.y + dist.dy/2);
		middle.setID(ID_EMPTY);
		otherSkip = end.getSkips(board).length > 0;
	}
	
	// Determine whether to switch turns right away
	var isAI = (board.isP1Turn && board.isP1AI) || (!board.isP1Turn && board.isP2AI);
	if (otherSkip) {
		start.setSelected(false);
		if (!isAI) {end.setSelected(true);}
		else {timeOut2 = setTimeout(function(aiMove) {move(aiMove.start, aiMove.end, board);}, AI_DELAY, getAISkip(end,board));}
		board.selected = end;
		timeOut = setTimeout(switchPlayer, 3000, start, end, board);
	} else {
		switchPlayer(start,end,board);
	}
	
	return true;
}

/** Switches the player so the other player can make a move. */
function switchPlayer(start, end, board) {

	// Update selected
	board.selected = null;
	start.setSelected(false);
	end.setSelected(false);
	
	// Update who's turn
	board.isP1Turn = !board.isP1Turn;
	htmlOptions.setAttribute('style','border-top: 5px solid '+(board.isP1Turn? 'black;':'white;'));
	var isAI = (board.isP1Turn && board.isP1AI) || (!board.isP1Turn && board.isP2AI);
	if (isAI) {
		var aiMove = getAIMove(board.isP1Turn, board);
		if (aiMove) {
			timeOut2 = setTimeout(function(aiMove) {move(aiMove.start, aiMove.end, board);}, AI_DELAY, aiMove);
		} else {gameover();}
	}
	
	// Check if game over
	if (board.isGameOver()) {
		gameover();
	}
}

/** Puts the game in 'gameover' mode, preventing the user from interacting
* with the board and placing GAME OVER text in the center of the board. */
function gameover() {
	htmlBoard.innerHTML += '<span style="position: absolute; left: 50%; top: 50%; color: red;'+
	'transform: translate(-50%,-50%); font-weight: bold; font-size: 2em; background: rgba(235,235,235,0.9);'+
	'border-radius: 7px; text-align: center; padding: 5px;">GAME OVER!!!</span>';
	over = true;
}




