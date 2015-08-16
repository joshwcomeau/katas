// Codewars Kata 53db96041f1a7d32dc0004d2
// http://www.codewars.com/kata/53db96041f1a7d32dc0004d2/train/ruby
/*
Simple enough: Write a script that can validate whether a sudoku board is valid
or not. For fun, I'll be trying to write it in a functional programming style.
*/

function validate(board) {
  // The plan: Check all the rows, rotate the board, check all the rows again.
  var rotated_board = rotate_board(board);
  console.log(rotated_board)
  return validate_row(board) && validate_row(rotated_board);
}

function validate_row(rows) {
  // We always only care about the first row. We'll recursively call it with
  // successive rows
  var row = rows[0];

  // In sudoku, a solved row contains all of these characters exactly once.
  var valid_row  = [1, 2, 3, 4, 5, 6, 7, 8, 9];
  var sorted_row = create_sorted_copy( row );

  if ( identical_arrays( sorted_row, valid_row ) ) {
    // This row is valid!

    // If this isn't the last row, we can check the next one.
    if ( rows.length > 1 ) {
      var next_rows = rows.slice(1);
      return validate_row( next_rows );
    }

    // If this is the last row, congratulations! Your sudoku is solved.
    return true;
  }

  // Oh no! We have a mismatch. This sudoku isn't solved.
  return false;
}

function rotate_board(board) {
  // Given board:
  // [ [1,2,3]
  //   [1,2,3]
  //   [1,2,3] ]
  // This method rotates it ninety degrees clockwise, for:
  // [ [1,1,1]
  //   [2,2,2]
  //   [3,3,3] ]
  return board[0].map( function(column, index) {
    return board.map( function(row) {
      return row[index];
    });
  });
}

function identical_arrays(arr1, arr2) {
  // Does a shallow compare to see if two arrays contain exactly the same values.

  // Obviously, if they aren't the same length, they can't be identical.
  if ( arr1.length != arr2.length ) return false;

  for ( var i = 0; i < arr1.length; i++ ) {
    // If, at any point, I find a value that does not match, I know right away
    // that they do not match
    if ( arr1[i] !== arr2[i] ) return false;
  }

  // If, however, I make it through that loop without finding a problem,
  // the two lists must be identical!
  return true;
}

function create_sorted_copy(arr) {
  return arr.slice().sort();
}


var board = [
[ 1, 3, 2, 5, 7, 9, 4, 6, 8 ],
[ 4, 9, 8, 2, 6, 1, 3, 7, 5 ],
[ 7, 5, 6, 3, 8, 4, 2, 1, 9 ],
[ 6, 4, 3, 1, 5, 8, 7, 9, 2 ],
[ 5, 2, 1, 7, 9, 3, 8, 4, 6 ],
[ 9, 8, 7, 4, 2, 6, 5, 3, 1 ],
[ 2, 1, 4, 9, 3, 5, 6, 8, 7 ],
[ 3, 6, 5, 8, 1, 7, 9, 2, 4 ],
[ 8, 7, 9, 6, 4, 2, 1, 5, 3 ]
];

var solved = validate(board)
console.log(solved);

var rotated_board = [
  [1,2,3],
  [1,2,3],
  [1,2,3]
]

console.log(rotate_board(rotated_board));
