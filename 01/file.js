import fs from "fs";

const filePath = "puzzle-input.txt";

fs.readFile(filePath, "utf-8", (err, data) => {
  if (err) {
    console.error("Error reading file", err);
    return;
  }

  let sum = 0;
  const lines = data.split("\n");

  lines.forEach((line) => {
    const digits = line.match(/\d/g);

    if (digits && digits.length > 0) {
      const firstDigit = digits[0];
      const lastDigit = digits[digits.length - 1];

      const doubleDigit = parseInt(`${firstDigit}${lastDigit}`, 10);

      sum += doubleDigit;

      console.log(
        `Line: ${line} - Number: ${doubleDigit} - The sum is: ${sum}`,
      );
    } else {
      console.log(`No digits in line: ${line}`);
    }
  });
});
