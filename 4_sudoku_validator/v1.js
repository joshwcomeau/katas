// Codewars Kata 53db96041f1a7d32dc0004d2
// http://www.codewars.com/kata/53db96041f1a7d32dc0004d2/train/ruby
/*
Simple enough: Write a script that can validate whether a sudoku board is valid
or not. For fun, I'll be trying to write it in a functional programming style.
*/

function validate(board) {
  // The plan: Check all the rows, rotate the board, check all the rows again.
  var row_check = validate_row( board );
  var col_check = validate_row( rotate_board(board) );
  var reg_check = validate_regions( board );

  console.log(row_check, col_check, reg_check);

  return row_check && col_check && reg_check;
}

function validate_regions(board) {
  // There are 9 regions, of 3x3, within the larger 9x9 board.
  // Each region must contain 1-9, just like each row.
  // In other words, all we really want to do is pluck those 9 values out
  // and treat them like a row. Why don't we create a new 'board' by rearranging
  // each region into a row, and then checking each row?
  var pseudo_board = board.map( function(row, index) {
    // We don't care about the row, we just need the index
    return pluck_region(board, index);
  });

  // We now have what amounts to a 'board' of regions; each region of 9 has
  // been transmuted into a single-dimensional array, and there's 9 of them
  // in a parent array.
  console.log(pseudo_board)
  return validate_row(pseudo_board)
}

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

function is_array(obj) {
  // Returns true if item is array.
  return Object.prototype.toString.call(obj) === '[object Array]';
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


var bad_board = [
[ 9, 3, 2, 5, 7, 1, 4, 6, 8 ],
[ 4, 1, 8, 2, 6, 9, 3, 7, 5 ],
[ 7, 5, 6, 3, 8, 4, 2, 9, 1 ],
[ 6, 4, 3, 9, 5, 8, 7, 1, 2 ],
[ 5, 2, 1, 7, 9, 3, 8, 4, 6 ],
[ 1, 8, 7, 4, 2, 6, 5, 3, 9 ],
[ 2, 9, 4, 1, 3, 5, 6, 8, 7 ],
[ 3, 6, 5, 8, 1, 7, 9, 2, 4 ],
[ 8, 7, 9, 6, 4, 2, 1, 5, 3 ]
];

var good_board = [
[5, 3, 4, 6, 7, 8, 9, 1, 2],
[6, 7, 2, 1, 9, 5, 3, 4, 8],
[1, 9, 8, 3, 4, 2, 5, 6, 7],
[8, 5, 9, 7, 6, 1, 4, 2, 3],
[4, 2, 6, 8, 5, 3, 7, 9, 1],
[7, 1, 3, 9, 2, 4, 8, 5, 6],
[9, 6, 1, 5, 3, 7, 2, 8, 4],
[2, 8, 7, 4, 1, 9, 6, 3, 5],
[3, 4, 5, 2, 8, 6, 1, 7, 9]
];

var test_board = [
[1,1,1,2,2,2,3,3,3],
[1,1,1,2,2,2,3,3,3],
[1,1,1,2,2,2,3,3,3],
[4,4,4,5,5,5,6,6,6],
[4,4,4,5,5,5,6,6,6],
[4,4,4,5,5,5,6,6,6],
[7,7,7,8,8,8,9,9,9],
[7,7,7,8,8,8,9,9,9],
[7,7,7,8,8,8,9,9,9],
]


console.log("Bad board:", validate(bad_board) );
console.log("Good board:", validate(good_board) );

console.log("Rotated:", validate_regions(test_board))
