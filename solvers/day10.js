exports.solver = function(input) {
  const nIt1 = 40;
  const nIt2 = 50;
  let length1 = 0;
  let sequence = input;
  for(let i = 0; i < nIt2; i++) {
    const elements = sequence.split('');
    sequence = '';
    let pos = 0;
    let currentChar = elements[0];
    while(pos < elements.length) {
      let count = 1;
      while(currentChar === elements[++pos]){
        count++;
      }
      sequence += `${count}${currentChar}`;
      currentChar = elements[pos];
    }

    if(i == nIt1 - 1) {
      length1 = sequence.length;
    }
  }

  return `After ${nIt1} iterations, the sequence has length ${length1}
After another ${nIt2 - nIt1} that's ${sequence.length}`;
}
