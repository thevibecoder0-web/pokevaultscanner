
export interface PokemonAttack {
  name: string;
  damage: string;
  cost: string[];
  description: string;
}

export interface PokemonCard {
  id: string;
  name: string;
  hp: string;
  type: string;
  stage: string;
  abilities: string[];
  attacks: PokemonAttack[];
  weakness: string;
  resistance: string;
  retreatCost: number;
  description: string;
  set: string;
  rarity: string;
  scannedAt: number;
  imageUrl?: string;
}

export enum AppTab {
  SCAN = 'scan',
  COLLECTION = 'collection'
}
