const getNPresents = (houseNo) => {
  let presents = 0;
  let to = Math.sqrt(houseNo);
  for(let i = 1; i <= to; i++) {
    if(!(houseNo % i)) {
      presents += i;

      if(i != to) {
        presents += houseNo/i;
      }
    }
  }

  return 10*presents;
}

const getNPresents2 = (houseNo) => {
  let to = Math.sqrt(houseNo);
  let presents = 0;
  for(let i = 1; i <= to; i++) {
    if(!(houseNo % i)) {
      if(50*i >= houseNo) {
        presents += i;
      }

      if(i != to && 50*(houseNo/i) >= houseNo) {
        presents += houseNo/i;
      }
    }
  }

  return 11*presents;
}

exports.solver = function(input) {
  let target = Number.parseInt(input.trim());

  let house = 1;

  while(getNPresents(house) < target) {
    house++;
  }

  console.log(`And the lucky winner lives in house... ${house}!`)

  let house2 = 1;
  while(getNPresents2(house2) < target) {
    house2++;
  }

  console.log(`When not overworking the elves, the solushan is ${house2}`);
}
