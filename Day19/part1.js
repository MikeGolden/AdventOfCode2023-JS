import fs from "fs";
const sumArray = (arr) => arr.reduce((acc, a) => acc + a, 0);
const parseWorkflow = (line) => {
  // px{a<2006:qkq,m>2090:A,rfg}
  const [name, operationsStr] = line.split("{");
  const operationsArr = operationsStr.slice(0, -1).split(",");
  const operations = operationsArr.map((operationStr) => {
    if (operationStr.includes(":")) {
      const [formula, workflow] = operationStr.split(":");
      const part = formula.at(0);
      const operator = formula.at(1);
      const value = parseInt(formula.slice(2), 10);
      return { workflow, part, operator, value };
    } else {
      return operationStr;
    }
  });
  return { name, operations };
};
const parseRatings = (line) => {
  // {x=787,m=2655,a=1222,s=2876}
  const partRatings = new Map();
  const ratingsArr = line.slice(1, -1).split(",");
  for (const ratingStr of ratingsArr) {
    const [name, valueStr] = ratingStr.split("=");
    const value = parseInt(valueStr, 10);
    partRatings.set(name, { value });
  }
  return partRatings;
};
const evaluateOperation = (operation, partRatings) => {
  if (typeof operation === "string") {
    return { newCurrent: operation };
  } else {
    const { workflow, part, operator, value: operationValue } = operation;
    const { value: ratingValue } = partRatings.get(part);
    if (
      (operator === ">" && ratingValue > operationValue) ||
      (operator === "<" && ratingValue < operationValue)
    ) {
      return { newCurrent: workflow };
    }
  }
  return false;
};
export const getPartOneSolution = (input) => {
  const lines = input.split("\n").filter(Boolean);
  const rules = new Map();
  const ratings = [];
  lines.forEach((line) => {
    if (line.startsWith("{")) {
      ratings.push(parseRatings(line));
    } else {
      const { name, operations } = parseWorkflow(line);
      rules.set(name, { operations });
    }
  });
  let sum = 0;
  let current = "in";
  let rule = rules.get(current);
  for (const partRatings of ratings) {
    let iterate = true;
    while (iterate) {
      for (const operation of rule.operations) {
        const evaluation = evaluateOperation(operation, partRatings);
        if (!evaluation) {
          continue;
        }
        current = evaluation.newCurrent;
        if (current === "A") {
          sum += sumArray([...partRatings.values()].map((r) => r.value));
          current = "in";
          iterate = false;
        } else if (current === "R") {
          current = "in";
          iterate = false;
        }
        rule = rules.get(current);
        break;
      }
    }
  }
  return sum.toString();
};

export const myPart1 = fs.readFile("input.txt", "utf8", (err, data) => {
  if (err) throw err;
  console.log(`Result for part 1: ${getPartOneSolution(data)}`);
});
