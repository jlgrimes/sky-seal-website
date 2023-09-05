const sampleList = `
Pokémon: 9
2 Frigibax PAL 57
3 Chien-Pao ex PAL 61
1 Lumineon V BRS 40
1 Frigibax PAL 58
2 Pidgeot ex OBF 164
2 Pidgey OBF 162
3 Baxcalibur PAL 60
1 Radiant Greninja ASR 46
1 Manaphy BRS 41

Trainer: 15
1 Hisuian Heavy Ball ASR 146
3 Ultra Ball ROS 93
3 Skaters' Park FST 242
2 Nest Ball SUM 123
1 Escape Rope PRC 127
1 Energy Retrieval SVI 171
4 Irida ASR 147
4 Superior Energy Retrieval PLF 103
4 Battle VIP Pass FST 225
3 Boss's Orders PAL 172
1 Iono PAL 185
1 Cynthia's Ambition BRS 138
1 Lost Vacuum LOR 162
1 Canceling Cologne ASR 136
4 Rare Candy SVI 191

Energy: 1
10 Basic {W} Energy SVE 3

Total Cards: 60
`;

enum DeckReadType {
  Pokemon,
  Trainer,
  Energy
}

const getCardCount = (line: String) => parseInt(line.substring(0, line.indexOf(' ')));
const getCardNameAndInfo = (line: String) => line.substring(line.indexOf(' '));

const sortCardList = (cardList: String[]) => {
  return cardList.sort((a, b) => {
    if (getCardCount(a) > getCardCount(b)) return -1;
    if (getCardCount(a) < getCardCount(b)) return 1;

    if (getCardNameAndInfo(a) < getCardNameAndInfo(b)) return -1;
    if (getCardNameAndInfo(a) > getCardNameAndInfo(b)) return 1;

    // this implies that two lines have the exact same card which isn't really possible
    return 0;
  });
}

export const normalizeDeckList = (list: string) => {
  let normalizedList = list;
  
  normalizedList = normalizedList.trim();

  let pokemon = [], trainers = [], energies = [];
  let mode: DeckReadType | null = null;

  for (const line of normalizedList.split(/\r?\n/)) {
    console.log('line===')
    console.log(line);
    // Blank line
    if (line.length === 0) continue;

    const firstPhrase: string = line.substring(0, line.indexOf(' '));
    if (firstPhrase === 'Pokémon:') {
      mode = DeckReadType.Pokemon;
    } else if (firstPhrase === 'Trainer:') {
      mode = DeckReadType.Trainer;
    } else if (firstPhrase === 'Energy:') {
      mode = DeckReadType.Energy;
    } else if (firstPhrase === 'Total') {
      continue;
    } else {
      if (mode === DeckReadType.Pokemon) pokemon.push(line);
      else if (mode === DeckReadType.Trainer) trainers.push(line);
      else if (mode === DeckReadType.Energy) energies.push(line);
    }
  }

  return [
    ...sortCardList(pokemon),
    ...sortCardList(trainers),
    ...sortCardList(energies)
  ].join('\n');
}