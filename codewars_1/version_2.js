module.exports = function solution(digits){
  var pos, window;
  var max_seen = '0';
  var WINDOW_SIZE = 5;


  for( pos = 0; pos <= ( digits.length - WINDOW_SIZE ); pos++ ) {
    if ( digits[pos] !== '9' ) continue;

    window = digits.slice( pos, pos+WINDOW_SIZE );
    if ( window > max_seen )
      max_seen = window;
  }
  return parseInt(max_seen);

};
