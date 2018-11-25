exports.solver = function(input) {
  const instructions = input.split('\n');

  let lights = [];
  let dimmableLights = [];
  for(let r = 0; r < 1000; r++) {
    let row = [];
    let dimmableRow = [];
    for(let c = 0; c < 1000; c++) {
      row.push(0);
      dimmableRow.push(0);
    }
    lights.push(row);
    dimmableLights.push(dimmableRow);
  }


  for(let i = 0; i < instructions.length; i++) {
    const instr = instructions[i];
    const coords = instr.match(/([0-9]+)/g).map((x) => Number.parseInt(x));
    const rStart = coords[1];
    const rEnd = coords[3];
    const cStart = coords[0];
    const cEnd = coords[2];

    let mode = 0;
    if(instr.startsWith('turn on')) {
      mode = 1;
    } else if(instr.startsWith('turn off')) {
      mode = -1;
    }

    for(let r = rStart; r <= rEnd; r++) {
      for(let c = cStart; c <= cEnd; c++) {
        switch(mode) {
          case -1:
            lights[r][c] = 0;
            dimmableLights[r][c] = Math.max(0, dimmableLights[r][c] - 1);
          break;
          case 0:
            lights[r][c] = lights[r][c] === 0 ? 1 : 0;
            dimmableLights[r][c] += 2;
          break;
          case 1:
            lights[r][c] = 1;
            dimmableLights[r][c] += 1;
          break;
        }
      }
    }
  }

  const lightsOn = lights.reduce((s, e) => {
    return s + e.reduce((ss, ee) => {
      return ss + ee;
    }, 0);
  }, 0);

  const totalBrightness = dimmableLights.reduce((s, e) => {
    return s + e.reduce((ss, ee) => {
      return ss + ee;
    }, 0);
  }, 0);

  return `${lightsOn} lights will be on.
After the fix, the total brightness is ${totalBrightness}.`;
}
