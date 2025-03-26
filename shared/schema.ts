import { pgTable, text, serial, integer, boolean, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Character Schema
export const characters = pgTable("characters", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  hp: integer("hp").notNull(),
  speed: integer("speed").notNull(),
  ac: integer("ac").notNull(),
  initiative: integer("initiative").notNull(),
  tags: text("tags"),
  abilities: jsonb("abilities").notNull().$type<Ability[]>(),
});

// Team Schema
export const teams = pgTable("teams", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  characterIds: jsonb("character_ids").notNull().$type<number[]>(),
});

// Battle Schema
export const battles = pgTable("battles", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  teamId: integer("team_id"),
  opponentTeamId: integer("opponent_team_id"),
  currentTurn: integer("current_turn").default(1),
  battleState: jsonb("battle_state").notNull(),
});

// Schemas for Zod validation
export type Ability = {
  id: string;
  name: string;
  description: string;
  damage?: string;
  range?: string;
  effect?: string;
  isPassive: boolean;
};

export type BattleCharacterState = {
  characterId: number;
  currentHp: number;
  status: string;
  turnOrder: number;
};

export type BattleState = {
  allies: BattleCharacterState[];
  opponents: BattleCharacterState[];
};

// Insert schemas
export const insertCharacterSchema = createInsertSchema(characters).omit({
  id: true,
});

export const insertTeamSchema = createInsertSchema(teams).omit({
  id: true,
});

export const insertBattleSchema = createInsertSchema(battles).omit({
  id: true,
});

// Type definitions
export type InsertCharacter = z.infer<typeof insertCharacterSchema>;
export type InsertTeam = z.infer<typeof insertTeamSchema>;
export type InsertBattle = z.infer<typeof insertBattleSchema>;
export type Character = typeof characters.$inferSelect;
export type Team = typeof teams.$inferSelect;
export type Battle = typeof battles.$inferSelect;
