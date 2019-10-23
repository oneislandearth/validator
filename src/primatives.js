// Define a validation function for checking numbers
const isNumber = (value) => {

  // Check there is a value
  if (value !== null) {

    // Check if the type is a 'number' or 'bigint'
    if (typeof (value) == 'number' || typeof (value) == 'bigint') return true;
  }

  // Return false as the type is not a number
  return false;
};

// Check the primative types
export const checkPrimative = (value, expectation) => {

  // Cast the expectation to a lowercase string
  expectation = expectation.toLowerCase();

  // Check if the expectation is a number
  if (expectation == 'number') {

    // Check using the is number function, and return true if it passes
    if (isNumber(value)) return true;
   
  // Check using the typeof operation, and return true if the check passes
  } else if (typeof (value) == expectation) return true;

  // Return false as the value did not pass checks
  return false;
};