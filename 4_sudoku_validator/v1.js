// Codewars Kata 53db96041f1a7d32dc0004d2
// http://www.codewars.com/kata/53db96041f1a7d32dc0004d2/train/ruby
/*
Simple enough: Write a script that can validate whether a sudoku board is valid
or not. For fun, I'll be trying to write it in a functional programming style.
*/

function validate(board) {
  return validate_row(board)
}

function validate_row(rows) {
  // We always only care about the first row. We'll recursively call it with
  // successive rows
  var row = rows[0];

  // In sudoku, a solved row contains all of these characters exactly once.
  var valid_row  = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
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
  [5,4,2,1,3,6,7,8,9,0],
  [1,0,2,9,3,8,4,7,5,6],
  [5,6,4,7,3,8,2,9,1,0]
]

var solved = validate(board)
console.log(solved);
