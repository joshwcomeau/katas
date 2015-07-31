// Simple benchmarking tool.

module.exports = {
  run: function(test_function, argument, total_iterations) {
    var iteration_num = 0;
    var start = new Date().getTime();
    var answer = 0;

    while( iteration_num < total_iterations ) {
      test_function(argument)
      iteration_num++;
    }

    var end = new Date().getTime();

    return end - start;
  }
};
