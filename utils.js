const fs = require('fs');
const fsp = require('fs').promises;

const solveDay = (day) => {
  const solver = require('./solvers/day' + day).solver;

  return fsp.readFile('./inputs/day' + day + '.txt', {encoding: 'utf-8'}).then((input) => {
    input = input.replace(/(\r\n$|\n$|\r$)/gm, '');

    const output = solver(input);

    if(output !== null) {
      if(output) {
        console.log(output);
        console.log('\n');
      }
    } else {
      console.log('Solver not implemented yet!\n\n');
    }
  }).catch((e) => {
    console.log(e);
    //console.log('Input not found!');
  });
}

const dayDriver = (day, endDay) => {
  if(day <= endDay) {
    console.log('=================================');
    console.log(`Day ${day}:`)
    console.log('=================================');

    const inputFile = `./inputs/day${day}.txt`

    if(fs.existsSync(inputFile)) {
      solveDay(day).then(() => dayDriver(day+1, endDay));
    } else {
      console.log('No input found.\n\n');
      dayDriver(day + 1, endDay);
    }
  }
}

let swap = function (array, index1, index2) {
  var temp = array[index1];
  array[index1] = array[index2];
  array[index2] = temp;
  return array;
}

let permutationHeap = function (array, result, n) {
  n = n || array.length; // set n default to array.length
  if (n === 1) {
    result([...array]);
  } else {
    for (var i = 1; i <= n; i++) {
      permutationHeap(array, result, n - 1);
      if (n % 2) {
        swap(array, i - 1, n - 1); // when length is odd so n % 2 is 1,  select the first number, then the second number, then the third number. . . to be swapped with the last number
      } else {
        swap(array, 0, n - 1); // when length is even so n % 2 is 0,  always select the first number with the last number
      }
    }
  }
}

exports.solveDay = solveDay;
exports.dayDriver = dayDriver;
exports.permutationHeap = permutationHeap;
