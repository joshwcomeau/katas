// Codewars Kata 53db96041f1a7d32dc0004d2
// http://www.codewars.com/kata/53db96041f1a7d32dc0004d2/train/ruby
/*
Simple enough: Write a script that can validate whether a sudoku board is valid
or not. For fun, I'll be trying to write it in a functional programming style.
*/

module.exports = function(board) {
  // I've abstracted the solution into three steps.
  //
  // 1) Check that each row contains 1-9.
  //
  // 2) Check that each column contains 1-9.
  //      this is done by rotating the board by 90 degrees,
  //      and checking every row again.
  //
  // 3) Check each 3x3 region for 1-9
  //      this is done by extracting each region as an array,
  //      building a pseudo-board with the 9 arrays,
  //      and checking every row again.

  var row_check = validate_rows( board );
  var col_check = validate_rows( rotate_board(board) );
  var reg_check = validate_rows( regionize_board(board) );


  // If all three of those checks pass, we have a solution!
  return row_check && col_check && reg_check;
}

// Our bread-and-butter solution, this takes a set of rows, validates the first
// one, and passes the rest into itself recursively.
// Returns true if ALL the rows passed in contain 1-9.
function validate_rows(rows) {
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
      return validate_rows( next_rows );
    }

    // If this is the last row, congratulations! Your sudoku is solved.
    return true;
  }

  // Oh no! We have a mismatch. This sudoku isn't solved.
  return false;
}

// In order to check columns, I 'rotate' the current board and just check its
// rows. Far from the most efficient way, but I like how intuitive it is.
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

// This checks all the regions on a board. Read the lengthy pluck_region
// function to learn how.
function regionize_board(board) {
  // There are 9 regions, of 3x3, within the larger 9x9 board.
  // Each region must contain 1-9, just like each row.
  // In other words, all we really want to do is pluck those 9 values out
  // and treat them like a row. Why don't we create a new 'board' by rearranging
  // each region into a row, and then checking each row?
  return board.map( function(row, index) {
    return pluck_region(board, index);
  });
}


/////////////// HELPER FUNCTIONS ///////////////
// Our main abstractions out of the way,
// it's time to see how the sausage is packed.

function pluck_region(board, index) {
  // Given an index from 0 to 8, we need to pluck out the corresponding region:
  /* _______________________
    | _ _ _ | _ _ _ | _ _ _ |
    | _ 0 _ | _ 1 _ | _ 2 _ |
    |_______|_______|_______|
    | _ _ _ | _ _ _ | _ _ _ |
    | _ 3 _ | _ 4 _ | _ 5 _ |
    |_______|_______|_______|
    | _ _ _ | _ _ _ | _ _ _ |
    | _ 6 _ | _ 7 _ | _ 8 _ |
    |_______|_______|_______|
  */
  // And return it as a row of its 9 numbers.

  // Alright, this is tricky business.

  // ROW
  // The first part is figuring out which 'rows' of our 2D array. We only want
  // to deal with the three that contain the numbers needed to fulfill our
  // region.
  // Index     Row
  //----------------
  //   0   |  0,1,2
  //   1   |  0,1,2
  //   2   |  0,1,2
  //   3   |  3,4,5
  //   4   |  3,4,5
  //   5   |  3,4,5
  //   6   |  6,7,8
  //   7   |  6,7,8
  //   8   |  6,7,8
  //----------------

  // This is an interesting problem: it's almost like we want to 'lower' the
  // resolution, so that we round down to the nearest third.
  // Turns out, that's almost exactly what we need to do.

  // First, divide by 3, and floor it. This maps 0..9 to [0,0,0,1,1,1,2,2,2]
  var floored_starter_row = Math.floor(index / 3);

  // Then, simply enough, multiply by 3!
  var region_row          = floored_starter_row * 3;

  // Because we always want 3 rows, we can just slice from our row to row+3.
  var board_rows = board.slice(region_row, region_row+3)

  // COLUMNS
  // At this point, we have a three-row cross-section of the board.
  // [
  //  [0,0,0,1,1,1,2,2,2],
  //  [0,0,0,1,1,1,2,2,2],
  //  [0,0,0,1,1,1,2,2,2]
  // ]

  // We have the rows we need, now we just need to work out the column.

  // Index   Columns
  //----------------
  //   0   |  0,1,2
  //   1   |  3,4,5
  //   2   |  6,7,8
  //   3   |  0,1,2
  //   4   |  3,4,5
  //   5   |  6,7,8
  //   6   |  0,1,2
  //   7   |  3,4,5
  //   8   |  6,7,8

  // This is actually very similar to how we got our rows! Except the pattern
  // is different. For every 1 increment in index, we need to go up by 3 in
  // column, but that resets to the beginning every third row.
  // We need to map 0..9 to [0,1,2,0,1,2,0,1,2]
  var normalized_col = index % 3

  // Now, once again, it's just a matter of multiplying by 3, for our desired
  // array of [0,3,6,0,3,6,0,3,6]
  var representative_col = normalized_col * 3

  // Map our rows to only grab the 3 values from each row we need, at the
  // columns requested
  var board_cells = board_rows.map( function(row) {
    return row.slice(representative_col, representative_col+3)
  });

  // At this point, we should indeed have a region! It's still a 2D array though.
  // Flatten it, so we can treat it as a regular row.
  return flatten(board_cells);
}

// Turn a multi-dimensional array like [ [1,1,1], [2,2,2], [3,3,3] ]
// into a single-dimension array like [ 1,1,1,2,2,2,3,3,3 ]
function flatten(arr) {
  // Reduce is lovely. It's akin to Ruby's inject.
  // For every item in array, perform this function on it; what you return
  // gets passed to the next iteration as 'memo'.
  // For the first iteration, 'memo' is an empty array, passed in as the
  // second argument below.
  return arr.reduce( function(memo, val) {
    // Concat is a very helpful builtin that either pushes a regular value
    // to an array, or 'concatenates' two arrays.
    // For example, [1, 2].concat([3, 4]) -> [1, 2, 3, 4]
    // This only works on 1D arrays; we can't just use this to flatten.
    // By recursively calling flatten on all arrays we find, that will eventually
    // return a 1D array, which we can concatenate =)
    return memo.concat(
      is_array(val) ? flatten(val) : val
    );
  }, []);
}

// Simple Array checker. Returns true if obj is an array.
function is_array(obj) {
  return Object.prototype.toString.call(obj) === '[object Array]';
}

// Does a shallow compare to see if two arrays contain exactly the same values.
function identical_arrays(arr1, arr2) {
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

// Exactly what it sounds like :)
function create_sorted_copy(arr) {
  return arr.slice().sort();
}
