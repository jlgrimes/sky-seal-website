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

const PTCGO_CODE_MAP_SV = {
  sv1: 'SVI',
  sv2: 'PAL',
  sv3: 'OBF',
  sve: 'SVE'
};

const validCardRegexGroups = /^(\d+(?:\+\d)*) ([a-zA-Z{}\-\' ]*) ([a-zA-Z]{3}) (\d+(?:\+\d)*)$/;
const validPromoRegex = /^\d+(\+\d)* [a-zA-Z ]* PR-[a-zA-Z]{2} \d+(\+\d)*$/gi;
const validNormalEnergyRegex = /^\d+(\+\d)* [a-zA-Z ]* (Energy)$/gi;

export const convertListToCodes = async (list: string) => {
  const sets = await fetch('https://api.pokemontcg.io/v2/sets').then((res) => res.json());
  const setData: Record<string, any>[] | null = sets['data'];

  if (!setData) {
    throw {
      error: 'fetching-set-data',
      message: 'Error fetching set data',
      details: 'Something went wrong fetching the set data from api.pokemontcg.io. Its their fault, probably.'
    }
  }

  const lines = list.split('\n');
  const cards = [];
  const invalidLines = [];

  for (const line of lines) {
    const validCardMatches = validCardRegexGroups.exec(line);
    if (validCardMatches) {
      const [_, count, name, ptcgoCode, setNum] = validCardMatches;

      let setId = undefined;
      setId = setData.find((set) => set['ptcgoCode'] && set['ptcgoCode'].toLowerCase() === ptcgoCode.toLowerCase())?.['id'];

      if (!setId) setId = Object.entries(PTCGO_CODE_MAP_SV).find(([_, svPtcgoCode]) => svPtcgoCode.toLowerCase() === ptcgoCode.toLowerCase())?.[1];

      if (!setId) throw {
        error: 'unknown-set',
        message: `Unknown set for card ${name}`,
        details: `${ptcgoCode} is not a valid set for entered line "${line}".`
      }

      cards.push({
        count: parseInt(count),
        code: `${setId.toLowerCase()}-${setNum}`,
      });
      continue;
    } else {
      invalidLines.push(line)
    }
  }

  return {
    cards,
    invalidLines
  }
}

