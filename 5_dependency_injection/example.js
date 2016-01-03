var dependencies = {
  add:       function(a, b) { return a + b; },
  subtract:  function(a, b) { return a - b; },
  multiply:  function(a, b) { return a * b; },
  divide:    function(a, b) { return a / b; }
};

// Here's the base program I want to run.
// If I try to invoke it now, without any arguments,
// I'll get a TypeError, because multiply is not a function.
function program(multiply, divide) {
  var square = function(a) {
    return multiply(a, a);
  };
  console.log( square(5) );
}

// First, I need to create an injector, and supply it with my dependencies:
var injector = new DI(dependencies);

// Then, I need to inject them into my program.
var loaded_program = injector.inject( program );

// Let's think this through.
// `injector` is our object created by our constructor.
// It has an 'inject' method, which takes a function as an argument.
//
// When I invoke it with our `program` function, it returns a new
// anonymous function that has not yet been invoked:
//
//   function() {
//     return func.apply(this, scrubbed_params);
//   };
//
// I can't see them there, but because of Javascript's closures,
// 'func' is defined as our `program` function, and `scrubbed_params`
// is defined as an array of functions; in this case, the function
// definitions for `multiply` and `divide`.
//
// Because we know what `scrubbed_params` are, in this case, we could
// re-write that line as:
//
//   function() {
//     return func(multiply, divide);
//   }
//
// This would work in this case, but we obviously can't actually write
// it like that, because it would fail in every other case =)


// In summary:

loaded_program();

// By invoking the wrapped function, we're invoking that anonymous
// function. Function.apply is just a fancy way of calling a function
// when we don't know how many arguments it needs ahead of time, so
// what it does is immediately invoke our `program` function with the
// right arguments, and returns its result:
//
//   function program(multiply, divide) {
//     var square = function(a) {
//       return multiply(a, a);
//     };
//     console.log( square(5) );
//   }
//
// In other words, it does exactly what we want =)
// It's equivalent to just invoking the `program` function we wrote,
// but with the difference that all the dependencies have been resolved.
