import fs from "fs";

const wordToDigit = {
  one: "1",
  two: "2",
  three: "3",
  four: "4",
  five: "5",
  six: "6",
  seven: "7",
  eight: "8",
  nine: "9",
};

const filePath = "puzzle-input.txt";

const replaceWordsWithDigits = (line) => {
  return line.replace(
    /(one|two|three|four|five|six|seven|eight|nine)/gi,
    (match) => {
      return wordToDigit[match.toLowerCase()];
    },
  );
};

fs.readFile(filePath, "utf-8", (err, data) => {
  if (err) {
    console.error("Error reading file", err);
    return;
  }

  let sum = 0;
  const lines = data.split("\n");

  lines.forEach((line) => {
    // const digits = line.match(/\d/g);
    const lineWithDigits = replaceWordsWithDigits(line);

    const digits = lineWithDigits.match(/\d/g);

    if (digits && digits.length > 0) {
      const firstDigit = digits[0];
      const lastDigit = digits[digits.length - 1];

      const doubleDigit = parseInt(`${firstDigit}${lastDigit}`, 10);

      sum += doubleDigit;

      console.log(
        `Line: ${lineWithDigits} - Digits: ${digits} - Number: ${doubleDigit} - The sum is: ${sum}`,
      );
    } else {
      console.log(`No digits in line: ${line}`);
    }
  });
});
