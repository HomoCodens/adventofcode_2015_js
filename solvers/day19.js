const parseFormula = (formula) => {
  // Al => ThF
  let parts = formula.split(' => ');
  return {
    ingredient: parts[0],
    outcome: parts[1]
  };
}

const reactify = (prefix, postfix, formula) => {
  let reactionPoint = postfix.indexOf(formula.ingredient);

  if(reactionPoint < 0) {
    // no more ocurrences, wrap up
    return [];
  }

  let nextPostfix = postfix.slice(reactionPoint + formula.ingredient.length);
  let inbetween = postfix.slice(0, reactionPoint);
  let out = reactify(prefix + inbetween + formula.ingredient, nextPostfix, formula);
  out.push(prefix + inbetween + formula.outcome + nextPostfix);
  return out;
}

const runTransmutations = (input, formulas) => {
  let formulaes = formulas.filter((f) => input.indexOf(f.ingredient) >= 0);

  let possibleOutcomes = [];
  for(let formula of formulaes) {
    possibleOutcomes = possibleOutcomes.concat(reactify('', input, formula));
  }

  return possibleOutcomes;
}

exports.solver = function(input) {
  let lines = input.split('\n');

  let target = lines[lines.length - 1];

  lines.pop();

  let formulaes = lines.map(parseFormula);

  let unique = new Set(runTransmutations(target, formulaes));
  
  console.log(`calibration output: ${unique.size}`);

  // Flip them around. Heh!
  formulaes = formulaes.map(({ingredient, outcome}) => {
    return {
      ingredient: new RegExp(outcome, 'g'),
      outcome: ingredient
    }
  });

  let current = target;
  let counter = 0;
  let donesumpn = true;

  // Never thought I'd be dissatisfied with NOT having to write a brute force solution...
  while(donesumpn && current != 'e') {
    donesumpn = false;
    for(const rule of formulaes) {
      for(const m of current.matchAll(rule.ingredient)) {
        donesumpn = true;
        current = current.replace(m, rule.outcome);
        counter++;
      }
    }
  }
  console.log(counter);
}
