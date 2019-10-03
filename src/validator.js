// Import the required primative types
import { checkPrimative } from './primatives';

// Create a class for validations
export class Validator {

  // Create a validator for the class
  constructor(name) {

    // Return the validate functions
    return { 
      
      // Define the validation function
      validate(variables, validation, description) {

        // Return the validation function
        return validate(name, variables, validation, description);
      },

      // Define the validation (for arrays) function
      validateArray(variables, validation, description) {

        // Return the validation function
        return validateArray(name, variables, validation, description);
      } 
    };
  }
}


// Find the function where the error occurred
const findCaller = (name, depth = 0) => {

  // Define the function name which called the validator
  let caller = '';

  // Define the regex for finding the name of the match
  const regex = /([^(]+)@|at ([^([]+) [(|[]/igms;

  // Find the matches
  const matches = [...String(new Error().stack).matchAll(regex)];

  // Check there is a match
  for (const i in matches) {

    // Skip to the line of code  in the error string which defines the caller
    if (i < (3 + depth)) continue;

    // Determine the caller
    caller = matches[i][2] || matches[i][3];

    // Skip if the caller is 'new Validator'
    if (~caller.indexOf('new Validator')) continue;

    // Check if the caller starts with 'Function' and replace 'Function' with the validator name
    if (caller.indexOf('Function') == 0) caller = caller.replace('Function', name);

    // Remove the 'get ' and 'set ' if there are computed properties
    caller = caller.replace(/(.*)(get |set )(.*)/, '$1$3');

    // Break the loop
    break;
  }

  return caller;
};

// Validate each of the variables
const validate = (name, variables, validation, description, depth = 0, index = 0) => {

  // Iterate through each variable
  for (const [variable, value] of Object.entries(variables)) {

    // Check if there is a value and a validation function
    if (typeof (value) != 'undefined' && value !== null && typeof (validation) != 'undefined') {

      // Check if the validation is a single species
      if (typeof (validation) == 'string') {

        // Define the species as the validation
        const species = validation;

        // Check the value against the species, and skip to the next value
        if (value && value.species && value.species == species) continue;

        // Check if the value is a primative type, and skip to the next value
        if (checkPrimative(value, validation)) continue;

        // Determine whether to add each of not
        const each = (depth > 0) ? 'each of ' : '';

        // Determine the expected outcome
        const expectation = (description) ? description : `${each}"${variable}" to be a ${species}`; 

        // Determine the error message
        const message = `${findCaller(name, depth)} expects ${expectation}`;

        // Throw an error detailing the place where the error occurred
        throw new TypeError(message);

        // Check if the validation is an array of species
      } else if (Array.isArray(validation)) {

        // Define the list of species options (prevent formatting if there is a description)
        const species = (description) ? '' : `${validation.slice(0, validation.length - 1).join(', ')} or ${validation[validation.length - 1]}`;

        // Determine whether the values is one of the values
        let passed = false;

        // Check the value against each of the species
        for (const species of validation) {

          // Check the value against the species
          if (value && value.species && value.species == species) {

            // Set the passed flag to true
            passed = true;

            // Break as the value has passed
            break;

          // Check if the value is a primative type
          } else if (checkPrimative(value, species)) {

            // Set the passed flag to true
            passed = true;

            // Break as the value has passed
            break;
          }
        }

        // Check if species checks did not pass
        if (!passed) {

          // Determine whether to add each of not
          const each = (depth > 0) ? 'each of ' : '';

          // Determine the expected outcome
          const expectation = (description) ? description : `${each}"${variable}" to be a ${species}`; 

          // Determine the error message
          const message = `${findCaller(name, depth)} expects ${expectation}`;

          // Throw an error detailing the place where the error occurred
          throw new TypeError(message);
        }

        // Check if the validation is a function
      } else if (typeof (validation) == 'function') {

        // Check and run the validation function for the value
        if (!validation(value, index)) {

          // Determine whether to add each of not
          const each = (depth > 0) ? 'each of ' : '';

          // Determine the expected outcome
          const expectation = (description) ? description : `${each}"${variable}" to be a valid value`; 

          // Determine the error message
          const message = `${findCaller(name, depth + 1)} expects ${expectation}`;

          // Throw an error detailing the place where the error occurred
          throw new TypeError(message);
        }
      }
  
    // Catch the case where there is no value or validation type
    } else { 

      // Determine whether to add each of not
      const each = (depth > 0) ? 'each of ' : '';

      // Determine the expected outcome
      const expectation = (description) ? description : `${each}"${variable}" to be a valid value`; 

      // Determine the error message
      const message = `${findCaller(name, depth)} expects ${expectation}`;

      // Throw an error detailing the place where the error occurred
      throw new TypeError(message);
    }
  }
};

// Validate all of the values in each array
const validateArray = (name, variables, validation, description) => {

  // Iterate through each variable
  for (const [variable, value] of Object.entries(variables)) {

    // Check if the value is an array of values
    if (Array.isArray(value)) {

      // Iterate through each of the values in the value
      for (const i in value) {
      
        // Validate the value
        validate(name, { [variable]: value[i] }, validation, description, 1, Number(i));
      }

      continue;

    // Handle the case where the value is not an array
    } else {

      // Validate using the standard method
      validate(name, { [variable]: value }, validation, description, 1);
    }
  }
};