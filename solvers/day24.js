// Leaving these here as amonument to Eric the Great Deceiver
const getEntanglement = (weights, placements) => {
  return weights.reduce((acc, x, i) => {
    if(placements[i] == 2) {
      acc *= x;
    }
    return acc
  }, 1);
}

const balanceSleigh = (weights, remainingWeight, compartmentAmounts, compartmentWeights, placements, prevBest, index) => {
  // Bottom
  if(index == weights.length) {
    if(compartmentWeights[0] == compartmentWeights[1] && compartmentWeights[1] == compartmentWeights[2]) {
      let entanglement = getEntanglement(weights, placements);
      if((compartmentAmounts[2] < prevBest.compartmentAmounts[2]) || 
          (compartmentAmounts[2] == prevBest.compartmentAmounts[2] && 
            entanglement < prevBest.entanglement)) {
              console.log('new best', {
                placements: [...placements],
                compartmentAmounts: [...compartmentAmounts],
                compartmentWeights: [...compartmentWeights],
                entanglement
              });
        return {
          placements: [...placements],
          compartmentAmounts: [...compartmentAmounts],
          compartmentWeights: [...compartmentWeights],
          entanglement
        };
      }
    }

    return prevBest;
  }

  // Pruning the Billion Tree
  if(compartmentAmounts[2] > prevBest.compartmentAmounts[2]) {
    return prevBest;
  } else if(compartmentAmounts[2] == prevBest.compartmentAmounts[2]) {
    if(getEntanglement(weights, placements) >= prevBest.entanglement) {
      return prevBest;
    }
  }

  let heaviestCompartment = Math.max(...compartmentWeights);
  let weightNeededForBalance = compartmentWeights.reduce((acc, x) => acc + heaviestCompartment - x, 0);
  if(remainingWeight < weightNeededForBalance) {
    return prevBest;
  }

  let myBest = prevBest;
  remainingWeight -= weights[index];
  for(let place = 0; place < 3; place++) {
    compartmentAmounts[place] += 1;
    compartmentWeights[place] += weights[index];
    placements[index] = place;
    let nextBest = balanceSleigh(weights, remainingWeight, [...compartmentAmounts], [...compartmentWeights],
                                  [...placements], myBest, index + 1);
    if(nextBest.compartmentAmounts[2] < myBest.compartmentAmounts[2] || 
        (nextBest.compartmentAmounts[2] == myBest.compartmentAmounts[2] && 
          nextBest.entanglement < myBest.entanglement)) {
      myBest = nextBest;
    }
    compartmentAmounts[place] -= 1;
    compartmentWeights[place] -= weights[index];
  }
  placements[index] = 0;
  remainingWeight += weights[index];

  return myBest;
}

const knapTheSack = (weights, weightsUsed, currentWeight, targetWeight, prevBest, index) => {
  const isBetterThanYou = (myWeights, you) => {
    if(myWeights.length < you.weightsUsed.length) {
      return true;
    } else if(myWeights.length == you.weightsUsed.length) {
      let entanglement = myWeights.reduce((acc, x) => acc * x);
      return entanglement < you.entanglement;
    }

    return false;
  }

  if(currentWeight > targetWeight) {
    return prevBest;
  } else if(currentWeight == targetWeight) {
    if(isBetterThanYou(weightsUsed, prevBest)) {
        let best = {
          entanglement: weightsUsed.reduce((acc, x) => acc * x), 
          weightsUsed: [...weightsUsed]
        };
        return best;
    } else {
      return prevBest;
    }
  }
  

  if(index == weights.length) {
    return prevBest;
  }
  
  let myBest = prevBest;
  weightsUsed.push(weights[index]);
  currentWeight += weights[index];
  let nextBest = knapTheSack(weights, [...weightsUsed], currentWeight, targetWeight, myBest, index + 1);
  if(isBetterThanYou(nextBest.weightsUsed, myBest)) {
    myBest = nextBest;
  }
  weightsUsed.pop();
  currentWeight -= weights[index];
  nextBest = knapTheSack(weights, [...weightsUsed], currentWeight, targetWeight, myBest, index + 1);
  if(isBetterThanYou(nextBest.weightsUsed, myBest)) {
    myBest = nextBest;
  }

  return myBest;
}

exports.solver = function(input) {
  let weights = input.split('\n').map((x) => Number.parseInt(x));
  let totalWeight = weights.reduce((acc, x) => acc + x);
  let targetWeight = totalWeight/3;

  let solutionPart1 = knapTheSack(weights, [], 0, targetWeight, {entanglement: 99999999999999, weightsUsed: [...weights]}, 0);
  
  let targetWeight2 = totalWeight/4; // You evil man you
  let solutionPart2 = knapTheSack(weights, [], 0, targetWeight2, {entanglement: 99999999999999, weightsUsed: [...weights]}, 0);

  console.log(`The best quantum entanglement has ${solutionPart1.weightsUsed.length} items in the passenger seat and QE of ${solutionPart1.entanglement}`);
  console.log(`Using all that sweet space in the trunk brings QE down to ${solutionPart2.entanglement}`);
}
