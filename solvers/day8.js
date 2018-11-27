exports.solver = function(input) {
  const words = input.split('\n');

  const codeLength = words.reduce((s, e) => {
    return s + e.length;
  }, 0);

  const memoryLength = words.reduce((s, e) => {
    return s + e.replace(/^"(.*)"$/g, '$1').
                  replace(/\\\"/g, 'q').
                  replace(/\\x[0-9a-f]{2}/g, 'a').
                  replace(/\\\\/g, 's').length;
  }, 0);

  const escapedLength = words.reduce((s, e) => {
    return s + e.replace(/\\/g, '\\\\').
                  replace(/"/g, '\\\"').length + 2;
  }, 0);

  return `The difference code - memory is ${codeLength - memoryLength}
The difference escaped - code is ${escapedLength - codeLength}`;
}
