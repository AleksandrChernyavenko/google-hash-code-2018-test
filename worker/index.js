let calculatedRows = [
  // {
  //   index: 0,
  //   start: 0,
  //   end: 4,
  // }
];

function findBestOption(R, C, L, H, pizza) {
  calculatedRows = calculateRowLimits(R, C);

  const slices = [];
  let maxCellDone = 0;

  const totalCell = (R * C) - 1;
  let startCell = 0;

  while (startCell < totalCell) {
    const sliceResult = makeSlice(startCell, R, C, L, H, pizza);
    if (sliceResult) {
      pizza = sliceResult.pizza;
      slices.push(sliceResult.slice);
      maxCellDone += sliceResult.cellCount;
    }
    console.log(`Progress ${startCell}/${totalCell}`);
    saveResultToFile(slices);
    startCell++;
  }

  return {
    cellUsed: maxCellDone,
    slices,
  };
}

function makeSlice(startCell, R, C, L, H, pizza) {
  if (pizza[startCell] === SLICED_CHAR) {
    return false;
  }

  const sliceResult = makeSliceRight(startCell, R, C, L, H, pizza);
  if(sliceResult) {
    return sliceResult;
  }

  // let { r1, c1, r2, c2, cellCount, newPizza } = makeSliceRight(startCell, R, C, L, H, pizza);
  // let { r1, c1, r2, c2, cellCount, newPizza } = makeSliceDown(startCell, R, C, pizza);
  // let { r1, c1, r2, c2, cellCount, newPizza } = makeSliceRectangular(startCell, R, C, pizza);
  //
  // const {r1, c1, r2, c2, cellCount} = getSliceInfo(startCell, R, C, pizza, pattern);
  // const newPizza = removeSliceFromPizza(startCell, R, C, pizza, pattern);
  // return {
  //   pizza: newPizza,
  //   slice: `${r1} ${c1} ${r2} ${c2}`,
  //   cellCount,
  // };
}

const SLICED_CHAR = '~';

function makeSliceRight(startCell, R, C, L, H, pizza) {
  const row = findRow(startCell);
  const leftCells = row.end - startCell;

  if (leftCells < (L * 2)) {
    return false;
  }


  let start = startCell;
  let end = row.end;

  const maxEnd = startCell + H;
  if (maxEnd < row.end) {
    end = maxEnd;
  }

  const slicedIndex = pizza.indexOf(SLICED_CHAR, start);
  if (slicedIndex !== -1) {
    end = slicedIndex;
  }


  if ((end - start) < (L * 2)) {
    return false;
  }

  const line = pizza.substring(start, end);
  const countT = (line.match(/T/g) || []).length;
  const countM = (line.match(/M/g) || []).length;

  if (countT < L || countM < L) {
    return false;
  }


  const cellCount = end - start;
  const r1 = row.index;
  const r2 = row.index;
  const c1 = startCell - row.start;
  const c2 = c1 + (line.length - 1);


  return {
    pizza: replacePizza(pizza, start, end),
    slice: `${r1} ${c1} ${r2} ${c2}`,
    cellCount: cellCount,
  };
}

function getSliceInfo(startCell, R, C, pizza, pattern) {
  const cellCount = pattern.reduce((length, patternValue) => {
    return length + patternValue.length;
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

function replacePizza(pizza, start, end) {
  const replacement = SLICED_CHAR.repeat(end - start);
  return pizza.substr(0, start) + replacement + pizza.substr(end);
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
  fs.writeFileSync(`./progress.out`, content);
}
