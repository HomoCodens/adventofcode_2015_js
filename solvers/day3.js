exports.solver = function(input) {
  const directions = input.split('');

  let coordinates = {};
  let x = y = 0;

  for(let i = 0; i < directions.length; i++) {
    switch(directions[i]) {
      case '^':
        y++;
      break;
      case 'v':
        y--;
      break;
      case '<':
        x--;
      break;
      case '>':
        x++;
      break;
    }

    coordinates['[' + x + '-' + y + ']'] = true;
  }

  const soloSantaHouses = Object.keys(coordinates).length;

  let teamCoordinates = [{}, {}];
  let teamX = [0, 0];
  let teamY = [0, 0];
  let ROBO_SANTA = 0;
  let REAL_SANTA = 1;

  for(let i = 0; i < directions.length; i += 2) {
    for(let j = ROBO_SANTA; j <= REAL_SANTA; j++) {
      switch(directions[i + j]) {
        case '^':
          teamY[j]++;
        break;
        case 'v':
          teamY[j]--;
        break;
        case '<':
          teamX[j]--;
        break;
        case '>':
          teamX[j]++;
        break;
      }
      teamCoordinates[j]['[' + teamX[j] + '-' + teamY[j] + ']'] = true;
    }
  }

  const santaHouses = new Set(Object.keys(teamCoordinates[REAL_SANTA]));
  const roboSantaHouses = new Set(Object.keys(teamCoordinates[ROBO_SANTA]));
  const teamHouses = new Set([...santaHouses, ...roboSantaHouses]);
  const teamHousesCount = teamHouses.size;

  return `Santa on his own delivers presents to ${soloSantaHouses} children
together with RoboSanta, they cover ${teamHousesCount} houses.`
}
