import { 
  Character, 
  Team, 
  Battle, 
  InsertCharacter, 
  InsertTeam, 
  InsertBattle
} from "@shared/schema";

// Interface for storage operations
export interface IStorage {
  // Character operations
  getCharacters(): Promise<Character[]>;
  getCharacter(id: number): Promise<Character | undefined>;
  createCharacter(character: InsertCharacter): Promise<Character>;
  updateCharacter(id: number, character: Partial<InsertCharacter>): Promise<Character | undefined>;
  deleteCharacter(id: number): Promise<boolean>;
  
  // Team operations
  getTeams(): Promise<Team[]>;
  getTeam(id: number): Promise<Team | undefined>;
  createTeam(team: InsertTeam): Promise<Team>;
  updateTeam(id: number, team: Partial<InsertTeam>): Promise<Team | undefined>;
  deleteTeam(id: number): Promise<boolean>;
  
  // Battle operations
  getBattles(): Promise<Battle[]>;
  getBattle(id: number): Promise<Battle | undefined>;
  createBattle(battle: InsertBattle): Promise<Battle>;
  updateBattle(id: number, battle: Partial<InsertBattle>): Promise<Battle | undefined>;
  deleteBattle(id: number): Promise<boolean>;
}

// In-memory storage implementation
export class MemStorage implements IStorage {
  private characters: Map<number, Character>;
  private teams: Map<number, Team>;
  private battles: Map<number, Battle>;
  private characterIdCounter: number;
  private teamIdCounter: number;
  private battleIdCounter: number;

  constructor() {
    this.characters = new Map();
    this.teams = new Map();
    this.battles = new Map();
    this.characterIdCounter = 1;
    this.teamIdCounter = 1;
    this.battleIdCounter = 1;
  }

  // Character methods
  async getCharacters(): Promise<Character[]> {
    return Array.from(this.characters.values());
  }

  async getCharacter(id: number): Promise<Character | undefined> {
    return this.characters.get(id);
  }

  async createCharacter(character: InsertCharacter): Promise<Character> {
    const id = this.characterIdCounter++;
    const newCharacter: Character = { ...character, id };
    this.characters.set(id, newCharacter);
    return newCharacter;
  }

  async updateCharacter(id: number, character: Partial<InsertCharacter>): Promise<Character | undefined> {
    const existingCharacter = this.characters.get(id);
    if (!existingCharacter) return undefined;

    const updatedCharacter = { ...existingCharacter, ...character };
    this.characters.set(id, updatedCharacter);
    return updatedCharacter;
  }

  async deleteCharacter(id: number): Promise<boolean> {
    return this.characters.delete(id);
  }

  // Team methods
  async getTeams(): Promise<Team[]> {
    return Array.from(this.teams.values());
  }

  async getTeam(id: number): Promise<Team | undefined> {
    return this.teams.get(id);
  }

  async createTeam(team: InsertTeam): Promise<Team> {
    const id = this.teamIdCounter++;
    const newTeam: Team = { ...team, id };
    this.teams.set(id, newTeam);
    return newTeam;
  }

  async updateTeam(id: number, team: Partial<InsertTeam>): Promise<Team | undefined> {
    const existingTeam = this.teams.get(id);
    if (!existingTeam) return undefined;

    const updatedTeam = { ...existingTeam, ...team };
    this.teams.set(id, updatedTeam);
    return updatedTeam;
  }

  async deleteTeam(id: number): Promise<boolean> {
    return this.teams.delete(id);
  }

  // Battle methods
  async getBattles(): Promise<Battle[]> {
    return Array.from(this.battles.values());
  }

  async getBattle(id: number): Promise<Battle | undefined> {
    return this.battles.get(id);
  }

  async createBattle(battle: InsertBattle): Promise<Battle> {
    const id = this.battleIdCounter++;
    const newBattle: Battle = { ...battle, id };
    this.battles.set(id, newBattle);
    return newBattle;
  }

  async updateBattle(id: number, battle: Partial<InsertBattle>): Promise<Battle | undefined> {
    const existingBattle = this.battles.get(id);
    if (!existingBattle) return undefined;

    const updatedBattle = { ...existingBattle, ...battle };
    this.battles.set(id, updatedBattle);
    return updatedBattle;
  }

  async deleteBattle(id: number): Promise<boolean> {
    return this.battles.delete(id);
  }
}

export const storage = new MemStorage();
