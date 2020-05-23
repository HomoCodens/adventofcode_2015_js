const parseSue = (line) => {
  /*Sue 1: cars: 9, akitas: 3, goldfish: 0
    Sue 2: akitas: 9, children: 3, samoyeds: 9*/
  let idParts = line.match(/Sue (\d+): (.*)/);
  let id = Number.parseInt(idParts[1]);
  let properties = idParts[2].split(', ').map((x) => {
    let parts = x.split(': ');
    return [parts[0], Number.parseInt(parts[1])];
  }).reduce((acc, x) => {
    acc[x[0]] = x[1];
    return acc;
  }, {});

  properties.id = id;
  return properties;
}

exports.solver = function(input) {
  let detectedProperties = {
    children: 3,
    cats: 7,
    samoyeds: 2,
    pomeranians: 3,
    akitas: 0,
    vizslas: 0,
    goldfish: 5,
    trees: 3,
    cars: 2,
    perfumes: 1
  };

  let auntsSue = input.split('\n').map(parseSue);

  let auntieSueSue = auntsSue.filter((sue) => {
    for(const [k, v] of Object.entries(detectedProperties)) {
      if(sue[k] !== undefined && sue[k] !== v) {
        return false;
      }
    }

    return true;
  })[0];

  console.log(`Obviously the present came from Aunt Sue ${auntieSueSue.id}`);

  let auntieSueDiscombobulated = auntsSue.filter((sue) => {
    let her = true;
    for(const [k, v] of Object.entries(detectedProperties)) {
      if(sue[k] !== undefined) {
        if(k === 'cats' || k === 'trees') {
          her &= sue[k] > v;
        } else if(k === 'pomeranians' || k === 'goldfish') {
          her &= sue[k] < v;
        } else {
          her &= sue[k] === v;
        }
      }
    }
    return her;
  })[0];

  console.log(`After recalibrating the fwumbaderian circuits, turns out it was Aunt Sue nr. ${auntieSueDiscombobulated.id}`);
}
