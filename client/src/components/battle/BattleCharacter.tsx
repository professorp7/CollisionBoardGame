import { Character, Ability } from "@shared/schema";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { DraggableItemProps } from "@/components/ui/draggable";

interface BattleCharacterProps {
  character: Character;
  currentHp: number;
  status: string;
  turnOrder: number;
  isActive: boolean;
  isOpponent?: boolean;
  onUpdateHp: (hp: number) => void;
  onUpdateStatus: (status: string) => void;
  onUseAbility?: (ability: Ability) => void;
  dragHandleProps?: React.HTMLAttributes<HTMLDivElement>;
}

export default function BattleCharacter({
  character,
  currentHp,
  status,
  turnOrder,
  isActive,
  isOpponent = false,
  onUpdateHp,
  onUpdateStatus,
  onUseAbility,
  dragHandleProps
}: BattleCharacterProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  
  // Calculate HP percentage for health bar
  const hpPercentage = Math.max(0, Math.min(100, (currentHp / character.hp) * 100));
  const healthBarColor = hpPercentage > 60 ? 'bg-green-500' : hpPercentage > 30 ? 'bg-amber-500' : 'bg-red-500';
  
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
    <div className={`
      p-4 rounded-lg border-2 transition-colors
      ${isActive ? 'border-primary bg-primary/10' : 'border-gray-700 bg-gray-800/50'}
      ${isOpponent ? 'border-red-500/50' : ''}
    `}>
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-lg font-medium">{character.name}</h3>
        <span className="text-sm bg-gray-700 px-2 py-1 rounded">
          Turn {turnOrder}
        </span>
      </div>
      
      {/* Stats */}
      <div className="grid grid-cols-3 gap-2 mb-3 text-sm">
        <div className="bg-gray-700/50 p-2 rounded">
          <div className="text-gray-400">Initiative</div>
          <div>{character.initiative}</div>
        </div>
        <div className="bg-gray-700/50 p-2 rounded">
          <div className="text-gray-400">Speed</div>
          <div>{character.speed}</div>
        </div>
        <div className="bg-gray-700/50 p-2 rounded">
          <div className="text-gray-400">AC</div>
          <div>{character.ac}</div>
        </div>
      </div>

      {/* HP Bar */}
      <div className="mb-3">
        <div className="flex justify-between text-sm mb-1">
          <span>HP</span>
          <span>{currentHp} / {character.hp}</span>
        </div>
        <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
          <div 
            className={`h-full ${healthBarColor} transition-all`}
            style={{ width: `${hpPercentage}%` }}
          />
        </div>
        <div className="flex gap-2 mt-2">
          <button
            onClick={() => handleHpChange(-1)}
            className="px-2 py-1 bg-red-500/20 rounded hover:bg-red-500/30"
          >
            -1
          </button>
          <input
            type="number"
            value={currentHp}
            onChange={handleHpInput}
            className="w-16 bg-gray-700 rounded px-2 text-center"
          />
          <button
            onClick={() => handleHpChange(1)}
            className="px-2 py-1 bg-green-500/20 rounded hover:bg-green-500/30"
          >
            +1
          </button>
        </div>
      </div>

      {/* Status */}
      <div>
        <label className="text-sm text-gray-400 block mb-1">Status</label>
        <input
          type="text"
          value={status}
          onChange={handleStatusChange}
          placeholder="Enter status effects..."
          className="w-full bg-gray-700 rounded px-3 py-1"
        />
      </div>
    </div>
  );

  return (
    <Collapsible 
      open={isExpanded} 
      onOpenChange={setIsExpanded}
      className={`battle-character bg-battleui-light rounded-md overflow-hidden transition-shadow ${
        isActive ? 'ring-2 ring-offset-0 ring-primary/50' : ''
      } ${
        isExpanded ? 'shadow-lg' : ''
      }`}
    >
      <div className="relative">
        {isActive && (
          <div className={`absolute top-0 left-0 w-1 h-full ${isOpponent ? 'bg-error' : 'bg-primary'}`}></div>
        )}
        
        {/* Character Header with Drag Handle */}
        <div className="p-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div 
                {...dragHandleProps} 
                className="w-6 h-6 flex items-center justify-center rounded-full bg-gray-700 cursor-move"
              >
                <span className="text-xs">{turnOrder}</span>
              </div>
              <span className="font-medium">{character.name}</span>
              {status && (
                <Badge variant="outline" className="text-xs border-amber-500 text-amber-400">
                  {status}
                </Badge>
              )}
            </div>
            <CollapsibleTrigger asChild>
              <button className="h-5 w-5 rounded-full hover:bg-gray-700 flex items-center justify-center">
                <i className={`fas fa-chevron-${isExpanded ? 'up' : 'down'} text-xs`}></i>
              </button>
            </CollapsibleTrigger>
          </div>
          
          {/* Health Bar */}
          <div className="mt-2 h-2 bg-gray-700 rounded-full overflow-hidden">
            <div 
              className={`h-full ${healthBarColor} transition-all duration-500`}
              style={{ width: `${hpPercentage}%` }}
            ></div>
          </div>
          
          {/* Character Stats */}
          <div className="mt-2 grid grid-cols-4 gap-1 text-xs text-gray-300">
            <div>HP: {currentHp}/{character.hp}</div>
            <div>AC: {character.ac}</div>
            <div>SPD: {character.speed}</div>
            <div>INIT: {character.initiative}</div>
          </div>
        </div>
      </div>
      
      {/* Collapsible Content */}
      <CollapsibleContent>
        <div className="p-3 pt-0 border-t border-gray-700 mt-2">
          {/* HP Controls */}
          <div className="grid grid-cols-2 gap-3 mb-3">
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
          </div>
          
          {/* Abilities Section */}
          <div>
            <label className="block text-gray-300 text-xs mb-2">Abilities</label>
            <div className="space-y-2 max-h-36 overflow-y-auto pr-1">
              {character.abilities.map(ability => (
                <div 
                  key={ability.id}
                  className={`p-2 rounded-md border border-gray-700 hover:border-primary cursor-pointer ${
                    ability.isPassive ? 'bg-gray-700/50' : 'bg-gray-800/50'
                  }`}
                  onClick={() => onUseAbility && !ability.isPassive && onUseAbility(ability)}
                >
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">{ability.name}</span>
                    {ability.isPassive ? (
                      <Badge variant="outline" className="text-xs">Passive</Badge>
                    ) : (
                      <Button 
                        size="sm" 
                        variant="ghost" 
                        className="h-6 px-2 text-xs hover:bg-primary/20"
                        onClick={(e) => {
                          e.stopPropagation();
                          onUseAbility && onUseAbility(ability);
                        }}
                      >
                        Use
                      </Button>
                    )}
                  </div>
                  <p className="text-xs text-gray-400 mt-1 line-clamp-2">{ability.description}</p>
                  {(ability.damage || ability.range || ability.effect) && (
                    <div className="grid grid-cols-3 gap-1 mt-1 text-xs">
                      {ability.damage && (
                        <div className="text-red-400">DMG: {ability.damage}</div>
                      )}
                      {ability.range && (
                        <div className="text-blue-400">RNG: {ability.range}</div>
                      )}
                      {ability.effect && (
                        <div className="text-amber-400">EFF: {ability.effect}</div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
}
