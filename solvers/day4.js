const md5 = require('md5');

exports.solver = function(secret) {
  let i = 1;
  let hashValue = '';
  while(hashValue.substr(0, 5) !== '00000') {
    hashValue = md5(secret + i);
    process.stdout.write(`hashin... ${secret+i}: ${hashValue}\r`);
    i++;
  }

  process.stdout.write('\n');
  console.log('Got the one with 5 leading 0s');

  const leading5 = i-1;

  while(hashValue.substr(0, 6) !== '000000') {
    hashValue = md5(secret + i);
    process.stdout.write(`hashin... ${secret+i}: ${hashValue}\r`);
    i++;
  }

  const leading6 = i-1;

  process.stdout.write('\n');

  return `The value for the 5ercoin is ${leading5}, the 6er is ${leading6}`;

}
