const nNeighbors = (row, col, life) => {
  let nAlive = 0;
  for(var i = row - 1; i <= row + 1; i++) {
    if(i >= 0 && i < life.length) {
      for(var j = col - 1; j <= col + 1; j++) {
        if(!(i == row && j == col) && j >= 0 && j < life[0].length) {
          nAlive += life[i][j] == '#';
        }
      }
    }
  }
  return nAlive;
}

const evolve = (life, cornersStuck) => life.map((row, ri) => row.map((cell, ci) => {
    let nNeighborsAlive = nNeighbors(ri, ci, life);
    if(cornersStuck &&
        ((ri == 0 && ci == 0) ||
          (ri == 0 && ci == life[0].length - 1) ||
          (ri == life.length - 1 && ci == 0) ||
          (ri == life.length - 1 && ci == life[0].length - 1))) {
            return '#';
          }
    return nNeighborsAlive == 3 || (cell == '#' && nNeighborsAlive == 2) ? '#' : '.';
  }));

const printLife = (life) => {
  life.forEach(row => {
    console.log(row.join(''));
  });
}

const run = (life, steps, cornersStuck) => {
  life = life.map((r) => [...r]);
  for(let i = 0; i < 100; i++) {
    life = evolve(life, cornersStuck);
  }
  return life;
}

exports.solver = function(input) {
  let life = input.split('\n').map((l) => l.split(''));

  let lifePart1 = run(life, 100, false);
  let nAlvieAfter100 = lifePart1.reduce((acc, row) => acc += row.reduce((acc, cell) => acc += (cell == '#'), 0), 0);
  
  console.log(`After 100 steps, ${nAlvieAfter100} lights are alive, err... lit.`);
  
  let lifePart2 = run(life, 100, true);
  let nAlvieAfter100CornersStuck = lifePart2.reduce((acc, row) => acc += row.reduce((acc, cell) => acc += (cell == '#'), 0), 0);
  
  console.log(`With the corners always on, ${nAlvieAfter100CornersStuck} lights are alive.`);

}