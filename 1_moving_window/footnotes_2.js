module.exports = function solution(digits, biggest_num){
  // If this is the first iteration, it's called without a 'biggest_num' arg.
  if ( biggest_num === undefined ) biggest_num = 9;

  var pos, window;
  var max_seen = 0;
  var WINDOW_SIZE = 5;

  for( pos = 0; pos <= ( digits.length - WINDOW_SIZE ); pos++ ) {
    if ( parseInt(digits[pos]) !== biggest_num ) continue;

    window = parseInt(digits.slice( pos, pos+WINDOW_SIZE ));
    if ( window > max_seen )
      max_seen = window;
  }

  return max_seen || solution(digits, biggest_num-1);
};
