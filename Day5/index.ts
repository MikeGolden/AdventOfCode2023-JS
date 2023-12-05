import chalk from "chalk";
import { print } from "../utils/console";
import { timeExec } from "../utils/perf";
import { part1 } from "./part1";

export function day_05() {
  const color1 = chalk.greenBright;
  print(color1(`  Day 05 - Part 1: ${timeExec(part1)}`));
}
