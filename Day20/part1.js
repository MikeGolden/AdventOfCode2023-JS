import fs from "fs";
const getGreatestCommonDenominator = (n, m) => {
  while (m !== 0) {
    const temp = m;
    m = n % m;
    n = temp;
  }
  return n;
};
const getLeastCommonMultiple = (n, m) => {
  return (n * m) / getGreatestCommonDenominator(n, m);
};
const getLeastCommonMultipleForArray = (numbers) => {
  if (numbers.length === 2) {
    return getLeastCommonMultiple(numbers[0], numbers[1]);
  } else {
    const first = numbers.shift();
    return getLeastCommonMultiple(
      first,
      getLeastCommonMultipleForArray(numbers),
    );
  }
};
const buildModule = (type, name, destinations) => {
  if (type === "flip-flop") {
    return {
      name,
      type,
      isOn: false,
      destinations,
    };
  }
  if (type === "conjuction") {
    return {
      name,
      type,
      destinations,
      memory: new Map(),
    };
  }
  return {
    name,
    type,
    destinations,
  };
};
const getModules = (input) => {
  const lines = input.split("\n").filter(Boolean);
  // broadcaster -> a, b, c
  // %a -> b
  // %b -> c
  // %c -> inv
  // %inv -> a
  const modules = new Map();
  lines.forEach((line) => {
    const [prefix, suffix] = line.split("->").map((p) => p.trim());
    let moduleType = "broadcast";
    let moduleName;
    if (prefix === "broadcaster") {
      moduleType = "broadcast";
      moduleName = prefix;
    } else {
      moduleType = prefix.at(0) === "%" ? "flip-flop" : "conjuction";
      moduleName = prefix.slice(1);
    }
    const destinations = suffix.split(",").map((p) => p.trim());
    modules.set(moduleName, buildModule(moduleType, moduleName, destinations));
  });
  // Set initial memory for conjuction modules.
  for (const [name, module] of modules.entries()) {
    for (const destination of module.destinations) {
      const destinationModule = modules.get(destination);
      if (destinationModule?.type === "conjuction") {
        destinationModule.memory.set(name, "low");
      }
    }
  }
  return modules;
};
const handlePulse = (
  modules,
  moduleName,
  pulse,
  from,
  inputsToFinalModule,
  accumulators,
) => {
  console.log(`${from} -${pulse}-> ${moduleName}`);
  const module = modules.get(moduleName);
  if (!module) {
    return [];
  }
  // Final conjunction module has 4 inputs: 'nh', 'dr', 'xm', 'tr'.
  // Remember when they recieve their first low input.
  // Assume that is their cycle length.
  if (
    pulse === "low" &&
    !accumulators.lowPulseIterations.has(moduleName) &&
    inputsToFinalModule.includes(moduleName)
  ) {
    accumulators.lowPulseIterations.set(moduleName, accumulators.buttonPresses);
  }
  const { type, destinations } = module;
  const futurePulsesToSend = [];
  switch (type) {
    case "broadcast": {
      // When a broadcast module recieves a pulse, it sends the same pulse to all of its destination modules.
      for (const destination of destinations) {
        futurePulsesToSend.push({ to: destination, pulse, from: moduleName });
      }
      break;
    }
    case "flip-flop": {
      // if a flip-flop module recieves a high pulse, it is ignored and nothing happens.
      if (pulse === "low") {
        for (const destination of destinations) {
          futurePulsesToSend.push({
            to: destination,
            pulse: module.isOn ? "low" : "high", // If it was off, it sends a high pulse.
            from: moduleName,
          });
        }
        // It flips between on and off.
        module.isOn = !module.isOn;
      }
      break;
    }
    case "conjuction": {
      // When a pulse is recieved, the conjuction module first updates its memory for that input.
      module.memory.set(from, pulse);
      // Then, if it remembers high pulses for all inputs, it sends a low pulse; otherwise, it sends a high pulse.
      const allHigh = [...module.memory.values()].every((p) => p === "high");
      for (const destination of destinations) {
        futurePulsesToSend.push({
          to: destination,
          pulse: allHigh ? "low" : "high",
          from: moduleName,
        });
      }
      break;
    }
  }
  return futurePulsesToSend;
};
const pressButton = (
  modules,
  inputsToFinalModule = [],
  accumulators = {
    lowPulseIterations: new Map(),
    buttonPresses: 0,
  },
) => {
  let lowIncrement = 0;
  let highIncrement = 0;
  let tempQueue = [];
  let queue = [{ from: "button", to: "broadcaster", pulse: "low" }];
  while (queue.length) {
    tempQueue = [];
    while (queue.length) {
      const { from, pulse, to } = queue.shift();
      if (pulse === "low") {
        lowIncrement++;
      } else {
        highIncrement++;
      }
      const futurePulsesToSend = handlePulse(
        modules,
        to,
        pulse,
        from,
        inputsToFinalModule,
        accumulators,
      );
      tempQueue.push(...futurePulsesToSend);
    }
    queue = tempQueue;
  }
  return { lowIncrement, highIncrement };
};
const getPartOneSolution = (input) => {
  const modules = getModules(input);
  let lowPulses = 0;
  let highPulses = 0;
  for (let i = 0; i < 1000; i++) {
    const { lowIncrement, highIncrement } = pressButton(modules);
    lowPulses += lowIncrement;
    highPulses += highIncrement;
  }
  const answer = lowPulses * highPulses;
  return answer.toString();
};

export const myPart1 = fs.readFile("input.txt", "utf8", (err, data) => {
  if (err) throw err;
  console.log(`Result for part 1: ${getPartOneSolution(data)}`);
});
