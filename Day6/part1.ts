const multiplyArray = (arr: number[]) => arr.reduce((acc, a) => acc * a, 1);

type Race = {
  time: number;
  currentDistanceRecord: number;
};

export const getPartOneSolution = (input: string): string => {
  const lines = input.split("\n");

  const times = lines[0]
    .split(":")[1]
    .trim()
    .split(" ")
    .filter(Boolean)
    .map((d) => parseInt(d, 10));

  const distances = lines[1]
    .split(":")[1]
    .trim()
    .split(" ")
    .filter(Boolean)
    .map((d) => parseInt(d, 10));

  const races = times.map<Race>((_, i) => ({
    time: times[i],
    currentDistanceRecord: distances[i],
  }));

  const numWaysToWin = races.map((race) => {
    const winners = Array.from({ length: race.time }, (_, i) => i).filter(
      (speed) => (race.time - speed) * speed > race.currentDistanceRecord,
    );
    return winners.length;
  });

  return multiplyArray(numWaysToWin).toString();
};
