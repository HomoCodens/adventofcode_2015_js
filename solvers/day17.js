const isValidCombination = (mask, capacities, target) => {
  let amount = 0;
  let possibleHit = true;
  for(var i = 0; i < capacities.length; i++) {
    amount += ((mask & (1 << i)) > 0) * capacities[i];
    possibleHit &= amount <= target;
    if(!possibleHit) {
      return false;
    }
  }
  return amount == target;
}

const getNBits = (mask, length) => {
  let bits = 0;
  for(var i = 0; i < length; i++) {
    bits += (mask & 1 << i) > 0;
  }
  return bits;
}

exports.solver = function(input) {
  const capacities = input.split('\n').map((x) => Number.parseInt(x));

  const nContainers = capacities.length;
  const masks = new Array(2**nContainers).fill(0).map((x, i) => i);

  const validCombinations = masks.filter((mask) => isValidCombination(mask, capacities, 150));

  console.log(`Playing with all our containers, we can fit the eggnog ${validCombinations.length} different ways`);

  let bits = validCombinations.map((mask) => getNBits(mask, nContainers));
  let minBits = bits.reduce((acc, x) => acc > x ? x : acc);
  let combinationsWithMinbits = validCombinations.filter((x, i) => bits[i] == minBits);

  console.log(`Minimum number of containers is ${minBits} yielding ${combinationsWithMinbits.length} possible combinations.`)
}
