import fs from "fs";
import path from "path";
export function readFromFile(filename, dir = __dirname, log = false) {
    const data = fs.readFileSync(path.join(dir, filename), "utf8");
    const lines = data.split(/\n/);
    if (log) {
        console.log(lines);
    }
    return lines;
}
export function readInputFromFile(dir, log = false) {
    return readFromFile("input.txt", dir, log);
}
