exports.solver = function(input) {
  let steps = input.split('');
  let floor = 0;
  let firstBelow0 = 0;
  for(let i = 0; i < steps.length; i++) {
    if(steps[i] == '(') {
      floor++;
    } else {
      floor--;
    }

    if(firstBelow0 == 0 && floor < 0) {
      firstBelow0 = i + 1;
    }
  }
  return (`Santa ends up on floor ${floor}
Step ${firstBelow0} first takes him to the basement.`);
}
