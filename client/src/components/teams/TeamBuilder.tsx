import { useState, useEffect } from "react";
import { Character, Team } from "@shared/schema";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/hooks/use-toast";

interface TeamBuilderProps {
  team: Team | null;
  allCharacters: Character[];
  onSave: (team: Team) => void;
  onCancel: () => void;
}

export default function TeamBuilder({
  team,
  allCharacters,
  onSave,
  onCancel
}: TeamBuilderProps) {
  const [name, setName] = useState("");
  const [selectedCharacterIds, setSelectedCharacterIds] = useState<number[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const { toast } = useToast();

  // Initialize form when a team is selected
  useEffect(() => {
    if (team) {
      setName(team.name);
      setSelectedCharacterIds(team.characterIds);
    } else {
      // Reset form
      setName("");
      setSelectedCharacterIds([]);
    }
  }, [team]);

  const handleSave = () => {
    if (!name.trim()) {
      toast({
        title: "Validation Error",
        description: "Team name is required",
        variant: "destructive"
      });
      return;
    }
    
    const updatedTeam: Team = {
      id: team?.id || 0,
      name,
      characterIds: selectedCharacterIds
    };
    
    onSave(updatedTeam);
    toast({
      title: "Success",
      description: team?.id ? "Team updated" : "Team created",
    });
  };
  
  const handleAddCharacter = (id: number) => {
    if (!selectedCharacterIds.includes(id)) {
      setSelectedCharacterIds([...selectedCharacterIds, id]);
    }
  };
  
  const handleRemoveCharacter = (id: number) => {
    setSelectedCharacterIds(selectedCharacterIds.filter(charId => charId !== id));
  };
  
  // Filter available characters based on search
  const filteredCharacters = allCharacters.filter(character => 
    character.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
    !selectedCharacterIds.includes(character.id)
  );
  
  // Get selected characters
  const selectedCharacters = selectedCharacterIds
    .map(id => allCharacters.find(c => c.id === id))
    .filter(Boolean) as Character[];

  if (!team) {
    return (
      <Card className="w-full md:w-2/3 h-[calc(100vh-180px)]">
        <CardContent className="pt-6 flex h-full items-center justify-center">
          <div className="text-center text-gray-500">
            <i className="fas fa-users text-4xl mb-2"></i>
            <p>Select a team from the list or create a new one</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full md:w-2/3 h-[calc(100vh-180px)]">
      <CardContent className="pt-5">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-heading font-bold">Team Builder</h2>
          <span className="text-sm text-gray-600">
            <span id="team-count">{selectedCharacterIds.length}</span>/6 Members
          </span>
        </div>
        
        <ScrollArea className="h-[calc(100vh-260px)]">
          <div className="mb-4">
            <Label className="mb-1 font-medium">Team Name</Label>
            <Input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter team name"
            />
          </div>

          {/* Character Selection */}
          <div className="bg-gray-50 p-4 rounded-md mb-6">
            <h3 className="font-heading font-medium mb-3">Available Characters</h3>
            <div className="mb-3">
              <Input
                type="text"
                placeholder="Search characters..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            {allCharacters.length === 0 ? (
              <div className="text-center py-4 text-gray-500">
                <p>No characters available</p>
                <p className="text-sm mt-1">Create characters in the Characters tab first</p>
              </div>
            ) : filteredCharacters.length === 0 ? (
              <div className="text-center py-4 text-gray-500">
                <p>No matching characters found</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                {filteredCharacters.map(character => (
                  <div
                    key={character.id}
                    className="bg-white border rounded-md p-2 cursor-pointer hover:border-primary transition flex items-center text-sm"
                    onClick={() => handleAddCharacter(character.id)}
                  >
                    <div className="w-8 h-8 flex items-center justify-center bg-gray-200 rounded-full mr-2 text-xs font-medium">
                      <i className="fas fa-user"></i>
                    </div>
                    <div className="overflow-hidden">
                      <div className="truncate font-medium">{character.name}</div>
                      <div className="text-xs text-gray-500">HP: {character.hp}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Selected Team Members */}
          <div>
            <h3 className="font-heading font-medium mb-3">Team Members</h3>
            <div className="space-y-2">
              {selectedCharacters.length === 0 ? (
                <div className="text-center py-6 border border-dashed rounded-md">
                  <p className="text-gray-500">No team members selected</p>
                  <p className="text-sm text-gray-500 mt-1">Select characters from the list above</p>
                </div>
              ) : (
                selectedCharacters.map(character => (
                  <div
                    key={character.id}
                    className="border rounded-md p-3 bg-white flex justify-between items-center"
                  >
                    <div className="flex items-center">
                      <div className="w-10 h-10 flex items-center justify-center bg-primary text-white rounded-full mr-3">
                        <i className="fas fa-user"></i>
                      </div>
                      <div>
                        <div className="font-medium">{character.name}</div>
                        <div className="text-xs text-gray-500">
                          HP: {character.hp} | AC: {character.ac} | Speed: {character.speed}
                        </div>
                      </div>
                    </div>
                    <button
                      className="text-gray-400 hover:text-destructive transition"
                      title="Remove from team"
                      onClick={() => handleRemoveCharacter(character.id)}
                    >
                      <i className="fas fa-times"></i>
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="mt-6 flex justify-end">
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              className="mr-2"
            >
              Cancel
            </Button>
            <Button onClick={handleSave}>
              Save Team
            </Button>
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
