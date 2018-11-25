exports.solver = function(input) {
  let nNice = 0;
  const words = input.split('\n');

  /*const words = [
    'ugknbfddgicrmopn',
    'aaa',
    'jchzalrnumimnmhp',
    'haegwjzuvuyypxyu',
    'dvszwmarrgswjxmb'
  ];*/

  for(let i = 0; i < words.length; i++) {
    let word = words[i];
    if(word.match(/(?:[aeiou].*){3,}/)) {
      if(word.match(/(?<anyletter>[a-z])\k<anyletter>/)) {
        if(word.match(/(ab|cd|pq|xy)/) === null) {
          //console.log(word + ' is nice');
          nNice++;
        } else {
          //console.log(word + ' fails third rule!');
        }
      } else {
        //console.log(word + ' fails second rule!');
      }
    } else {
      //console.log(word + ' fails first rule!');
    }
  }

  const nNiceNew = words.reduce((s, w) => {
    if(w.match(/(?<anyletter>[a-z]).\k<anyletter>/)) {
      if(w.match(/(?<anypair>[a-z]{2}).*\k<anypair>/)) {
        return s + 1;
      }
    }

    return s;
  }, 0);

  return `There are ${nNice} nice words. According to the new regime there are ${nNiceNew}.`;
}
