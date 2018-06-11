// IDs for checkers
const ID_EMPTY = {"id": 0, "html": ""};
const ID_BLACK = {"id": 1, "html": "<div class=\"c b\"/>"};
const ID_BLACK_KING = {"id": 2, "html": "<div class=\"c redKing\"/>"};
const ID_WHITE = {"id": 3, "html": "<div class=\"c w\"/>"};
const ID_WHITE_KING = {"id": 4, "html": "<div class=\"c whiteKing\"/>"};

// Setup the game
let over = false;
const htmlBoard = document.getElementById('board');
const htmlOptions = document.getElementById('options');
const game = load(htmlBoard,htmlOptions);
let timeOut = null, timeOut2 = null;

/** Loads a new game instance. This causes the HTML and game to be reset to the original state. */
function load(board, options) {
    if (!board || !board.innerHTML || !options || !options.innerHTML) {return new Game([],false,false);}
	over = false;
	
	// Create the board
	board.innerHTML = '';
	let squares = [], n = 0;
	for (let y=0; y<8; y++) {
		for (let x=0; x<8; x++) {
			if (x%2==y%2) {continue;}
			let style = 'left: '+(x*12.5)+'%; top: '+(y*12.5)+'%;';
			let id = 'p'+x+''+y;
			board.innerHTML += '<div class="cell" style="'+style+'" id="'+id+'" onclick="clickEvent('+n+');"/>';
			let checker = ID_EMPTY;
			if (y < 3) {checker = ID_BLACK;}
			else if (y > 4) {checker = ID_WHITE;}
			let square = new Square(x,y, checker);
			squares.push(square);
			n++;
		}
	}
	
	// Create the options
	let isP1AI = document.getElementById('p1ai'), isP2AI = document.getElementById('p2ai');
	resize(board);
	
	// Check if the AI is in power
	var board = new Game(squares,isP1AI,isP2AI);
	if (isP1AI) {
		var aiMove = getAIMove(true, board);
		timeOut2 = setTimeout(function(aiMove) {move(aiMove.start, aiMove.end, game);}, AI_DELAY, aiMove);
	}
	
	return board;
}

/** Resizes the display board based on the size of the screen. */
function resize(board) {
	let optH = htmlOptions.offsetHeight;;
	optH = 45 > optH? 45 : optH;
	let h = window.innerHeight - optH, w = window.innerWidth;
	let size = (h > w)? w - 10 : h - 10;
	board.setAttribute('style', 'width: '+size+'px; height: '+size+'px; max-width: 98%; max-height: 95%;');
}
