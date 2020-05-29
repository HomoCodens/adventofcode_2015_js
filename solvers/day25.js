/*
   | 1   2   3   4   5   6  
---+---+---+---+---+---+---+
 1 |  1   3   6  10  15  21
 2 |  2   5   9  14  20
 3 |  4   8  13  19
 4 |  7  12  18
 5 | 11  17
 6 | 16

 1) The first element of a row has index 1+sum(1:(r-1))
 2) The cth element of a row has index r0 + sum(seq((r+1), length.out = c))
 */

const getIndex = (row, col) => {
  let r0 = 1;
  for(let i = 1; i < row; i++) {
    r0 += i;
  }

  let index = r0;
  for(let i = 0; i < col-1; i++) {
    index += row + 1 + i;
  }

  return index;
}

const getNext = (current) => (current * 252533) % 33554393

// Oh, looks like he went easy on us this time
const getCycle = (first) => {
  let cycleLength = 1;
  let current = first;
  while((current = getNext(current)) != first) {
    cycleLength++;
  }
  return cycleLength;
}

exports.solver = function(input) {

  const row = Number.parseInt(input.match('row ([0-9]+)')[1]);
  const col = Number.parseInt(input.match('column ([0-9]+)')[1]);

  const index = getIndex(row, col);

  let current = 20151125;
  for(let i = 0; i < index-1; i++) {
    current = getNext(current);
  }

  console.log(current);
}
