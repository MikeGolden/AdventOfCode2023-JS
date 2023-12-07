type HandType = | '5-of-a-kind' | '4-of-a-kind' | 'full-house' | '3-of-a-kind' | 'two-pair' | 'one-pair' | 'high-card';

type Hand = {
  cards: string[];
  type: HandType;
}

type Game = {
  hand: Hand;
  bid: number;
}

type handTypeRankMap = new Map<HandType, number>([
  ['5-of-a-kind', 6],
  ['4-of-a-kind', 5],
  ['full-house', 4],
  ['3-of-a-kind', 3],
  ['two-pair', 2],
  ['one-pair', 1],
  ['high-card', 0],
]);

const cardRankMap = new Map<string, number>([
  ['A', 14],
  ['K', 13],
  ['Q', 12],
  ['J', 11],
  ['T', 10],
  ['9', 9],
  ['8', 8],
  ['7', 7],
  ['6', 6],
  ['5', 5],
  ['4', 4],
  ['3', 3],
  ['2', 2],
]);

const sumArray = (arr: number[]) => arr.reduce((acc, a) => acc + a, 0);

const getHandType = (cards: string[]): HandType => {}
