const fs = require('fs').promises;

var startDay = 1;
var endDay = 25;
const dayParam = process.argv[2];

console.log(dayParam);

if(dayParam !== undefined) {
  startDay = dayParam;
  endDay = dayParam;
}

for(var day = startDay; day <= endDay; day++) {
  const solver = require('./solvers/day' + day).solver;

  fs.readFile('./inputs/day' + day + '.txt').then((input) => {
    const output = solver(input);

    console.log('=================================');
    console.log(`Day ${day}:`)
    console.log('=================================');

    if(output !== null) {
      console.log(output);
    } else {
      console.log('Solver not implemented yet!');
    }
  }).catch((e) => {
    //console.log('Input not found!');
  });
}
