import { Character } from "@shared/schema";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";

interface BattleCharacterProps {
  character: Character;
  currentHp: number;
  status: string;
  turnOrder: number;
  isActive: boolean;
  isOpponent?: boolean;
  onUpdateHp: (hp: number) => void;
  onUpdateStatus: (status: string) => void;
}

export default function BattleCharacter({
  character,
  currentHp,
  status,
  turnOrder,
  isActive,
  isOpponent = false,
  onUpdateHp,
  onUpdateStatus
}: BattleCharacterProps) {
  // Handle updating HP with +/- buttons
  const handleHpChange = (amount: number) => {
    const newHp = Math.max(0, currentHp + amount);
    onUpdateHp(newHp);
  };
  
  // Handle direct HP input
  const handleHpInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newHp = parseInt(e.target.value);
    if (!isNaN(newHp) && newHp >= 0) {
      onUpdateHp(newHp);
    }
  };
  
  // Handle status update
  const handleStatusChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onUpdateStatus(e.target.value);
  };

  return (
    <div className={`battle-character bg-battleui-light rounded-md p-3 relative overflow-hidden ${isActive ? 'ring-2 ring-offset-0 ring-primary/50' : ''}`}>
      {isActive && (
        <div className={`absolute top-0 left-0 w-1 h-full ${isOpponent ? 'bg-error' : 'bg-primary'}`}></div>
      )}
      <div className="flex justify-between">
        <span className="font-medium">{character.name}</span>
        <span className={`turn-indicator text-white text-xs rounded-full w-5 h-5 flex items-center justify-center ${
          isActive 
            ? isOpponent ? 'bg-error' : 'bg-primary' 
            : 'bg-gray-600'
        }`}>
          {turnOrder}
        </span>
      </div>
      <div className="mt-3 grid grid-cols-3 gap-2 text-sm">
        <div>
          <label className="block text-gray-300 text-xs mb-1">HP</label>
          <div className="flex">
            <Button
              size="sm"
              variant="outline"
              className="px-2 h-8 bg-battleui border-gray-600 rounded-l-md hover:bg-gray-700 text-white"
              onClick={() => handleHpChange(-1)}
            >
              -
            </Button>
            <Input
              type="number"
              value={currentHp}
              onChange={handleHpInput}
              className="h-8 w-full bg-battleui border-t border-b border-gray-600 text-center text-white"
            />
            <Button
              size="sm"
              variant="outline"
              className="px-2 h-8 bg-battleui border-gray-600 rounded-r-md hover:bg-gray-700 text-white"
              onClick={() => handleHpChange(1)}
            >
              +
            </Button>
          </div>
        </div>
        <div>
          <label className="block text-gray-300 text-xs mb-1">Status</label>
          <Input
            type="text"
            value={status}
            onChange={handleStatusChange}
            placeholder="None"
            className="h-8 w-full bg-battleui border-gray-600 text-white"
          />
        </div>
        <div>
          <label className="block text-gray-300 text-xs mb-1">Actions</label>
          <Button
            size="sm"
            className={`w-full h-8 text-white text-xs ${isOpponent ? 'bg-error hover:bg-error/90' : 'bg-primary hover:bg-primary/90'}`}
          >
            Abilities
          </Button>
        </div>
      </div>
    </div>
  );
}
