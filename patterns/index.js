const Combinatorics = require('js-combinatorics');
const T = 'T';
const M = 'M';
const X = 'x';

module.exports = {
  generatePatterns,
};

// cmb = Combinatorics.permutationCombination([[ 'TM' ],[ 'TX' ]]);
// console.log(cmb.toArray());

function generateMultiDimensionsPatterns(R, C, L, H) {
  if (H % 2 !== 0) {
    H = H + 1;
  }

  return [];
}

function generateLinePatterns(maxLength, requiredItem, count) {
  let array = [];
  for (let i = 0; i < requiredItem; i++) {
    array.push(T);
    array.push(M);
  }

  while (array.length < maxLength) {
    array.push('x');
  }
  const variations = Combinatorics.baseN([T, M, X], count).toArray();
  return variations.filter((option) => {
    return (occurrences(option, T) >= requiredItem) && (occurrences(option, M) >= requiredItem);
  });
}

function generateVerticalPatterns(maxLength, requiredItem, count) {
  return generateLinePatterns(maxLength, requiredItem, count).map((option) => {
    return [
      option.join(''),
    ];
  });
}

function generateHorizontalPatterns(maxLength, requiredItem, count) {
  return [generateLinePatterns(maxLength, requiredItem, count)];
}

function generatePatterns(R, C, L, H) {
  let patterns = [];
  if (R >= H) {
    // console.log('Can use row patterns');
    patterns = [
      ...patterns,
      ...generateVerticalPatterns(R, L, H),
    ];
  }
  if (C >= H) {
    // console.log('Can use column patterns');
    patterns = [
      ...patterns,
      ...generateHorizontalPatterns(C, L, H),
    ];
  }

  // console.log('Other patterns');
  patterns = [
    ...patterns,
    ...generateMultiDimensionsPatterns(C, L, H),
  ];
  return patterns;
}

function occurrences(string, subString, allowOverlapping) {

  string += '';
  subString += '';
  if (subString.length <= 0) return (string.length + 1);

  var n = 0,
    pos = 0,
    step = allowOverlapping ? 1 : subString.length;

  while (true) {
    pos = string.indexOf(subString, pos);
    if (pos >= 0) {
      ++n;
      pos += step;
    } else break;
  }
  return n;
}
