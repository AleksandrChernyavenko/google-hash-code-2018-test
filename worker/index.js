let calculatedRows = [
  // {
  //   index: 0,
  //   start: 0,
  //   end: 4,
  // }
];


let maxCellDone = 0;
let bestSlices = 'not found yet';

function findBestOption(R, C, L, H, pizza, patterns) {
  calculatedRows = calculateRowLimits(R, C);

  // try apply first patter from each cell
  // if we can apply it, make slice ( get new pizza )
  // try apply first patter from each cell
  // if no

  const slices = [];



  const patternCount = patterns.length - 1;
  let patternIndex = 0;




  let startTime = Date.now();
  while(patternIndex < patternCount) {
    let pattern = patterns[patternIndex];
    const result = tryMakeSliceForPatter(R, C, pizza, pattern);
    if(result) {
      // console.log('SLICE DONE!!!',result);
      pizza = result.pizza;
      slices.push(result.slice);
      maxCellDone += result.cellCount;
    }
    else {
      console.log(`Check one pattern took:  ${-startTime + Date.now()}ms`);
      startTime = Date.now();
      console.log(`Progress patterns ${patternIndex}/${patterns.length}`);
      console.log(`used ~ `,(pizza.match(/~/g) || []).length);
      saveResultToFile(slices);
      patternIndex++;
    }
  }

  // console.log('slices',slices);
  console.log('WOW',{
    cellUsed: maxCellDone,
    bestSlices,
    slices,
  });

  // need start each patterns from each cell
  // patterns.forEach((pattern, index) => {
    // console.log(`Started patter ${i} from ${patterns.length}`);
    // const solution = getAllPossibleSolutions(R, C, pizza, pattern, patterns);
  // });

  return {
    cellUsed: maxCellDone,
    bestSlices,
    slices,
  };

}


function tryMakeSliceForPosition(startCell, R, C, pizza, patterns) {
  patterns.forEach((pattern) => {
    const validSlice = checkPattern(startCell, R, C, pizza, pattern);
    if(validSlice) {
      return makeSlice(startCell, R, C, pizza, pattern);
    };
  })
}

function tryMakeSliceForPatter(R, C, pizza, pattern) {
  const totalCell = (R * C) - 1;
  let startCell = 0;
  while (startCell < totalCell) {
    const validSlice = checkPattern(startCell, R, C, pizza, pattern);
    if (validSlice) {
      return makeSlice(startCell, R, C, pizza, pattern);
    }
    startCell++;
  }
}

function makeSlice(startCell, R, C, pizza, pattern) {
  const {r1, c1, r2, c2, cellCount} = getSliceInfo(startCell, R, C, pizza, pattern);
  const newPizza = removeSliceFromPizza(startCell, R, C, pizza, pattern);
  return {
    pizza:newPizza,
    slice:`${r1} ${c1} ${r2} ${c2}`,
    cellCount,
  }
}

function getSliceInfo(startCell, R, C, pizza, pattern) {
  const cellCount = pattern.reduce((length, patternValue) => {
    return length + patternValue.length
  }, 0);
  let r1, c1, r2, c2;
  const patternLength = pattern[0].length;
  const row = findRow(startCell);
  r1 = row.index;
  r2 = row.index + (pattern.length - 1);
  c1 = startCell - row.start;
  c2 = c1 + (patternLength - 1);

  return {
    r1,
    c1,
    r2,
    c2,
    cellCount,
  };
}

const SLICED_CHAR = '~';

function removeSliceFromPizza(startCell, R, C, pizza, pattern) {
  pattern.forEach((pattern, index) => {
    const replacement = SLICED_CHAR.repeat(pattern.length);
    const replaceIndex = startCell + (C*index);
    pizza = pizza.substr(0, replaceIndex) + replacement + pizza.substr(replaceIndex + replacement.length);
  });
  return pizza;
}

function checkPattern(startCell, R, C, pizza, pattern) {

  const isValidPattern = pattern.reduce((valid, patternValue, index) => {
    if (!valid) {
      return false;
    }
    const patternValueLength = patternValue.length;
    const start = startCell + (C * index);
    if (isEnoughCellInRow(start, patternValueLength)) {
      return pizza.indexOf(patternValue, start) === start;
    }
    return false;
  }, true);

  // if (isValidPattern) {
  //   console.log('startCell', startCell);
  //   console.log('pizza', pizza);
  //   console.log('checkPattern', pattern);
  //   console.log('isValidPattern', isValidPattern);
  // }
  return isValidPattern;
}

function isEnoughCellInRow(startCell, length) {
  const row = findRow(startCell);

  if (!row) {
    return false;
  }
  return (startCell + length) <= row.end;
}

function findRow(cellPosition) {
  return calculatedRows.find((row) => {
    if (cellPosition >= row.start && cellPosition <= row.end) {
      return row;
    }
  });
}

module.exports = {
  findBestOption,
};

function calculateRowLimits(R, C) {
  const end = (R * C) - 1;
  let start = 0;
  let index = 0;
  const items = [];
  while (start < end) {
    const itemEnd = start + C - 1;
    items.push({
      index,
      start: start,
      end: itemEnd,
    });
    start = start + C;
    index++;
  }

  return items;
}


function saveResultToFile(slices) {
  const fs = require('fs');
  const slicesCount = slices.length;
  const content = [slicesCount, ...slices].join('\n');
  fs.writeFileSync(`./progress.out`,content);
}
