'use strict';

function atomUtils() {

  function buildRange(coords) {
    return {
      start: {
        row: coords.start[0],
        column: coords.start[1]
      },
      end: {
        row: coords.end[0],
        column: coords.end[1]
      }
    };
  }

  return {
    buildRange: buildRange
  };

}

module.exports = atomUtils;
