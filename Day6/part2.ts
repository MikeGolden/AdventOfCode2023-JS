export const getPartTwoSolution = (input: string): string => {
  const lines = input.split("\n");

  const time = parseInt(lines[0].split(":")[1].trim().replaceAll(" ", ""));
  const currentDistanceRecord = parseInt(
    lines[1].split(":")[1].trim().replaceAll(" ", ""),
  );

  const winners = Array.from({ length: time }, (_, i) => i).filter(
    (speed) => (time - speed) * speed > currentDistanceRecord,
  );

  return winners.length.toString();
};
