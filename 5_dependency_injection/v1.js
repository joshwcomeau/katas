/**
 * Constructor DependencyInjector
 * @param {Object} - object with dependencies
 */
var DI = function (dependencies) {
  this.dependencies = dependencies;
};

// Should return new function with resolved dependencies
DI.prototype.inject = function (func) {
  // First, we need to find our function's parameters in our dependency object.
  var param_names = getParams(func);

  // Let's look up those params in our dependencies obj
  var params = param_names.map( function(name) {
    return this.dependencies[name];
  }.bind(this));

  // Remove any unresolved dependencies from the params array.
  var scrubbed_params = params.filter( function(param) {
    return typeof param !== 'undefined';
  });

  // Return our wrapped function.
  // We're taking advantage of Javascript closures here:
  // The function we return will have access to all the stuff we
  // worked out above!
  return function() {

    // This will run when we invoke the wrapped function.
    // Because we don't know how many dependencies this function
    // needs, we need to invoke it with Function.apply.
    return func.apply(this, scrubbed_params);
  };
}


function getParams(func) {
  // We want to define a function that takes a function as an argument, and we
  // want to return an array of its parameters.
  //
  // For example, if we passed in a function like this:
  //    function(param, other_param) { // function stuff here }
  //
  // We'd expect the following return:
  //   ['param', 'other_param']

  // While Javascript gives us a convenient way for accessing arguments with
  // the `arguments` keyword, it doesn't give us anything for params.

  // For fun, I tried console.log-ing a function. The result is surprising:
  //   function(param, other_param) { // function stuff here }
  // It literally just returns the _whole_ function definition as a string.

  // On the assumption that console.log uses the .toString() method, I tried this:
  var func_string = func.toString();

  // Using indexOf(), we can find the place of the first '(' and the first ')'.
  // Adding 1 to opening because we don't want this character itself.
  var open_parenthesis  = func_string.indexOf('(') + 1;
  var close_parenthesis = func_string.indexOf(')');

  // We can slice everything between them, for a string:
  // 'param, other_param'
  var param_string = func_string.slice( open_parenthesis, close_parenthesis );

  // Now we just need to wipe out any whitespace, and split by commas!
  return param_string.replace(/\s/g, '').split(',');
}
module.exports = DI;
