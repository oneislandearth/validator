<p align="center">
  <a href="https://github.com/oneislandearth/validator" target="_blank">
    <img src="https://i.imgur.com/z0ux272.png">
  </a>
</p>

<p align="center">
  <a href="https://greenkeeper.io" target="_blank">
  <img src="https://badges.greenkeeper.io/oneislandearth/validator.svg"></a>
  <a href="https://travis-ci.org" target="_blank"><img src="https://api.travis-ci.org/oneislandearth/validator.svg?branch=master"></a>
  <a href="https://packagephobia.now.sh/result?p=@oneisland/validator" target="_blank"><img src="https://packagephobia.now.sh/badge?p=@oneisland/validator"></a>
  <a href="https://snyk.io/vuln/search?q=@oneisland/validator&type=npm" target="_blank"><img src="https://img.shields.io/snyk/vulnerabilities/github/oneislandearth/validator.svg"></a>
  <a href="https://www.npmjs.com/package/@oneisland/validator" target="_blank"><img src="https://img.shields.io/npm/l/@oneisland/validator.svg"></a>
</p>

***

A simple tool for validation and type checking of variables in JavaScript

## Installation

[Validator](https://github.com/oneislandearth/validator) is available through the [npm registry](https://www.npmjs.com/package/@oneisland/validator):

```bash
$ npm install @oneisland/validator
```

## Usage

After installing Validator you can use the module like so:

##### simple-usage.js
```js
// Import the the validator module
import { Validator } from '@oneisland/validator';

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

// Create a simple function
const caseA = new Simple(1, 2);

// Log out a message with the data
console.log('Values (Case A):', caseA.values);

// Create a simple function (throws an error and terminates the application)
const caseB = new Simple(2, true);

// Log out a message with the data (this line will never be reached)
console.log('Values (Case B):', caseB.values);
```

Running the following code with Node:

```sh
$ node simple-example.js
```

The script will something similar to the following, terminating before logging `Case B`:

```
Values (Case A): [ 1, 2 ]

TypeError: new Simple expects "b" to be a Number
```

Please read the [documentation below](#documentation) for more details on how to configure Validator.

You can also check out our [tests](https://github.com/oneislandearth/validator/blob/master/tests) or the source code of our [Mesh library](https://github.com/oneislandearth/mesh) for more complex usage.

## Documentation

### Validator

```js
class Validator {

  constructor(name) {}

  validate(variables, validation, description?) {}

  validateArray(variables, validation, description?) {}
}
```

Validator is a class which is instantiated for usage within a Class or Object.

Once instantiated, a validator exposes two functions for use:

 - [validate](#validate) - Validate that one or more variables meet a condition and throw an error if not
 - [validateArray](#validateArray) - Validate each value of one or more array variables using the validate function

#### constructor

##### name

The `name` parameter defines the name of the caller which the validator runs inside.

The `name` should be a [String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object).

The `name` should be name of the Class or Object which contains the method of property which calls this Validator.

```js
// Example (for the class Polygon)
'Polygon'
```

#### validate

The `validate` function accepts an [Object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) of [variables](#variables) which it will check against the validated against the [validation conditions](#validation).

The `validate` function can also accepts a [description](#description) which defines what is expected of the validation function.

```js
// Example usage (check type or species)
validate({ text }, 'String');
validate({ a, b, c }, 'Point');

// Example usage (check one of type of species)
validate({ triangle }, ['Face', 'Polygon']);

// Example usage (check with function)
validate({ score }, (score) => (score.teamA != score.teamB));
```

Check out the [tests](https://github.com/oneislandearth/validator/blob/master/tests) for more usage examples.

##### variables

The `variables` parameter defines which variables are to be validated.

The `variables` should be an [Object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) of one or more variables which should be validated.

The `variables` can be of [any type](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types), and can contain a property `species` which can be used to check the type of a variable.

```js
// Example usage (three points in a triangle)
{ a, b, c }
```

##### validation

The `validation` parameter defines how to validate the [variables](#variables).

The `validation` should be one of following types:

  - A [String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String):

    - The `validation` defines a [type](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) (e.g. `Number`) or a `species` (e.g. `Polygon`).

    - This is used to check that each [variable](#variables) is has the [type of](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/typeof) `validation` or contains a property `species` which is equal to the `validation`.

      ```js
      // Examples (primative data types):
      'String'
      'Number'

      // Examples (species types)
      'Polygon'
      'Word'
      ```
  
  - An [Array](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array) of [Strings](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String):

    - The `validation` defines an [Array](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array) of [types](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) (e.g. `Number`) or a `species` (e.g. `Polygon`)

    - This is used to check that each [variable](#variables) has one of the [types](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/typeof) or `species` as defined `validation`.
    
      ```js
      // Examples (primative data types and species types)
      ['String', 'Word']
      ['Vertex', 'Point']
      ```

  - A [Function](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function):

    - The `validation` defines a function to check each of the [variables](#variables) against.

    - The `validation` function will pass the paramaters `value` (the value of the [variable](#variables)) and `index` (the index within an [Array](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array) when called from [validateArray](#validateArray)).

    - This function will be used to check that each [variable](#variables).

      ```js
      // Example (check value of variable is less than 10)
      (value) => (value < 10);

      // Example (check that the variable has no children)
      (value) => (value.children.length == 0);

      // Example (check the value is not the same as the next one)
      (value, index) => (value != values[((index + 1) % values.length)]);
      ```

##### description

The `description` is an optional paramater which defines the expectation of the validation.

The `description` should be a [String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String).

The `description` will be be added to the error message if the validation fails.

```js
// Example (for an Array of Point)
`"points" to be an array of Point`
```

#### validateArray

The `validateArray` function accepts the same paramater options as the [validate function](#validate) but expects each of the [variables](#variables) to be an [Array](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array).

The `validateArray` function will check that each value within each of the `variables` meets the [validation conditions](#validation).

```js
// Example usage (check type or species)
validateArray({ words }, 'String');
validateArray({ points }, 'Point');

// Example usage (check one of type of species)
validateArray({ triangles }, ['Face', 'Polygon']);

// Example usage (check with function)
validateArray({ teams }, (team) => (team.members =< 5 && team.members < 8));
validateArray({ ordered }, (number, i) => ((i < 0) ? number > ordered[i - 1] : true));
```

Check out the [tests](https://github.com/oneislandearth/validator/blob/master/tests) for more usage examples.

## License

[MIT](http://opensource.org/licenses/MIT)

Copyright (c) 2019-present, OneIsland Limited
