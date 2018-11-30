const permutationHeap = require('../utils').permutationHeap;

const parseSeating = (x) => {
  // Alice would lose 2 happiness units by sitting next to Bob.
  const components = x.match(/^(.*) would (.*) ([0-9]+) .* (.*)\.$/);
  return {
    from: components[1],
    to: components[4],
    happiness: (components[2] === 'lose' ? -1 : 1)*components[3]
  };
}

const findHappiestSeating = (happies) => {
  let perms = [];
  permutationHeap(happies.map((e, i) => i), (x) => perms.push(x));
  let happiestSeating = null;
  let happiest = 0;
  for(let i = 0; i < perms.length; i++) {
    let h = 0;
    let perm = perms[i];
    const n = perm.length;
    for(let j = 0; j < n; j++) {
      const a = perm[j];
      const b = perm[j == (n-1) ? 0 : j+1];
      h += happies[a][b] + happies[b][a];
    }
    if(h > happiest) {
      happiest = h;
      happiestSeating = [...perm];
    }
  }
  return {
    score: happiest,
    seating: happiestSeating
  };
}

exports.solver = function(input) {
  let preferences = input.split('\n').map(parseSeating);

  /*const people = [...preferences.reduce((s, e) => {
    const ePeeps = new Set([e.from, e.to]);
    return new Set([...s, ...ePeeps]);
  }, new Set())];*/

  const people = [...(new Set([...preferences.reduce((s, e) => {
    s.push(e.from);
    s.push(e.to);
    return s;
  }, [])]))];

  preferences = preferences.map((e) => {
    return {
      ...e,
      fromI: people.indexOf(e.from),
      toI: people.indexOf(e.to)
    };
  });

  let happies = [];
  for(let i = 0; i < people.length; i++) {
    let row = [];
    for(let j = 0; j < people.length; j++) {
      row.push(0);
    }
    happies.push(row);
  }

  for(let i = 0; i < preferences.length; i++) {
    const {fromI, toI, happiness} = preferences[i];
    happies[fromI][toI] = happiness;
  }

  // w/evs
  const withoutMe = findHappiestSeating(happies);

  const happiestNames = withoutMe.seating.reduce((s, e) => {
    if(s.length > 0) {
      s += ' -> ';
    }
    return s + people[e];
  }, '');


  people.push('Moi');
  happies = happies.map((x) => {
    x.push(0)
    return x;
  });
  let meRow = [];
  for(let i = 0; i <= happies.length; i++) {
    meRow.push(0);
  }
  happies.push(meRow);

  const withMe = findHappiestSeating(happies);
  const happiestNames2 = withMe.seating.reduce((s, e) => {
    if(s.length > 0) {
      s += ' -> ';
    }
    return s + people[e];
  }, '');

  return `The optimal seating arrangement results in  ${withoutMe.score} happies.
${happiestNames}.

After I join it's ${withMe.score}:
${happiestNames2}`
}
