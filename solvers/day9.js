const heapADeap = (n, aIn) => {
  let out = [];
  const a = [...aIn];
  if(n === 1) {
    out.push(a);
  } else {
    for(let i = 0; i < n - 1; i++) {
      out = out.concat(heapADeap(n-1, a));
      if((n % 2) === 0) {
        let t = a[i];
        a[i] = a[n-1];
        a[n-1] = t;
      } else {
        let t = a[0];
        a[0] = a[n-1];
        a[n-1] = t;
      }
    }
    //out = out.concat(heapADeap(n-1, a));
  }
  return out;
}

const parseConnection = (x) => {
  const components = x.match(/(.*) to (.*) = (.*)/);
  return {
    from: components[1],
    to: components[2],
    dist: Number.parseInt(components[3])
  };
}

let swap = function (array, index1, index2) {
  var temp = array[index1];
  array[index1] = array[index2];
  array[index2] = temp;
  return array;
};

let permutationHeap = function (array, result, n) {
  n = n || array.length; // set n default to array.length
  if (n === 1) {
    result([...array]);
  } else {
    for (var i = 1; i <= n; i++) {
      permutationHeap(array, result, n - 1);
      if (n % 2) {
        swap(array, i - 1, n - 1); // when length is odd so n % 2 is 1,  select the first number, then the second number, then the third number. . . to be swapped with the last number
      } else {
        swap(array, 0, n - 1); // when length is even so n % 2 is 0,  always select the first number with the last number
      }
    }
  }
};

exports.solver = function(input) {

  let connections = input.split('\n').map(parseConnection);
  const stops = [...connections.reduce((s, e) => {
    const eStops = new Set([e.from, e.to]);
    return new Set([...s, ...eStops]);
  }, new Set())];

  connections = connections.map((e) => {
    return {
      ...e,
      fromI: stops.indexOf(e.from),
      toI: stops.indexOf(e.to)
    };
  });

  let dists = [];
  for(let i = 0; i < stops.length; i++) {
    let row = [];
    for(let j = 0; j < stops.length; j++) {
      row.push(0);
    }
    dists.push(row);
  }

  for(let i = 0; i < connections.length; i++) {
    const {fromI, toI, dist} = connections[i];
    dists[fromI][toI] = dist;
    dists[toI][fromI] = dist;
  }

  // Just about manageable with 8 locations
  //const perms = heapADeap(stops.length, stops.map((e, i) => i));

  // w/evs
  let perms = [];
  permutationHeap(stops.map((e, i) => i), (x) => perms.push(x));

  let optPathShort = null;
  let optDistShort = Infinity;
  let optPathLong = null;
  let optDistLong = 0;
  for(let i = 0; i < perms.length; i++) {
    let d = 0;
    let perm = perms[i];
    for(let j = 0; j < perm.length - 1; j++) {
      d += dists[perm[j]][perm[j+1]];
    }
    if(d < optDistShort) {
      optDistShort = d;
      optPathShort = [...perm];
    }
    if(d > optDistLong) {
      optDistLong = d;
      optPathLong = [...perm];
    }
  }

  const santasPathShort = optPathShort.reduce((s, e) => {
    if(s.length > 0) {
      s += ' -> ';
    }
    return s + stops[e];
  }, '');

  const santasPathLong = optPathLong.reduce((s, e) => {
    if(s.length > 0) {
      s += ' -> ';
    }
    return s + stops[e];
  }, '');

  return `The optimal path takes Santa ${optDistShort}.
${santasPathShort}.

The longest path is ${optDistLong} long.
${santasPathLong}`
}
