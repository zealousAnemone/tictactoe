$(document).ready(function() {
  //Stores moves taken by both players
  var playerOneMoves = [];
  var playerTwoMoves = [];
  var gameOver = false;
  //X or O depending on which you choose
  var playerPiece;
  var computerPiece;
  //Player 1 aka you start first
  var whoseTurn = "playerOne";
  //These are all the possible winning combinations
  var winningCombos = [['tl', 'tm', 'tr'], ['ml', 'mm', 'mr'], ['bl', 'bm', 'br'], ['tl', 'mm', 'br'], ['tr', 'mm', 'bl'], ['tl', 'ml', 'bl'], ['tm', 'mm', 'bm'], ['tr', 'mr', 'br']];
  
  //Show the piece picker first thing
  $("#XO").modal("show");
  //Sets X as player piece if you click x
  $("#x").click(function() {
    playerPiece = 'X';
    computerPiece = 'O';
  });
  //Same but with O
  $("#o").click(function() {
    playerPiece = 'O';
    computerPiece = 'X';
  });
  
  //Play again button on winning modal resets board
  $(".play-again").click(function() {
    reset();
  });
  
  //Reset button also resets board
  $("#reset").click(function() {
    reset();
  });
  
  //Puts everything back as it was!
  function reset() {
    gameOver = false;
    whoseTurn = 'playerOne';
    $('td').html("");
    playerOneMoves = [];
    playerTwoMoves = [];
    $("#XO").modal("show");
  }
  
  //Human turn
  $("td").click(function() {
    //Checks to make sure we're still playin and it's our turn
    if (!gameOver && whoseTurn == 'playerOne') {
      //Checks to make sure spot hasn't already been chosen by either player
    if ((playerOneMoves.indexOf($(this).attr("id")) == -1) && (playerTwoMoves.indexOf($(this).attr("id")) == -1)) {
      //Puts ID of space in playerMoves array
      playerOneMoves.push($(this).attr("id"));
      //Displays player's piece on board
      $(this).html("<h1>" + playerPiece + "</h1>");
      //Checks if you won
      checkWin();
      //If not, it's now player 2's turn, and call player 2 (computer's) function
      whoseTurn = "playerTwo";
      playerTwo();
    } 
    }
  });
 
function checkWin() {
  for (var i = 0; i < winningCombos.length; i++) {
    //Checks each set of winning spaces, if either player has all 3 of set, they win & game is over
    if (playerOneMoves.indexOf(winningCombos[i][0]) >= 0 && playerOneMoves.indexOf(winningCombos[i][1]) >= 0 && playerOneMoves.indexOf(winningCombos[i][2]) >= 0) {
      $("#playerOneWin").modal("show");
      gameOver = true;
    }
    else if (playerTwoMoves.indexOf(winningCombos[i][0]) >= 0 && playerTwoMoves.indexOf(winningCombos[i][1]) >= 0 && playerTwoMoves.indexOf(winningCombos[i][2]) >= 0) {
      $("#playerTwoWin").modal("show");
      gameOver = true;
    }
    //If all spaces are taken and game has not ended (since nobody has won,) it's a draw!
    else if ((playerOneMoves.length + playerTwoMoves.length == 9) && !gameOver) {
      $("#draw").modal("show");
      gameOver = true;
    }
 }
 
 
}
//Computer has basic logic - If the game isn't over, on its turn, it first tries to win if it is about to (if it has 2 in a row,) then it checks to see if player1 is about to win and stops that if necessary. If neither of these are true, it just places its piece in the first available spot.   
function playerTwo() {
  if (!gameOver) {
    //setTimeout makes it take a moment to move so we don't feel so insecure about how long it takes us humans to think!
  setTimeout(function() {
    secureWin();
    thwartWin();  
    genericMove();
    
    }, 700);
}
             
}

  //On any turn, securing the win is top priority if possible
  function secureWin() {
  loop1:
  for (var x = 0; x < winningCombos.length; x++) {
    //Works basically the same way as thwartWin (see below for detailed comments). I could probably condense these into the same function w/ different parameters, but not today!
    var playerTwoScore = 0;
    loop2:
    for (var y = 0; y < winningCombos[x].length; y++) {
      console.log(playerTwoMoves);
      if (playerTwoMoves.indexOf(winningCombos[x][y]) > -1) {
        playerTwoScore++; 
        console.log(playerTwoScore);
        } 
      if (playerTwoScore == 2) {
        for (var z = 0; z < winningCombos[x].length; z++) {
          if (playerTwoMoves.indexOf(winningCombos[x][z]) == -1 && playerOneMoves.indexOf(winningCombos[x][z]) == -1) {
            var emptySpot = winningCombos[x][z];
            placePiece(emptySpot);
            checkWin();
            whoseTurn = 'playerOne';
            gameOver = true;
            return;
          }
        }
        
      }
    }
    
    
  }
  
}
  
  //Stop player1 win if possible
  function thwartWin() {
  if (whoseTurn == 'playerTwo') {
  loop1:
  for (var x = 0; x < winningCombos.length; x++) {
    var playerOneScore = 0;
    loop2:
    for (var y = 0; y < winningCombos[x].length; y++) {
      //Assigns point for every spot taken by player1 in winning combo
      console.log(playerOneMoves);
      if (playerOneMoves.indexOf(winningCombos[x][y]) > -1) {
        playerOneScore++; 
        }
      //If there are 2 in a row...
      if (playerOneScore == 2) {
        for (var z = 0; z < winningCombos[x].length; z++) {
          //Find the 3rd spot in that row that is empty, and take it
          if (playerOneMoves.indexOf(winningCombos[x][z]) == -1 && playerTwoMoves.indexOf(winningCombos[x][z]) == -1) {
            var emptySpot = winningCombos[x][z];
            placePiece(emptySpot);
            checkWin();
            whoseTurn = 'playerOne';
            return;
          }
        }
        
      }
    }   
  }
  }
}
//This just finds the first empty spot and takes it.  
function genericMove() {
  if (whoseTurn == 'playerTwo') {
   loop1:
  for (var j = 0; j < winningCombos.length; j++) {
    loop2:
    for (var k = 0; k < winningCombos[j].length; k++) {
      if ((playerOneMoves.indexOf(winningCombos[j][k]) == -1) && (playerTwoMoves.indexOf(winningCombos[j][k]) == -1)) {
          placePiece(winningCombos[j][k]);
          checkWin();
          whoseTurn = 'playerOne';
          return;
          }
      else {
        continue loop2;
        }        
    }
  }
  }
}

//Piece placing function for computer
function placePiece(id) {
  playerTwoMoves.push(id);
  $("#" + id).html("<h1>" + computerPiece + "</h1>");
}
  
})