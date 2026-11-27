'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const { spawnSync } = require('node:child_process');
const path = require('node:path');
const {
  addition,
  subtraction,
  multiplication,
  division,
  calculate,
} = require('../calculator');

const calculatorPath = path.join(__dirname, '..', 'calculator.js');
const childEnvironment = { ...process.env, FORCE_COLOR: '0' };

test('addition adds positive, negative, and decimal numbers', () => {
  assert.equal(addition(2, 3), 5);
  assert.equal(addition(-4, 3), -1);
  assert.equal(addition(0.1, 0.2), 0.1 + 0.2);
});

test('subtraction subtracts the second number from the first', () => {
  assert.equal(subtraction(8, 3), 5);
  assert.equal(subtraction(3, 8), -5);
});

test('multiplication handles positive, negative, and zero values', () => {
  assert.equal(multiplication(4, 3), 12);
  assert.equal(multiplication(-4, 3), -12);
  assert.equal(multiplication(5, 0), 0);
});

test('division divides the first number by the second', () => {
  assert.equal(division(12, 3), 4);
  assert.equal(division(5, 2), 2.5);
  assert.equal(division(-12, 3), -4);
});

test('division rejects a zero divisor', () => {
  assert.throws(() => division(5, 0), {
    name: 'RangeError',
    message: 'Cannot divide by zero.',
  });
});

test('calculate accepts operation names and symbols', () => {
  assert.equal(calculate(2, 'addition', 3), 5);
  assert.equal(calculate(8, '-', 3), 5);
  assert.equal(calculate(4, '*', 3), 12);
  assert.equal(calculate(12, 'division', 3), 4);
});

test('calculate rejects unsupported operations', () => {
  assert.throws(() => calculate(2, '%', 3), /Unsupported operation: %/);
});

test('CLI prints results for each arithmetic operator', () => {
  const examples = [
    ['2', '+', '3', '5'],
    ['8', '-', '3', '5'],
    ['4', '*', '3', '12'],
    ['12', '/', '3', '4'],
  ];

  for (const [left, operator, right, expected] of examples) {
    const result = spawnSync(process.execPath, [calculatorPath, left, operator, right], {
      encoding: 'utf8',
      env: childEnvironment,
    });

    assert.equal(result.status, 0);
    assert.equal(result.stdout.trim(), expected);
    assert.equal(result.stderr, '');
  }
});

test('CLI reports invalid input and division by zero', () => {
  const invalidNumber = spawnSync(process.execPath, [calculatorPath, 'x', '+', '2'], {
    encoding: 'utf8',
    env: childEnvironment,
  });
  const divisionByZero = spawnSync(process.execPath, [calculatorPath, '5', '/', '0'], {
    encoding: 'utf8',
    env: childEnvironment,
  });

  assert.equal(invalidNumber.status, 1);
  assert.match(invalidNumber.stderr, /Invalid number: x/);
  assert.equal(divisionByZero.status, 1);
  assert.match(divisionByZero.stderr, /Cannot divide by zero/);
});