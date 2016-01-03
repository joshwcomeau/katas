const dependencies = {
  add(a, b) {       return a + b; },
  subtract(a, b) {  return a - b; },
  multiply(a, b) {  return a * b; },
  divide(a, b) {    return a / b; }
};

function program(multiply, divide) {
  const square = a => multiply(a, a);
  console.log( square(5) );
}

const injector = new DI(dependencies);
const loaded_program = injector.inject( program );

loaded_program();
