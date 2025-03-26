import { useState, useEffect } from "react";
import { Character, BattleState, BattleCharacterState } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import BattleCharacter from "./BattleCharacter";
import { useAppContext } from "../../contexts/AppContext";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface BattleTrackerProps {
  characters: Character[];
  onEndBattle: () => void;
}

export default function BattleTracker({ characters, onEndBattle }: BattleTrackerProps) {
  const { currentBattle, rollDice } = useAppContext();
  
  // Initial battle state
  const [battleState, setBattleState] = useState<BattleState>({
    allies: [],
    opponents: []
  });
  
  const [currentTurn, setCurrentTurn] = useState(1);
  const [showQuickDiceDialog, setShowQuickDiceDialog] = useState(false);
  const [diceResult, setDiceResult] = useState<{ result: number; formula: string } | null>(null);
  
  // Load initial battle state from current battle
  useEffect(() => {
    if (currentBattle) {
      setBattleState(currentBattle.battleState as BattleState);
      setCurrentTurn(currentBattle.currentTurn || 1);
    }
  }, [currentBattle]);
  
  // Get the character data for a battle character
  const getCharacterById = (id: number) => {
    return characters.find(c => c.id === id);
  };
  
  // Handle next turn
  const handleNextTurn = () => {
    setCurrentTurn(prevTurn => prevTurn + 1);
  };
  
  // Handle rolling quick dice
  const handleQuickDice = () => {
    setShowQuickDiceDialog(true);
  };
  
  const handleRollDice = (formula: string) => {
    const { result } = rollDice(formula);
    setDiceResult({ result, formula });
  };
  
  // Update a battle character's HP or status
  const updateBattleCharacter = (
    side: 'allies' | 'opponents',
    characterId: number,
    updates: Partial<BattleCharacterState>
  ) => {
    setBattleState(prev => ({
      ...prev,
      [side]: prev[side].map(char => 
        char.characterId === characterId ? { ...char, ...updates } : char
      )
    }));
  };
  
  // Get the current active character
  const getCurrentActiveCharacter = () => {
    // In a real implementation, this would use initiative and turn order
    const allBattleCharacters = [...battleState.allies, ...battleState.opponents]
      .sort((a, b) => a.turnOrder - b.turnOrder);
    
    const activeCharacterIndex = (currentTurn - 1) % allBattleCharacters.length;
    const activeCharacter = allBattleCharacters[activeCharacterIndex];
    
    if (!activeCharacter) return null;
    
    const characterData = getCharacterById(activeCharacter.characterId);
    return characterData ? { ...activeCharacter, character: characterData } : null;
  };
  
  const activeCharacter = getCurrentActiveCharacter();
  
  // Get the side (allies or opponents) for a character
  const getCharacterSide = (characterId: number): 'allies' | 'opponents' | null => {
    if (battleState.allies.some(c => c.characterId === characterId)) {
      return 'allies';
    } else if (battleState.opponents.some(c => c.characterId === characterId)) {
      return 'opponents';
    }
    return null;
  };
  
  // Handle adding a new opponent
  const handleAddOpponent = () => {
    // In a real implementation, this would open a dialog to create or select an opponent
  };

  return (
    <div className="bg-battleui rounded-lg text-white p-5">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Your Team Side */}
        <div>
          <h3 className="font-heading text-lg mb-4 border-b border-battleui-light pb-2">Your Team</h3>
          <div className="space-y-4">
            {battleState.allies.map(ally => {
              const character = getCharacterById(ally.characterId);
              if (!character) return null;
              
              const isActive = activeCharacter?.characterId === ally.characterId;
              
              return (
                <BattleCharacter
                  key={ally.characterId}
                  character={character}
                  currentHp={ally.currentHp}
                  status={ally.status}
                  turnOrder={ally.turnOrder}
                  isActive={isActive}
                  onUpdateHp={(hp) => updateBattleCharacter('allies', ally.characterId, { currentHp: hp })}
                  onUpdateStatus={(status) => updateBattleCharacter('allies', ally.characterId, { status })}
                />
              );
            })}
          </div>
        </div>

        {/* Opponent Team Side */}
        <div>
          <h3 className="font-heading text-lg mb-4 border-b border-battleui-light pb-2">Opponent Team</h3>
          <div className="space-y-4">
            {battleState.opponents.map(opponent => {
              const character = getCharacterById(opponent.characterId);
              if (!character) return null;
              
              const isActive = activeCharacter?.characterId === opponent.characterId;
              
              return (
                <BattleCharacter
                  key={opponent.characterId}
                  character={character}
                  currentHp={opponent.currentHp}
                  status={opponent.status}
                  turnOrder={opponent.turnOrder}
                  isActive={isActive}
                  isOpponent={true}
                  onUpdateHp={(hp) => updateBattleCharacter('opponents', opponent.characterId, { currentHp: hp })}
                  onUpdateStatus={(status) => updateBattleCharacter('opponents', opponent.characterId, { status })}
                />
              );
            })}
            
            <button 
              className="w-full p-2 border border-dashed border-gray-500 rounded-md hover:border-white text-gray-300 hover:text-white transition"
              onClick={handleAddOpponent}
            >
              <i className="fas fa-plus mr-1"></i> Add Opponent
            </button>
          </div>
        </div>
      </div>

      {/* Battle Controls */}
      <div className="mt-6 flex flex-wrap justify-between items-center">
        <div className="flex items-center space-x-2">
          <Button 
            className="bg-primary hover:bg-primary-dark"
            onClick={handleNextTurn}
          >
            <i className="fas fa-step-forward mr-1"></i> Next Turn
          </Button>
          <span className="text-sm">Turn: <span className="font-medium">{currentTurn}</span></span>
          <span className="text-sm ml-4">
            Current: <span className="font-medium">{activeCharacter ? getCharacterById(activeCharacter.characterId)?.name : 'None'}</span>
          </span>
        </div>
        <div className="mt-4 md:mt-0">
          <Button 
            className="bg-gray-700 hover:bg-gray-600 mr-2"
            onClick={handleQuickDice}
          >
            <i className="fas fa-dice mr-1"></i> Quick Dice
          </Button>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button className="bg-destructive hover:bg-destructive/90">
                <i className="fas fa-flag mr-1"></i> End Battle
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>End Battle</AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you want to end this battle? All progress will be lost.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={onEndBattle}>
                  End Battle
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>
      
      {/* Quick Dice Dialog */}
      <Dialog open={showQuickDiceDialog} onOpenChange={setShowQuickDiceDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Quick Dice Roll</DialogTitle>
            <DialogDescription>
              Select a dice to roll or enter a custom formula
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid grid-cols-3 md:grid-cols-6 gap-3 my-4">
            {[4, 6, 8, 10, 12, 20].map(sides => (
              <Button
                key={sides}
                variant="outline"
                className="h-12 w-full text-lg"
                onClick={() => handleRollDice(`1d${sides}`)}
              >
                d{sides}
              </Button>
            ))}
          </div>
          
          <div className="flex gap-3 items-end">
            <div className="flex-1">
              <Label>Custom Roll</Label>
              <Input
                placeholder="e.g. 2d6+3"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleRollDice((e.target as HTMLInputElement).value);
                  }
                }}
              />
            </div>
            <Button onClick={() => handleRollDice("1d20")}>Roll</Button>
          </div>
          
          {diceResult && (
            <div className="bg-gray-100 p-4 rounded-md text-center mt-4">
              <p className="text-sm text-gray-500">{diceResult.formula}</p>
              <p className="text-4xl font-bold text-primary mt-1">{diceResult.result}</p>
            </div>
          )}
          
          <DialogFooter>
            <Button onClick={() => setShowQuickDiceDialog(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
