'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = HAM;
/* Based on the Hypothetical Amnesia Machine thought experiment */
function HAM(machineState, incomingState, currentState, incomingValue, currentValue) {
  if (machineState < incomingState) return { defer: true }; // the incoming value is outside the boundary of the machine's state, it must be reprocessed in another state.
  if (incomingState < currentState) return { historical: true }; // the incoming value is within the boundary of the machine's state, but not within the range.
  if (currentState < incomingState) return { converge: true, incoming: true }; // the incoming value is within both the boundary and the range of the machine's state.
  if (incomingState === currentState) {
    if (incomingValue === currentValue) // Note: while these are practically the same, the deltas could be technically different
      return { state: true };
    /*
      The following is a naive implementation, but will always work.
      Never change it unless you have specific needs that absolutely require it.
      If changed, your data will diverge unless you guarantee every peer's algorithm has also been changed to be the same.
      As a result, it is highly discouraged to modify despite the fact that it is naive,
      because convergence (data integrity) is generally more important.
      Any difference in this algorithm must be given a new and different name.
    */
    if (Lexical(incomingValue) < Lexical(currentValue)) {
      // Lexical only works on simple value types!
      return { converge: true, current: true };
    }
    if (Lexical(currentValue) < Lexical(incomingValue)) {
      // Lexical only works on simple value types!
      return { converge: true, incoming: true };
    }
  }
  return { err: 'you have not properly handled recursion through your data or filtered it as JSON' };
}

function Lexical(value) {
  // TODO: BUG! HAM should understand a relation (pointer) as a type as well.
  if (typeof value === 'string') {
    // Text
    return 'aaaaa' + value;
  }
  if (value - parseFloat(value) + 1 >= 0) {
    // Numbers (JSON-able)
    return 'aaaa' + value;
  }
  if (true === value) {
    // Boolean
    return 'aaa';
  }
  if (false === value) {
    // Boolean
    return 'aa';
  }
  if (null === value) {
    // Null
    return 'a';
  }
  if (undefined === value) {
    // Undefined
    return '';
  }
  return ''; // Not supported
}