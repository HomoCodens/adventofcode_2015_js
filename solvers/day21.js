const parseBoss = (boss) => {
  let hp = boss.match(/Hit Points: (\d+)/)[1];
  let dmg = boss.match(/Damage: (\d+)/)[1];
  let armour = boss.match(/Armor: (\d+)/)[1];

  return {
    hp: Number.parseInt(hp),
    dmg: Number.parseInt(dmg),
    armour: Number.parseInt(armour)
  }
}

const playerWins = (player, boss) => {
  const playerDmg = Math.max(player.dmg - boss.armour, 1);
  const bossDmg = Math.max(boss.dmg - player.armour, 1);

  let bossHP = boss.hp;
  let playerHP = player.hp;
  while(true) {
    bossHP -= playerDmg;
    if(bossHP <= 0) {
      return true;
    }

    playerHP -= bossDmg;
    if(playerHP <= 0) {
      return false;
    }
  }
}

exports.solver = function(input) {
  const boss = parseBoss(input);

  const weapons = [
    {
      cost: 8,
      damage: 4,
      armour: 0
    },
    {
      cost: 10,
      damage: 5,
      armour: 0
    },
    {
      cost: 25,
      damage: 6,
      armour: 0
    },
    {
      cost: 40,
      damage: 7,
      armour: 0
    },
    {
      cost: 74,
      damage: 8,
      armour: 0
    }
  ];

  const armor = [
    {
      cost: 0,
      damage: 0,
      armour: 0
    },
    {
      cost: 13,
      damage: 0,
      armour: 1
    },
    {
      cost: 31,
      damage: 0,
      armour: 2
    },
    {
      cost: 53,
      damage: 0,
      armour: 3
    },
    {
      cost: 75,
      damage: 0,
      armour: 4
    },
    {
      cost: 102,
      damage: 0,
      armour: 5
    }
  ];

  const rings /* of power */ = [
    {
      cost: 0,
      damage: 0,
      armour: 0
    },
    {
      cost: 0,
      damage: 0,
      armour: 0
    },
    {
      cost: 25,
      damage: 1,
      armour: 0
    },
    {
      cost: 50,
      damage: 2,
      armour: 0
    },
    {
      cost: 100,
      damage: 3,
      armour: 0
    },
    {
      cost: 20,
      damage: 0,
      armour: 1
    },
    {
      cost: 40,
      damage: 0,
      armour: 2
    },
    {
      cost: 80,
      damage: 0,
      armour: 3
    }
  ];

  let bestLoadout = {
    price: 99999
  }
  for(const wpn of weapons) {
    for(const arm of armor) {
      for(let i = 0; i < rings.length - 1; i++) {
        const ring1 = rings[i];
        for(let j = i+1; j < rings.length; j++) {
          const ring2 = rings[j];
          const playerStats = {
            hp: 100,
            price: wpn.cost + arm.cost + ring1.cost + ring2.cost,
            armour: arm.armour + ring1.armour + ring2.armour,
            dmg: wpn.damage + ring1.damage + ring2.damage
          };

          if(playerStats.price < bestLoadout.price && playerWins(playerStats, boss)) {
            bestLoadout = playerStats;
          }
        }
      }
    }
  }

  console.log(`We can handily defeat the boss spending a mere ${bestLoadout.price}`);


  let worstLoadout = {
    price: 0
  }
  for(const wpn of weapons) {
    for(const arm of armor) {
      for(let i = 0; i < rings.length - 1; i++) {
        const ring1 = rings[i];
        for(let j = i+1; j < rings.length; j++) {
          const ring2 = rings[j];
          const playerStats = {
            hp: 100,
            price: wpn.cost + arm.cost + ring1.cost + ring2.cost,
            armour: arm.armour + ring1.armour + ring2.armour,
            dmg: wpn.damage + ring1.damage + ring2.damage
          };

          if(playerStats.price > worstLoadout.price && !playerWins(playerStats, boss)) {
            worstLoadout = playerStats;
          }
        }
      }
    }
  }

  console.log(`That dirty scoundrel! ${worstLoadout.price} gold and still we lose.`);
}