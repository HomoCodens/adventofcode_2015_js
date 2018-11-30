const parseReindeerStats = (deer) => {
  // Vixen can fly 19 km/s for 7 seconds, but then must rest for 124 seconds.
  const components = deer.match(/(.*) can fly (\d+) .* (\d+) .* (\d+)/);
  const speed = Number.parseInt(components[2]);
  const fly = Number.parseInt(components[3]);
  const rest = Number.parseInt(components[4]);
  return {
    name: components[1],
    speed,
    fly,
    rest
  };
}

const positionAtTime = (deer, t) => {
  const {speed, fly, rest} = deer;
  const cycleLength = fly + rest;
  const nCompletedCycles = Math.floor(t/cycleLength);
  return nCompletedCycles*speed*fly +
                    speed*Math.min(fly, t % cycleLength);
}

exports.solver = function(input) {
  let reindeers /*FROZEN!*/ = input.split('\n').
                                      map(parseReindeerStats).
                                      map((d) => {
                                        return {
                                          ...d,
                                          score: 0,
                                          distance: 0
                                        };
                                      });

  const contestLength = 2503;

  for(let t = 1; t <= contestLength; t++) {
      reindeers = reindeers.map((deer) => {
        return {
          ...deer,
          distance: positionAtTime(deer, t)
        };
      }).sort((a, b) => b.distance - a.distance);

      for(let s = 0;
            s < reindeers.length &&
              reindeers[s].distance === reindeers[0].distance;
            s++) {
        reindeers[s].score++;
      }
  }

  const scoreRanking = [...reindeers].sort((a, b) => b.score - a.score);

  const {name: winner, distance: winningDist} = reindeers[0];
  const {name: winnerByScore, score} = scoreRanking[0];
  return `The winnar is ${winner} at ${winningDist}
With scores and stuff, ${winnerByScore} wins it with ${score} poinz`
}
