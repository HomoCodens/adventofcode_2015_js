// Let it be known I feel reeeally bad about brute forcing this after
// having studied linear programming at college. But otoh I just can't
// be bothered... at least not in JS.

const parseIngredient = (ingredient) => {
  // Sprinkles: capacity 2, durability 0, flavor -2, texture 0, calories 3
  const components = ingredient.match(/(.*): capacity (-?\d+), durability (-?\d+), flavor (-?\d+), texture (-?\d+), calories (\d+)/); // Negative calories... you wish!
  return {
    name: components[1],
    capacity: Number.parseInt(components[2]),
    durability: Number.parseInt(components[3]),
    flavor: Number.parseInt(components[4]),
    texture: Number.parseInt(components[5]),
    calories: Number.parseInt(components[6])
  };
}

const score = (recipe, ingredients) => {
  let componentScores = {};
  for(comp in ingredients[0]) {
    let tmp = 0;
    for(var i = 0; i < ingredients.length; i++) {
      tmp += recipe[i]*ingredients[i][comp];
    }
    componentScores[comp] = Math.max(0, tmp);
  }

  return componentScores.capacity*componentScores.durability*componentScores.flavor*componentScores.texture;
}

const getCalories = (recipe, ingredients) => recipe.reduce((s, x, i) => s + x*ingredients[i].calories, 0);

const creativeFunctionName = (recipe, level, ingredients, partDeux = false) => {
  let taken = recipe.slice(0, level+1).reduce((s, x) => s + x);
  let mRecipe = [...recipe];
  if(level === ingredients.length - 1) {
    mRecipe[ingredients.length-1] = 100 - taken;
    let mScore = !partDeux || getCalories(mRecipe, ingredients) === 500 ? score(mRecipe, ingredients) : 0;

    return {
      recipe: mRecipe,
      score: mScore
    }
  }

  let maxScore = -1;
  let bestRecipe = {};
  for(var i = 0; i <= 100-taken; i++) {
    mRecipe[level] = i;
    let result = creativeFunctionName(mRecipe, level + 1, ingredients, partDeux);
    if(result.score > maxScore) {
      maxScore = result.score;
      bestRecipe = result;
    }
  }

  return bestRecipe;
}

const prettyRecipe = (cookie, ingredients) => {
  let recipe = '';
  for (const [i, value] of ingredients.entries()) {
    recipe += `${value.name}: ${cookie.recipe[i]}\n`
  }
  recipe += `total score: ${cookie.score}`;
  return recipe;
}

exports.solver = function(input) {
  let ingredients = input.split('\n').map(parseIngredient);

  let bestCookie = creativeFunctionName([0, 0, 0, 0], 0, ingredients);
  console.log(prettyRecipe(bestCookie, ingredients));

  let bestMealReplacement = creativeFunctionName([0, 0, 0, 0], 0, ingredients, true);


  console.log('\nFor a meal replacement, take:');
  console.log(prettyRecipe(bestMealReplacement, ingredients));
}
