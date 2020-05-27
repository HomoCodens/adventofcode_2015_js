// Kinda burned out on the turing machines atm...

const parseInstruction = (line) => {
  let [match, instruction, register, offset] = line.match("([a-z]{3}) (?:([ab])(?:, )?)?(?:(.+))?");
  if(instruction == 'inc' || instruction == 'tpl' || instruction == 'hlf') {
    return {
      instruction,
      register
    }
  } else if(instruction == 'jmp') {
    return {
      instruction,
      offset: Number.parseInt(offset)
    }
  } else {
    return {
      instruction,
      register,
      offset: Number.parseInt(offset)
    }
  }
}

const applyInstruction = (state, instructions) => {
  let {instruction, register, offset} = instructions[state.ptr];
  if(instruction == 'inc') {
    state[register]++;
    state.ptr++;
  } else if(instruction == 'tpl') {
    state[register] *= 3;
    state.ptr++;
  } else if(instruction == 'hlf') {
    state[register] /= 2;
    state.ptr++;
  } else if(instruction == 'jmp') {
    state.ptr += offset;
  } else if(instruction == 'jie') {
    if(state[register] % 2 == 0) {
      state.ptr += offset;
    } else {
      state.ptr++;
    }
  } else if(instruction == 'jio') {
    if(state[register] == 1) {
      state.ptr += offset;
    } else {
      state.ptr++;
    }
  }

  return state;
}

const run = (state, instructions) => {
  while(state.ptr >= 0 && state.ptr < instructions.length) {
    state = applyInstruction(state, instructions);
  }
  return state;
}

exports.solver = function(input) {
  let instructions = input.split('\n').map(parseInstruction);
  
  let state = {
    a: 0,
    b: 0,
    ptr: 0
  };

  state = run(state, instructions);
  console.log(`after running the b is the ${state.b}`);

  let state2 = {
    a: 1,
    b: 0,
    ptr: 0
  };

  state2 = run(state2, instructions);

  console.log(`with a = 1 b becomes ${state2.b}`)
}
