// Utility function to roll a single die with given number of sides
export const rollDie = (sides: number): number => {
  return Math.floor(Math.random() * sides) + 1;
};

// Parse and roll dice from a formula like "2d6+3"
export const rollDiceFormula = (formula: string): { 
  result: number; 
  breakdown: string;
} => {
  // Normalize the formula by removing all spaces
  const normalizedFormula = formula.replace(/\s+/g, '').toLowerCase();
  
  // Match parts like "2d6", "1d20", etc.
  const diceRegex = /(\d+)d(\d+)/g;
  let match: RegExpExecArray | null;
  let total = 0;
  let breakdown = '';
  let lastIndex = 0;
  let rolls: {count: number; sides: number; results: number[]}[] = [];
  
  // Find all dice expressions
  while ((match = diceRegex.exec(normalizedFormula)) !== null) {
    const [fullMatch, countStr, sidesStr] = match;
    const count = parseInt(countStr);
    const sides = parseInt(sidesStr);
    
    // Roll the dice
    const diceResults: number[] = [];
    for (let i = 0; i < count; i++) {
      diceResults.push(rollDie(sides));
    }
    
    rolls.push({
      count,
      sides,
      results: diceResults
    });
    
    // Add modifiers from the formula between dice expressions
    if (match.index > lastIndex) {
      const modifierStr = normalizedFormula.substring(lastIndex, match.index);
      if (modifierStr.match(/[+\-*/]/)) {
        try {
          // Evaluate the modifier
          total = eval(`${total}${modifierStr}`);
          breakdown += modifierStr;
        } catch (e) {
          console.error('Error evaluating dice modifier:', e);
        }
      }
    }
    
    // Add dice total to the total
    const diceTotal = diceResults.reduce((sum, val) => sum + val, 0);
    total += diceTotal;
    
    // Update breakdown
    if (breakdown.length > 0 && !breakdown.endsWith('+') && !breakdown.endsWith('-')) {
      breakdown += '+';
    }
    
    // Add dice results to breakdown
    if (count === 1) {
      breakdown += diceResults[0];
    } else {
      breakdown += `(${diceResults.join('+')})`;
    }
    
    lastIndex = match.index + fullMatch.length;
  }
  
  // Add any trailing modifiers
  if (lastIndex < normalizedFormula.length) {
    const trailingStr = normalizedFormula.substring(lastIndex);
    if (trailingStr.match(/^[+\-*/]\d+/)) {
      try {
        // Evaluate the trailing modifier
        total = eval(`${total}${trailingStr}`);
        breakdown += trailingStr;
      } catch (e) {
        console.error('Error evaluating trailing dice modifier:', e);
      }
    }
  }
  
  // If no dice were found, try evaluating as a simple expression
  if (rolls.length === 0) {
    try {
      total = eval(normalizedFormula);
      breakdown = total.toString();
    } catch (e) {
      console.error('Error evaluating dice formula:', e);
      total = 0;
      breakdown = 'Invalid formula';
    }
  }
  
  return { result: total, breakdown };
};
