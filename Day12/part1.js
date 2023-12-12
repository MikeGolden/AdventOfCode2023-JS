import Iter from "es-iter";
import fs from "fs";
const sumArray = (arr) => arr.reduce((acc, a) => acc + a, 0);
export const getPartOneSolution = (input) => {
  const lines = input.split("\n").filter(Boolean);
  const records = lines.map((line) => {
    const split = line.split(" ");
    const springs = [...split[0]];
    const damagedSpringGroupsLengths = split[1]
      .split(",")
      .map((d) => parseInt(d, 10));
    return {
      springs,
      damagedSpringGroupsLengths,
    };
  });
  const recordNumArrangements = [];
  for (const record of records) {
    const width = record.springs.length;
    const totalOptions =
      sumArray(record.damagedSpringGroupsLengths) +
      record.damagedSpringGroupsLengths.length -
      1;
    const extraSquares = width - totalOptions;
    const range = Array.from(
      { length: record.damagedSpringGroupsLengths.length + extraSquares },
      (_, i) => i,
    );
    const combinations = [
      ...new Iter(range).combinations(record.damagedSpringGroupsLengths.length),
    ];
    const rows = combinations
      .map((combiantion) => {
        const row = [];
        for (let i = 0; i < combiantion.length; i++) {
          row.push(
            ...Array.from(
              { length: combiantion[i] - (combiantion[i - 1] ?? 0) },
              () => ".",
            ),
          );
          row.push(
            ...Array.from(
              { length: record.damagedSpringGroupsLengths[i] },
              () => "#",
            ),
          );
        }
        row.push(...Array.from({ length: width - row.length }, () => "."));
        for (let j = 0; j < width; j++) {
          if (record.springs[j] === "?") {
            continue;
          }
          if (row[j] !== record.springs[j]) {
            return;
          }
        }
        return row;
      })
      .filter(Boolean);
    recordNumArrangements.push(rows.length);
  }
  return sumArray(recordNumArrangements).toString();
};

export const myPart1 = fs.readFile("input.txt", "utf8", (err, data) => {
  if (err) throw err;
  console.log(`Solution for part 1: ${getPartOneSolution(data)}`);
});
