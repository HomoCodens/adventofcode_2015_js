const elfAccounting = (books) => {
  //console.log(books);
  switch(typeof books) {
    case 'string':
      //console.log('\'s a string');
      return 0;
    case 'number':
      //console.log('\'s a number')
      return books;
    // Also works on arrays
    case 'object':
      //console.log('\'s an object')
      const vals = Object.values(books);
      if(vals.indexOf('red') >= 0 && !(books instanceof Array)) {
        //console.log('contains "red", pass');
        return 0;
      } else {
        //console.log('going down!');
        return vals.map((x) => elfAccounting(x)).
                      reduce((s, e) => s + e);
      }
  }
}

exports.solver = function(input) {
  // Is this cheating? ;P
  const numbers = input.match(/(-?[0-9]+)/g).
                        map((x) => Number.parseInt(x));
  const sum = numbers.reduce((s, e) => s + e);

  const json = JSON.parse(input);

  /*console.log(elfAccounting(JSON.parse('[1, 2, 3]')));
  console.log(elfAccounting(JSON.parse('[1,{"c":"red","b":2},3]')));
  console.log(elfAccounting(JSON.parse('{"d":"red","e":[1,2,3,4],"f":5}')));
  console.log(elfAccounting(JSON.parse('[1,"red",5]')));*/

  return `The sum of ALL THE NUMBERS is ${sum}
Okok, no red. ${elfAccounting(json)} then.`
}
