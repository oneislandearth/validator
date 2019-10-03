// Import the testing module
import test from 'ava';

// Import the the validator module
import { Validator } from 'lib/validator';

// Describe the Validator for the class
const { validate } = new Validator('Simple');

// Create a simple class
class Simple {

  // Create an instance from two numbers
  constructor(a, b) {

    // Check that 'a' and 'b' are numbers
    validate({ a, b }, 'Number');

    // Check that 'a' is an odd number
    validate({ a }, (v) => (v % 2), `"a" to be an odd number`);

    // Check that 'b' is an even number
    validate({ b }, (v) => !(v % 2), `"b" to be an even number`);

    // Bind the values
    this.values = [a, b];
  }
}

// Perform a test to check valid input
test('Simple: valid input', (result) => {

  // Create an instance of Simple with valid input
  const { values } = new Simple(1, 2);

  // Extract a and b from the instance
  const [a, b] = values;

  // Assert the values in the Simple are correct
  result.assert(a == 1);
  result.assert(b == 2);
});

// Perform a test with invalid input (not numbers)
test('Simple: invalid input (non numbers)', (result) => {

  // Throw an error in a catcher
  const errorA = result.throws(() => {

    // Create an instance of Simple with invalid input
    new Simple('hello', 2);
  });
    
  // Assert the error mesage is correct
  result.assert(~String(errorA).indexOf(`expects "a" to be a Number`));

  // Throw an error in a catcher
  const errorB = result.throws(() => {

    // Create an instance of Simple with invalid input
    new Simple(1, 'hello');
  });
    
  // Assert the error mesage is correct
  result.assert(~String(errorB).indexOf(`expects "b" to be a Number`));
});

// Perform a test with invalid input (not odd)
test('Simple: invalid input ("a" not odd)', (result) => {

  // Throw an error in a catcher
  const error = result.throws(() => {

    // Create an instance of Simple with invalid input
    new Simple(0, 2);
  });
    
  // Assert the error mesage is correct
  result.assert(~String(error).indexOf(`expects "a" to be an odd number`));
});

// Perform a test with invalid input (not even)
test('Simple: invalid input ("b" not even)', (result) => {

  // Throw an error in a catcher
  const error = result.throws(() => {

    // Create an instance of Simple with invalid input
    new Simple(1, 1);
  });
    
  // Assert the error mesage is correct
  result.assert(~String(error).indexOf(`expects "b" to be an even number`));
});