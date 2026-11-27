'use strict';

// Basic arithmetic operations supported by the calculator.
function addition(left, right) {
  return left + right;
}

function subtraction(left, right) {
  return left - right;
}

function multiplication(left, right) {
  return left * right;
}

function division(left, right) {
  if (right === 0) {
    throw new RangeError('Cannot divide by zero.');
  }

  return left / right;
}

function modulo(left, right) {
  if (right === 0) {
    throw new RangeError('Cannot modulo by zero.');
  }

  return left % right;
}

function power(base, exponent) {
  const result = base ** exponent;

  if (!Number.isFinite(result)) {
    throw new RangeError('Power result must be a finite number.');
  }

  return result;
}

function squareRoot(value) {
  if (value < 0) {
    throw new RangeError('Cannot calculate square root of a negative number.');
  }

  return Math.sqrt(value);
}

const operations = {
  '+': addition,
  addition,
  '-': subtraction,
  subtraction,
  '*': multiplication,
  multiplication,
  '/': division,
  division,
  '%': modulo,
  modulo,
  '^': power,
  '**': power,
  power,
};

const unaryOperations = {
  sqrt: squareRoot,
  squareRoot,
  'square-root': squareRoot,
};

function calculate(left, operator, right) {
  const isUnary = Object.hasOwn(unaryOperations, operator);
  const operation = isUnary ? unaryOperations[operator] : operations[operator];

  if (!Object.hasOwn(isUnary ? unaryOperations : operations, operator)) {
    throw new Error(`Unsupported operation: ${operator}`);
  }

  if (isUnary) {
    if (right !== undefined) {
      throw new Error(`Operation ${operator} expects one number.`);
    }

    return operation(left);
  }

  return operation(left, right);
}

function parseOperand(value) {
  const operand = Number(value);

  if (value.trim() === '' || !Number.isFinite(operand)) {
    throw new TypeError(`Invalid number: ${value}`);
  }

  return operand;
}

function runCli(args) {
  if (args.length === 2 && Object.hasOwn(unaryOperations, args[0])) {
    try {
      console.log(calculate(parseOperand(args[1]), args[0]));
    } catch (error) {
      console.error(error.message);
      process.exitCode = 1;
    }

    return;
  }

  if (args.length !== 3) {
    console.error('Usage: node src/calculator.js <number> <+|-|*|/|%|^> <number> | node src/calculator.js <sqrt> <number>');
    process.exitCode = 1;
    return;
  }

  try {
    const left = parseOperand(args[0]);
    const right = parseOperand(args[2]);
    console.log(calculate(left, args[1], right));
  } catch (error) {
    console.error(error.message);
    process.exitCode = 1;
  }
}

module.exports = {
  addition,
  subtraction,
  multiplication,
  division,
  modulo,
  power,
  squareRoot,
  calculate,
};

if (require.main === module) {
  runCli(process.argv.slice(2));
}