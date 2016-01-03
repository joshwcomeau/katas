// Codewars Kata 53db96041f1a7d32dc0004d2
// http://www.codewars.com/kata/53db96041f1a7d32dc0004d2/train/ruby

module.exports = function(board) {
  var row_check = validate_rows( board );
  var col_check = validate_rows( rotate_board(board) );
  var reg_check = validate_rows( regionize_board(board) );
  return !!row_check && !!col_check && !!reg_check;
}

function validate_rows(rows) {
  var row = rows[0];

  var valid_row  = [1, 2, 3, 4, 5, 6, 7, 8, 9];
  var sorted_row = create_sorted_copy( row );

  if ( identical_arrays( sorted_row, valid_row ) ) {
    if ( rows.length > 1 ) return validate_rows( rows.slice(1) );
    return true;
  }
}

function rotate_board(board) {
  return board[0].map( function(column, index) {
    return board.map( function(row) {
      return row[index];
    });
  });
}

function regionize_board(board) {
  return board.map( function(row, index) {
    return pluck_region(board, index);
  });
}


function pluck_region(board, index) {
  var floored_starter_row = Math.floor(index / 3);
  var region_row          = floored_starter_row * 3;
  var board_rows          = board.slice(region_row, region_row+3)

  var normalized_col      = index % 3
  var representative_col  = normalized_col * 3

  var board_cells = board_rows.map( function(row) {
    return row.slice(representative_col, representative_col+3)
  });

  return flatten(board_cells);
}

function flatten(arr) {
  return arr.reduce( function(memo, val) {
    return memo.concat( is_array(val) ? flatten(val) : val );
  }, []);
}

function is_array(obj) {
  return Object.prototype.toString.call(obj) === '[object Array]';
}

function identical_arrays(arr1, arr2) {
  if ( arr1.length != arr2.length ) return false;

  for ( var i = 0; i < arr1.length; i++ ) {
    if ( arr1[i] !== arr2[i] ) return false;
  }

  return true;
}

function create_sorted_copy(arr) {
  return arr.slice().sort();
}
