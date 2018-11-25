const ASSIGN = 'ASSIGN';
const NOT = 'NOT';
const AND = 'AND';
const OR = 'OR';
const LSHIFT = 'LSHIFT';
const RSHIFT = 'RSHIFT';

const unaryOperation = (inV, operation, outV) => {
  const numericValue = Number.parseInt(inV);
  const isNumber = !Number.isNaN(numericValue);
  return {
    operation: operation == 'NOT' ? NOT : ASSIGN,
    operands: [{
      value: isNumber ? numericValue : inV,
      isNumber
    }],
    target: outV
  };
}

const binaryOperation = (inV1, inOperation, inV2, outV) => {
  const numericValue1 = Number.parseInt(inV1);
  const isNumber1 = !Number.isNaN(numericValue1);
  const numericValue2 = Number.parseInt(inV2);
  const isNumber2 = !Number.isNaN(numericValue2);

  let operation = AND;
  switch(inOperation) {
    case 'OR':
      operation = OR;
      break;
    case 'LSHIFT':
      operation = LSHIFT;
      break;
    case 'RSHIFT':
      operation = RSHIFT;
      break;
  }

  return {
    operation,
    operands : [
      {
        value: isNumber1 ? numericValue1 : inV1,
        isNumber: isNumber1
      },
      {
        value: isNumber2 ? numericValue2 : inV2,
        isNumber: isNumber2
      }
    ],
    target: outV
  };
}

const parseInstruction = (inString) => {
  const tokens = inString.match(/[a-z0-9]+/gm);
  const operation = inString.match(/[A-Z]+/gm);
  if(tokens.length == 2) {
    if(operation) {
      return unaryOperation(tokens[0], operation[0], tokens[1]);
    } else {
      return unaryOperation(tokens[0], 'ASSIGN', tokens[1]);
    }
  } else {
    return binaryOperation(tokens[0], operation[0], tokens[1], tokens[2]);
  }
}

const canExecute = (instruction, state) => {
  switch(instruction.operation) {
    case ASSIGN:
    case NOT:
      return instruction.operands[0].isNumber ||
              state.hasOwnProperty(instruction.operands[0].value);
    case AND:
    case OR:
    case LSHIFT:
    case RSHIFT:
      return (instruction.operands[0].isNumber ||
              state.hasOwnProperty(instruction.operands[0].value)) &&
              (instruction.operands[1].isNumber ||
                state.hasOwnProperty(instruction.operands[1].value));
  }
}

const execute = (instruction, state) => {
  //console.log('executing!');
  //console.log(instruction);
  let out = { ...state };
  const { operation, target, operands } = instruction;
  let a = operands[0].isNumber ? operands[0].value : out[operands[0].value];
  let b = 0;
  if(operands.length > 1) {
    b = operands[1].isNumber ? operands[1].value : out[operands[1].value];
  }
  switch(operation) {
    case ASSIGN:
      out[target] = a;
      break;
    case NOT:
      out[target] = (~a) + 2**16; //WHYTHO?
      break;
    case AND:
      out[target] = a & b;
      break;
    case OR:
      out[target] = a | b;
      break;
    case LSHIFT:
      out[target] = a << b;
      break;
    case RSHIFT:
      out[target] = a >> b;
      break;
  }

  return out;
}

exports.solver = function(input) {
  /*input = `123 -> x
456 -> y
y -> q
x AND y -> d
x OR y -> e
x LSHIFT 2 -> f
y RSHIFT 2 -> g
NOT x -> h
NOT y -> i`;*/

  let state = {};

  let instructions = input.split('\n').map(parseInstruction);

  while(instructions.length) {
    for(let i = 0; i < instructions.length; i++) {
      if(canExecute(instructions[i], state)) {
        state = execute(instructions[i], state);
        instructions.splice(i, 1);
        break;
      }
    }
  }

  const answerA = state.a;

  state = { b: state.a };

  instructions = input.split('\n').map(parseInstruction);

  while(instructions.length) {
    for(let i = 0; i < instructions.length; i++) {
      if(canExecute(instructions[i], state)) {
        state = execute(instructions[i], state);
        instructions.splice(i, 1);
        break;
      }
    }
  }

  return `Cable a carries the signal ${answerA}.
After setting b to a and resetting, a carries ${state.a}`;
}
