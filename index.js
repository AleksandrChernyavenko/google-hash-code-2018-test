const fs = require('fs');
const { generatePatterns } = require('./patterns');
const { findBestOption } = require('./worker');
const startTime = Date.now();
const fileType = process.argv[2] || 'small';

console.log('START');

const { R, C, L, H, pizza } = getInfoFromFile();

const patterns = generatePatterns(R, C, L, H);

console.log(`Patterns generated in ${getGoneTime()} (${patterns.length} count)`);

const { cellUsed, slices } = findBestOption(R, C, L, H, pizza, patterns);

console.log(`slices: ${slices}`);
console.log(`Pizza was cut.  Total time: ${getGoneTime()}`);
console.log(`Score: ${cellUsed}/${R*C} 🍕`);

saveResultToFile(slices);

process.exit(0);


function getInfoFromFile() {
  const file = String(fs.readFileSync(`./input/${fileType}.in`));
  const [config, ...pizza] = file.split('\n');
  const [R, C, L, H] = config.split(' ').map(Number);
  pizza.pop(); // remove last empty string

  return {
    R,
    C,
    L,
    H,
    pizza: pizza.join(''),
  };
}

function saveResultToFile(slices) {
  const slicesCount = slices.length;
  const content = [slicesCount, ...slices].join('\n');
  fs.writeFileSync(`./output/${fileType}.out`,content);
}

function getGoneTime() {
  return `${-startTime + Date.now()}ms`;
}

