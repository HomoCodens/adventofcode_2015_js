// 'cause if it's worth killing, it's worth running over
// with an atomic jackhammer
function SantaPassword(password) {
  this.chars = [];
  for(let i = 0; i < password.length; i++) {
    this.chars.push(password.charCodeAt(i));
  }
}

SantaPassword.prototype.bump = function() {
  const minChar = 'a'.charCodeAt(0);
  const maxChar = 'z'.charCodeAt(0);
  let pos = this.chars.length - 1;

  while(this.chars[pos]++ >= maxChar && pos >= 0) {
    this.chars[pos] = minChar;
    pos--;
  }

  process.stdout.write(`\r${this.toString()}`)

  return this;
}

SantaPassword.prototype.bumpToValid = function() {
  while(!this.bump().isValid()) {
  }
  return this;
}

SantaPassword.prototype.isValid = function() {
  const forbidden = 'iol';
  let forbiddenChars = [];
  for(let i = 0; i < forbidden.length; i++) {
    forbiddenChars.push(forbidden.charCodeAt(i));
  }

  const chars = this.chars;
  let straightLength = 0;
  let containsStraight = false;
  let pairRun = 0;
  let nPairs = 0;
  let pairChars = new Set();
  for(let i = 0; i < chars.length; i++) {
    if(forbiddenChars.indexOf(chars[i]) >= 0) {
      return false;
    }

    if(i > 0) {
      if((chars[i] - chars[i-1]) == 1) {
        straightLength++;
        if(straightLength >= 2) {
          containsStraight = true;
        }
      } else {
        straightLength = 0;
      }

      if((chars[i] - chars[i-1]) == 0) {
        pairRun++;
        if(pairRun % 2) {
          nPairs++;
          pairChars.add(chars[i]);
        }
      } else {
        pairRun = 0;
      }
    }
  }

  return nPairs >= 2 && pairChars.size >= 2 && containsStraight;
}

SantaPassword.prototype.toString = function() {
  return this.chars.
                map((x) => String.fromCharCode(x)).
                join('');
}

exports.solver = function(input) {
  let pw = new SantaPassword(input);
  const nextPw1 = pw.bumpToValid().toString();
  process.stdout.write('\n');
  const nextPw2 = pw.bumpToValid().toString();
  process.stdout.write('\n');
  return `The next valid password is ${nextPw1}
And after that: ${nextPw2}`;
}
