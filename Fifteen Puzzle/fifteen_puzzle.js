/*
 Users move squares that are
right/left/up/bottom an empty square and solve the fifteen puzzle
game. They can shuffle the squares to get a new game. */

"use strict";
(function() {
	// these two global variables represent
	// the position of the initial empty puzzle piece.
	let EMPTY_X_COORDINATE = 300;
	let EMPTY_Y_COORDINATE = 300; 
	
	// creates the puzzle piece board,
	// and adds the behavior for users to
	// be able to shuffle the squares when the shuffle
	// button is clicked.
	window.onload  = function() {
		createBoard(); 
		$("shuffle-button").onclick = shuffle;
		let citation = document.createElement("p");
		let citationText = document.createTextNode("Image by " +  
			"https://www.dutchgrown.com/products/tulip-phillie-pastel-mix");
		$("copyright-info").appendChild(citation).
			appendChild(citationText);
	};

	// this method takes an id returns the 
	// document.getElementById of the id.
	function $(id) {
 	 return document.getElementById(id);
	}

	// this function creates the puzzle piece board that is 
	// displayed on the screen 
	function createBoard() {
		for(let i = 0; i < 15; i++) { // 15 squares needs to be created
			let puzzlePiece = document.createElement("div");
			let pieceNumber = document.createTextNode(i + 1);
			puzzlePiece.className = "pieces";
		    puzzlePiece.style.backgroundImage = "url(background.JPG)";
			puzzlePiece.style.top = 
				(i - (Math.floor(i / 4) * 4)) * 100 + "px"; 
				// 4 is length& width of board
			puzzlePiece.style.left = 
				(Math.floor(i / 4) * 100) + "px"; 
				// 100 is size of each puzzle piece
			let position = (-puzzlePiece.style.top) + 
				(-puzzlePiece.style.left); 
			puzzlePiece.style.backgroundPosition = position;
			$("puzzle-area").appendChild(puzzlePiece).
				appendChild(pieceNumber);
			puzzlePiece.onclick = function() {
				movePuzzlePiece(puzzlePiece);
			};
			puzzlePiece.onmouseover = highlightMouseHover; 
			puzzlePiece.onmouseout = backToBlack; 
			$("shuffle-button").onclick = shuffle;
		}
    }
	
	// moves the clicked puzzle piece to the empty square.
	// takes the clicked puzzle piece as the parameter.
	function movePuzzlePiece(puzzlePiece) {
		if(isMovable(puzzlePiece)) {
			let x = puzzlePiece.style.left;
			let y = puzzlePiece.style.top;
			puzzlePiece.style.left = EMPTY_X_COORDINATE  + "px";
			puzzlePiece.style.top = EMPTY_Y_COORDINATE + "px";
			EMPTY_X_COORDINATE = parseInt(x);
			EMPTY_Y_COORDINATE = parseInt(y);
	    }
	}
	
	// Checks whether the puzzle piece is movable: is directly
	// above, below, at the left of or the right of the empty square.
	// returns a boolean value for whether the piece is movable
	function isMovable(puzzlePiece) {
		let x = parseInt(puzzlePiece.style.left);
		let y = parseInt(puzzlePiece.style.top);
		let leftPieceCoordinate = x - 100; 
		let rightPieceCoordinate = x + 100; 
		let topPieceCoordinate = y + 100; 
		let bottomPieceCoordinate = y - 100;
		// case 1: puzzle piece is either directly next to  
		// (on left or right) of an empty square.
		let case1 = (EMPTY_X_COORDINATE === leftPieceCoordinate ||
	   	    EMPTY_X_COORDINATE === rightPieceCoordinate)  
			&& EMPTY_Y_COORDINATE === y;
		// case 2: puzzle piece is either directly above or
		// below an empty square
		let case2 = (EMPTY_Y_COORDINATE === topPieceCoordinate || 
	        EMPTY_Y_COORDINATE === bottomPieceCoordinate) 
		    && EMPTY_X_COORDINATE === x;
		return (case1 || case2);
	}


	// if the square is movable, highlights the square: 
	// makes the border red, the text white, and changes
	// the cursor to a hand.
	function highlightMouseHover() {
		if(isMovable(this)) {
			this.classList.add("highlight");
		}
	}
	
	// when the mouse stops hovering over
	// a movable square, the highlighting of
	// the square stops.
	function backToBlack() {
		this.classList.remove("highlight");
	}

	//this function shuffles the puzzle pieces
	// when the shuffle button is clicked.
	function shuffle() { 
		for(let i = 0; i < 1000; i++) {
			let neighbors = [];
			let puzzlePieces = document.querySelectorAll(".pieces");
			for(let j = 0; j < puzzlePieces.length; j++) {
				let currentPuzzlePiece = puzzlePieces[j];
				if(currentPuzzlePiece !== null && 
					isMovable(currentPuzzlePiece)) {
					neighbors.push(currentPuzzlePiece);
				}
			}
			let randomPiece = 
				neighbors[Math.floor(Math.random()*neighbors.length)];
			movePuzzlePiece(randomPiece);
		}
	}
})();

