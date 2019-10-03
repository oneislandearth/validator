// Import the testing module
import test from 'ava';

// Import the the validator module
import { Validator } from 'lib/validator';

// Describe the Validator for the class
const { validate, validateArray } = new Validator('SumOfTen');

// Create a more complex class
class SumOfTen {

  // Create an instance from a list of numbers
  constructor(...numbers) {

    // Check that all values in the list are numbers
    validateArray({ numbers }, 'Number');

    // Check that sum of numbers is less than ten
    validate({ numbers }, (v) => (v.reduce((sum, v) => sum += v, 0) == 10), `the sum of "numbers" to equal 10`);

    // Bind the values
    this.values = numbers;
  }
}

// Perform a test to check valid input
test('Sum of Ten: valid input', (result) => {

  // Create an instance of SumOfTen with valid input
  const { values } = new SumOfTen(1, 2, 3, 4);

  // Assert the values in the SumOfTen are correct
  result.assert(values.length == 4);
  result.assert(values.reduce((sum, v) => sum += v, 0) == 10);
});

// Perform a test with invalid input (not numbers)
test('Sum of Ten: invalid input (non numbers)', (result) => {

  // Throw an error in a catcher
  const error = result.throws(() => {

    // Create an instance of SumOfTen with invalid input
    new SumOfTen(1, 2, true, 4);
  });
    
  // Assert the error mesage is correct
  result.assert(~String(error).indexOf(`expects each of "numbers" to be a Number`));
});

// Perform a test with invalid input (more than ten)
test('Sum of Ten: invalid input (more than ten)', (result) => {

  // Throw an error in a catcher
  const error = result.throws(() => {

    // Create an instance of SumOfTen with invalid input
    new SumOfTen(10, 1);
  });
    
  // Assert the error mesage is correct
  result.assert(~String(error).indexOf(`expects the sum of "numbers" to equal 10`));
});