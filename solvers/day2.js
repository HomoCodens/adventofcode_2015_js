exports.solver = function(input) {
  let boxes = input.
  split('\n').
  map((line) => {
    const chars = line.split('x');
    return chars.map((x) => Number.parseInt(x)).
                  sort((a, b) => a-b);
  });

  const paper = boxes.reduce((s, e, i) => {
    return s + 2*(e[0]*e[1] +
                      e[1]*e[2] +
                      e[2]*e[0]) +
                      e[0]*e[1];
  }, 0);

  const ribbon = boxes.reduce((s, e, i) => {
    return s + 2*(e[0] + e[1]) + e.reduce((es, ee) => es * ee);
  }, 0);

  return `The elves need ${paper} square feet of paper
and ${ribbon} feet of ribbon.`;
}
