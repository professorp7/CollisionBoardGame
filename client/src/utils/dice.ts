// Utility function to roll a single die with given number of sides
export const rollDie = (sides: number): number => {
  return Math.floor(Math.random() * sides) + 1;
};

// Dice rolling utility functions
export function rollDice(formula: string): { result: number; breakdown: string } {
  // Normalize the formula by removing spaces
  const normalizedFormula = formula.replace(/\s/g, '');

  let total = 0;
  let breakdown = '';
  let lastIndex = 0;
  const rolls: number[][] = [];

  // Match dice notation like "2d6", "1d20", etc.
  const diceRegex = /(\d+)d(\d+)/g;
  let match;

  while ((match = diceRegex.exec(normalizedFormula)) !== null) {
    const [fullMatch, countStr, sidesStr] = match;
    const count = parseInt(countStr, 10);
    const sides = parseInt(sidesStr, 10);

    // Roll the dice
    const diceResults = Array.from({ length: count }, () =>
      Math.floor(Math.random() * sides) + 1
    );
    rolls.push(diceResults);

    const diceTotal = diceResults.reduce((sum, val) => sum + val, 0);
    total += diceTotal;

    // Update breakdown
    if (breakdown.length > 0) {
      breakdown += ' + ';
    }

    breakdown += diceResults.join(' + ');
  }

  // Add any modifiers
  const modifierMatch = normalizedFormula.match(/[+-]\d+$/);
  if (modifierMatch) {
    const modifier = parseInt(modifierMatch[0], 10);
    total += modifier;
    breakdown += ` ${modifier >= 0 ? '+' : ''} ${modifier}`;
  }

  return { result: total, breakdown };
}