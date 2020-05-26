const parseBoss = (boss) => {
  let hp = boss.match(/Hit Points: (\d+)/)[1];
  let dmg = boss.match(/Damage: (\d+)/)[1];

  return {
    hp: Number.parseInt(hp),
    dmg: Number.parseInt(dmg)
  }
}


const cloneState = (gameState) => {
  return {
    boss: {...gameState.boss},
    player: {...gameState.player},
    effects: {...gameState.effects},
    moves: [...gameState.moves],
    playerWins: gameState.playerWins,
    hardMode: gameState.hardMode
  }
}

const spells = [
  {
    name: 'Magic Missile',
    cost: 53,
    cast: (gameState) => {
      let newState = cloneState(gameState);
      newState.boss.hp -= 4;
      newState.player.mana -= 53;
      newState.moves.push(0);
      return newState;
    }
  },
  {
    name: 'Drain',
    cost: 73,
    cast: (gameState) => {
      let newState = cloneState(gameState);
      newState.boss.hp -= 2;
      newState.player.hp += 2;
      newState.player.mana -= 73;
      newState.moves.push(1);
      return newState;
    }
  },
  {
    name: 'Shield',
    cost: 113,
    cast: (gameState) => {
      let newState = cloneState(gameState);
      newState.player.mana -= 113;
      newState.effects.shield = 6;
      newState.moves.push(2);
      return newState;
    }
  },
  {
    name: 'Poison',
    cost: 173,
    cast: (gameState) => {
      let newState = cloneState(gameState);
      newState.player.mana -= 173;
      newState.effects.poison = 6;
      newState.moves.push(3);
      return newState;
    }
  },
  {
    name: 'Recharge',
    cost: 229,
    cast: (gameState) => {
      let newState = cloneState(gameState);
      newState.player.mana -= 229;
      newState.effects.recharge = 5;
      newState.moves.push(4);
      return newState;
    }
  }
];

const applyEffects = (gameState) => {
  let newState = cloneState(gameState);

  let {poison, shield, recharge} = gameState.effects;

  if(shield > 0) {
    newState.effects.shield -= 1;
  }

  // Shield ends the turn it ticks down to 0
  if(newState.effects.shield > 0) {
    newState.player.armor = 7;
  } else {
    newState.player.armor = 0;
  }

  if(poison > 0) {
    newState.effects.poison -= 1;
    newState.boss.hp -= 3;
  }

  if(recharge > 0) {
    newState.effects.recharge -= 1;
    newState.player.mana += 101;
  }

  return newState;
}

const getManaSpent = (gameState) => gameState.moves.reduce((acc, move) => acc + spells[move].cost, 0);

const bossTurn = (gameState) => {
  let newState = cloneState(gameState);
  newState.player.hp -= Math.max(gameState.boss.dmg - gameState.player.armor, 1);
  return newState;
}

const ai = (gameState, turn = 0) => {
  let nextState = cloneState(gameState);
  if(!(turn % 2) && nextState.hardMode) {
    nextState.player.hp -= 1;
    if(nextState.player.hp <= 0) {
      nextState.playerWins = false;
      return nextState;
    }
  }

  nextState = applyEffects(nextState);

  // Tick lead to victory (poison)
  if(nextState.boss.hp <= 0) {
    nextState.playerWins = true;
    //console.log(`player wins by poison on turn ${turn} spending ${getManaSpent(nextState)}`)
    return nextState;
  }

  // It's the boss turn, nothing more to do
  if(turn % 2) {
    nextState = bossTurn(nextState);

    if(nextState.player.hp <= 0) {
      //console.log(`player unwins on turn ${turn}`)
      nextState.playerWins = false;
      return nextState;
    }

    return ai(nextState, turn + 1);
  }

  let bestMana = 99999;
  let bestState = cloneState(nextState);
  for(const spell of spells) {
    if(turn == 0) {
      console.log(spell.name);
    }

    let currentState = cloneState(nextState);
    // Skip running effects (5 buckers part two allows casting those, increasing their duration)
    if((spell.name === 'Poison' && currentState.effects.poison > 0) ||
        (spell.name === 'Shield' && currentState.effects.shield > 0) || 
        (spell.name === 'Recharge' && currentState.effects.recharge > 0)) {
      continue;
    }

    if(spell.cost > currentState.player.mana) {
      continue;
    }

    currentState = spell.cast(currentState);

    if(currentState.boss.hp <= 0) {
      currentState.playerWins = true;
      let mana = getManaSpent(currentState);
      //console.log(`player wins on ${turn} after casting ${spell.name}`)
      if(mana < bestMana) {
        bestMana = mana;
        bestState = currentState;
      }
    } else {
      currentState = ai(currentState, turn + 1);

      let mana = getManaSpent(currentState);
      if(mana < bestMana && currentState.playerWins) {
        bestMana = mana;
        bestState = currentState;
      }
    }
  }

  return bestState;
}

const createGameState = (boss, player, hardMode) => {
  return cloneState({
    boss: {...boss},
    player: {...player},
    effects: {
      shield: 0,
      poison: 0,
      recharge: 0
    },
    moves: [],
    playerWins: undefined,
    hardMode
  });
}

const replay = (boss, player, moves) => {
  let gameState = createGameState(boss, player);
  let turn = 0;
  for(let move of moves) {
    console.log(`-- Turn ${turn++} - Player --`);
    console.log(gameState);
    console.log(`ticks for player`);
    gameState = applyEffects(gameState);
    console.log(gameState);
    console.log(`player casts ${spells[move].name}`);
    gameState = spells[move].cast(gameState);
    console.log(`-- Turn ${turn++} - Boss --`);
    console.log(gameState);
    console.log(`ticks for boss`);
    gameState = applyEffects(gameState);
    console.log(gameState);
    console.log('volles pfund aufs maul')
    gameState = bossTurn(gameState);
    console.log(gameState);
  }
}

exports.solver = function(input) {
  const boss = parseBoss(input);
  const player = {
    hp: 50,
    mana: 500,
    armor: 0
  };

  /*const ex1Boss = {hp: 13, dmg: 8};
  const ex1PLayer = {hp: 10, mana: 250, armor: 0};
  const gsEx1 = createGameState(ex1Boss, ex1PLayer);
  console.log(gsEx1);
  let end = ai(gsEx1);
  console.log(end);
  replay(ex1Boss, ex1PLayer, end.moves);*/

  /*const ex2Boss = {hp: 14, dmg: 8};
  const ex2Player = {hp: 10, mana: 250, armor: 0};
  const gsEx2 = createGameState(ex2Boss, ex2Player);
  let end2 = ai(gsEx2);
  replay(ex2Boss, ex2Player, end2.moves);*/

  const gameState = createGameState(boss, player, false);

  let winningMoves = ai(gameState);
  //replay(boss, player, winningMoves.moves);
  console.log(`we can beat the evil boss spending ${getManaSpent(winningMoves)} manata`);

  const gameStateHard = createGameState(boss, player, true);
  const winningHard = ai(gameStateHard);
  console.log(`new game+ - we now need ${getManaSpent(winningHard)} manae`);
}
