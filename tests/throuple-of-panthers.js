// Disable eslint max classes for tests
/* eslint max-classes-per-file: "off" */

// Import the testing module
import test from 'ava';

// Import the the validator module
import { Validator } from 'lib/validator';

// Create a simple class for a Panther
class Panther {

  // Decribe the animal and its species
  constructor(name, species) {

    // Describe the Validator for the Panther
    const { validate } = new Validator('Panther');

    // Validate the name and species
    validate({ name, species }, 'String');

    // Bind the name and species
    this.name = name;
    this.species = species;
  }
}

// Create a class for a Throuple of Panthers
class ThroupleOfPanthers {

  // Create an instance from an array of panthers
  constructor(...panthers) {

    // Describe the Validator for the ThroupleOfPanthers
    const { validate, validateArray } = new Validator('ThroupleOfPanthers');

    // Check that the values are panthers
    validateArray({ panthers }, ['Jaguar', 'Leopard', 'Tiger']);

    // Check that there are only three panthers
    validate({ panthers }, (panthers) => (panthers.length == 3), `"panthers" to contains only three panthers`);

    // Check that the panthers are not the same species
    validateArray({ panthers }, (panther, i) => {

      // Find the previous panther
      const previous = panthers[((i + panthers.length - 1) % panthers.length)];

      // Find the next panther
      const next = panthers[((i + 1) % panthers.length)];
      
      // Check that the panthers are all of different species in the order
      return (panther.species != previous.species) && (panther.species != next.species) && (next.species != previous.species);

    // Describe the expected values 
    }, `"panthers" to contain one Jaguar, one Leopard, and one Tiger`);

    // Bind the values
    this.values = panthers;
  }
}

// Perform a test to check valid input
test('Throuple of Panthers: valid input', (result) => {

  // Create some panthers
  const silky = new Panther('Silky', 'Jaguar');
  const spotty = new Panther('Spotty', 'Leopard');
  const stripe = new Panther('Stripe', 'Tiger');

  // Create an instance of ThroupleOfpanthers with valid input
  const { values } = new ThroupleOfPanthers(silky, spotty, stripe);

  // Assert the values in the ThroupleOfPanthers are correct
  result.assert(values.length == 3);
});

// Perform a test with invalid input (not panthers)
test('Throuple of Panthers: invalid input (non panthers)', (result) => {

  // Throw an error in a catcher
  const error = result.throws(() => {

    // Create an instance of ThroupleOfPanthers with invalid input
    new ThroupleOfPanthers(true, false, true);
  });
    
  // Assert the error mesage is correct
  result.assert(~String(error).indexOf(`expects each of "panthers" to be a Jaguar, Leopard or Tiger`));
});

// Perform a test with invalid input (non-throuple)
test('Throuple of Panthers: invalid input (non-throuple)', (result) => {

  // Throw an error in a catcher
  const error = result.throws(() => {

    // Create some panthers
    const silky = new Panther('Silky', 'Jaguar');
    const spotty = new Panther('Spotty', 'Leopard');

    // Create an instance of ThroupleOfPanthers with invalid input
    new ThroupleOfPanthers(silky, spotty);
  });
    
  // Assert the error mesage is correct
  result.assert(~String(error).indexOf(`expects "panthers" to contains only three panthers`));
});

// Perform a test with invalid input (not enough tigers)
test('Throuple of Panthers: invalid input (not enough tigers)', (result) => {

  // Throw an error in a catcher
  const error = result.throws(() => {

    // Create some panthers
    const silky = new Panther('Silky', 'Jaguar');
    const spotty = new Panther('Spotty', 'Leopard');
    const slick = new Panther('Slick', 'Jaguar');

    // Create an instance of ThroupleOfPanthers with invalid input
    new ThroupleOfPanthers(silky, spotty, slick);
  });
    
  // Assert the error mesage is correct
  result.assert(~String(error).indexOf(`expects "panthers" to contain one Jaguar, one Leopard, and one Tiger`));
});

// Perform a test with invalid input (too many jaguars)
test('Throuple of Panthers: invalid input (too many jaguars)', (result) => {

  // Throw an error in a catcher
  const error = result.throws(() => {

    // Create some panthers
    const silky = new Panther('Silky', 'Jaguar');
    const slick = new Panther('Slick', 'Jaguar');
    const smooth = new Panther('Smooth', 'Jaguar');

    // Create an instance of ThroupleOfPanthers with invalid input
    new ThroupleOfPanthers(silky, slick, smooth);
  });
    
  // Assert the error mesage is correct
  result.assert(~String(error).indexOf(`expects "panthers" to contain one Jaguar, one Leopard, and one Tiger`));
});