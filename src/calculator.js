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

const operations = {
  '+': addition,
  addition,
  '-': subtraction,
  subtraction,
  '*': multiplication,
  multiplication,
  '/': division,
  division,
};

function calculate(left, operator, right) {
  const operation = operations[operator];

  if (!operation) {
    throw new Error(`Unsupported operation: ${operator}`);
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
  if (args.length !== 3) {
    console.error('Usage: node src/calculator.js <number> <+|-|*|/> <number>');
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
  calculate,
};

if (require.main === module) {
  runCli(process.argv.slice(2));
}