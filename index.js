// server/index.ts
import express2 from "express";

// server/routes.ts
import { createServer } from "http";

// server/storage.ts
import session from "express-session";
import createMemoryStore from "memorystore";
var MemoryStore = createMemoryStore(session);
var MemStorage = class {
  users;
  characters;
  teams;
  battles;
  userIdCounter;
  characterIdCounter;
  teamIdCounter;
  battleIdCounter;
  sessionStore;
  constructor() {
    this.users = /* @__PURE__ */ new Map();
    this.characters = /* @__PURE__ */ new Map();
    this.teams = /* @__PURE__ */ new Map();
    this.battles = /* @__PURE__ */ new Map();
    this.userIdCounter = 1;
    this.characterIdCounter = 1;
    this.teamIdCounter = 1;
    this.battleIdCounter = 1;
    this.sessionStore = new MemoryStore({
      checkPeriod: 864e5
      // Clear expired sessions every 24h
    });
  }
  // User methods
  async getUsers() {
    return Array.from(this.users.values());
  }
  async getUser(id) {
    return this.users.get(id);
  }
  async getUserByUsername(username) {
    return Array.from(this.users.values()).find(
      (user) => user.username === username
    );
  }
  async createUser(user) {
    const id = this.userIdCounter++;
    const createdAt = /* @__PURE__ */ new Date();
    const newUser = { ...user, id, createdAt, isPublic: false };
    this.users.set(id, newUser);
    return newUser;
  }
  async updateUser(id, user) {
    const existingUser = this.users.get(id);
    if (!existingUser) return void 0;
    const updatedUser = { ...existingUser, ...user };
    this.users.set(id, updatedUser);
    return updatedUser;
  }
  async deleteUser(id) {
    return this.users.delete(id);
  }
  // Character methods
  async getCharacters(userId) {
    const characters2 = Array.from(this.characters.values());
    if (userId !== void 0) {
      return characters2.filter((character) => character.userId === userId);
    }
    return characters2;
  }
  async getPublicCharacters() {
    return Array.from(this.characters.values()).filter(
      (character) => character.isPublic
    );
  }
  async getCharacter(id) {
    return this.characters.get(id);
  }
  async createCharacter(character) {
    const id = this.characterIdCounter++;
    const createdAt = /* @__PURE__ */ new Date();
    const newCharacter = {
      ...character,
      id,
      createdAt,
      isPublic: character.isPublic || false
    };
    this.characters.set(id, newCharacter);
    return newCharacter;
  }
  async updateCharacter(id, character) {
    const existingCharacter = this.characters.get(id);
    if (!existingCharacter) return void 0;
    const updatedCharacter = { ...existingCharacter, ...character };
    this.characters.set(id, updatedCharacter);
    return updatedCharacter;
  }
  async deleteCharacter(id) {
    return this.characters.delete(id);
  }
  // Team methods
  async getTeams(userId) {
    const teams2 = Array.from(this.teams.values());
    if (userId !== void 0) {
      return teams2.filter((team) => team.userId === userId);
    }
    return teams2;
  }
  async getTeam(id) {
    return this.teams.get(id);
  }
  async createTeam(team) {
    const id = this.teamIdCounter++;
    const createdAt = /* @__PURE__ */ new Date();
    const characterAbilities = team.characterAbilities || {};
    const newTeam = { ...team, characterAbilities, id, createdAt };
    this.teams.set(id, newTeam);
    return newTeam;
  }
  async updateTeam(id, team) {
    const existingTeam = this.teams.get(id);
    if (!existingTeam) return void 0;
    const updatedTeam = { ...existingTeam, ...team };
    this.teams.set(id, updatedTeam);
    return updatedTeam;
  }
  async deleteTeam(id) {
    return this.teams.delete(id);
  }
  // Battle methods
  async getBattles(userId) {
    const battles2 = Array.from(this.battles.values());
    if (userId !== void 0) {
      return battles2.filter((battle) => battle.userId === userId);
    }
    return battles2;
  }
  async getBattle(id) {
    return this.battles.get(id);
  }
  async createBattle(battle) {
    const id = this.battleIdCounter++;
    const createdAt = /* @__PURE__ */ new Date();
    const newBattle = {
      ...battle,
      id,
      createdAt,
      currentTurn: battle.currentTurn || 1
    };
    this.battles.set(id, newBattle);
    return newBattle;
  }
  async updateBattle(id, battle) {
    const existingBattle = this.battles.get(id);
    if (!existingBattle) return void 0;
    const updatedBattle = { ...existingBattle, ...battle };
    this.battles.set(id, updatedBattle);
    return updatedBattle;
  }
  async deleteBattle(id) {
    return this.battles.delete(id);
  }
};
var storage = new MemStorage();

// server/routes.ts
import { z } from "zod";

// shared/schema.ts
import { pgTable, text, serial, integer, boolean, jsonb, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
var users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  email: text("email"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  isPublic: boolean("is_public").default(false).notNull()
  // Controls if user shares characters publicly
});
var characters = pgTable("characters", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  // Owner of the character
  name: text("name").notNull(),
  hp: integer("hp").notNull(),
  speed: integer("speed").notNull(),
  ac: integer("ac").notNull(),
  initiative: integer("initiative").notNull(),
  tags: text("tags"),
  abilities: jsonb("abilities").notNull().$type(),
  isPublic: boolean("is_public").default(false).notNull(),
  // Controls if character is publicly visible
  createdAt: timestamp("created_at").defaultNow().notNull()
});
var teams = pgTable("teams", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  // Owner of the team
  name: text("name").notNull(),
  characterIds: jsonb("character_ids").notNull().$type(),
  characterAbilities: jsonb("character_abilities").notNull().$type(),
  // Maps character IDs to ability IDs
  createdAt: timestamp("created_at").defaultNow().notNull()
});
var battles = pgTable("battles", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  // Owner of the battle
  name: text("name").notNull(),
  teamId: integer("team_id"),
  opponentTeamId: integer("opponent_team_id"),
  currentTurn: integer("current_turn").default(1),
  battleState: jsonb("battle_state").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull()
});
var insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true
});
var insertCharacterSchema = createInsertSchema(characters).omit({
  id: true,
  createdAt: true
});
var insertTeamSchema = createInsertSchema(teams).omit({
  id: true,
  createdAt: true
});
var insertBattleSchema = createInsertSchema(battles).omit({
  id: true,
  createdAt: true
});

// server/auth.ts
import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import session2 from "express-session";
import { scrypt, randomBytes, timingSafeEqual } from "crypto";
import { promisify } from "util";
var scryptAsync = promisify(scrypt);
async function hashPassword(password) {
  const salt = randomBytes(16).toString("hex");
  const buf = await scryptAsync(password, salt, 64);
  return `${buf.toString("hex")}.${salt}`;
}
async function comparePasswords(supplied, stored) {
  const [hashed, salt] = stored.split(".");
  const hashedBuf = Buffer.from(hashed, "hex");
  const suppliedBuf = await scryptAsync(supplied, salt, 64);
  return timingSafeEqual(hashedBuf, suppliedBuf);
}
function setupAuth(app2) {
  const sessionSettings = {
    secret: process.env.SESSION_SECRET || "tabletop-companion-secret",
    // Use env var in production
    resave: false,
    saveUninitialized: false,
    store: storage.sessionStore,
    cookie: {
      secure: process.env.NODE_ENV === "production",
      maxAge: 1e3 * 60 * 60 * 24 * 7
      // 1 week
    }
  };
  app2.set("trust proxy", 1);
  app2.use(session2(sessionSettings));
  app2.use(passport.initialize());
  app2.use(passport.session());
  passport.use(
    new LocalStrategy(async (username, password, done) => {
      try {
        const user = await storage.getUserByUsername(username);
        if (!user || !await comparePasswords(password, user.password)) {
          return done(null, false);
        }
        return done(null, user);
      } catch (err) {
        return done(err);
      }
    })
  );
  passport.serializeUser((user, done) => done(null, user.id));
  passport.deserializeUser(async (id, done) => {
    try {
      const user = await storage.getUser(id);
      if (!user) {
        return done(null, false);
      }
      done(null, user);
    } catch (err) {
      done(err, null);
    }
  });
  app2.post("/api/register", async (req, res, next) => {
    try {
      const existingUser = await storage.getUserByUsername(req.body.username);
      if (existingUser) {
        return res.status(400).json({ message: "Username already exists" });
      }
      const hashedPassword = await hashPassword(req.body.password);
      const user = await storage.createUser({
        ...req.body,
        password: hashedPassword
      });
      const { password, ...userWithoutPassword } = user;
      req.login(user, (err) => {
        if (err) return next(err);
        res.status(201).json(userWithoutPassword);
      });
    } catch (error) {
      console.error("Registration error:", error);
      res.status(500).json({ message: "Failed to register", error });
    }
  });
  app2.post("/api/login", passport.authenticate("local"), (req, res) => {
    const { password, ...userWithoutPassword } = req.user;
    res.status(200).json(userWithoutPassword);
  });
  app2.post("/api/logout", (req, res, next) => {
    req.logout((err) => {
      if (err) return next(err);
      res.sendStatus(200);
    });
  });
  app2.get("/api/user", (req, res) => {
    if (!req.isAuthenticated()) {
      return res.sendStatus(401);
    }
    const { password, ...userWithoutPassword } = req.user;
    res.json(userWithoutPassword);
  });
  app2.use("/api/characters", (req, res, next) => {
    if (req.method === "GET" && !req.params.id) {
      if (req.query.public === "true") {
        return next();
      }
    }
    if (!req.isAuthenticated() && req.method !== "GET") {
      return res.status(401).json({ message: "Authentication required" });
    }
    next();
  });
  app2.use("/api/teams", (req, res, next) => {
    if (!req.isAuthenticated() && req.method !== "GET") {
      return res.status(401).json({ message: "Authentication required" });
    }
    next();
  });
  app2.use("/api/battles", (req, res, next) => {
    if (!req.isAuthenticated() && req.method !== "GET") {
      return res.status(401).json({ message: "Authentication required" });
    }
    next();
  });
}

// server/routes.ts
async function registerRoutes(app2) {
  setupAuth(app2);
  app2.get("/api/characters", async (req, res) => {
    try {
      let characters2 = [];
      if (req.query.public === "true") {
        characters2 = await storage.getPublicCharacters();
      } else if (req.isAuthenticated()) {
        characters2 = await storage.getCharacters(req.user.id);
      }
      res.json(characters2);
    } catch (error) {
      res.status(500).json({ message: "Failed to get characters", error });
    }
  });
  app2.get("/api/characters/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid character ID" });
      }
      const character = await storage.getCharacter(id);
      if (!character) {
        return res.status(404).json({ message: "Character not found" });
      }
      res.json(character);
    } catch (error) {
      res.status(500).json({ message: "Failed to get character", error });
    }
  });
  app2.post("/api/characters", async (req, res) => {
    try {
      if (!req.isAuthenticated()) {
        return res.status(401).json({ message: "Authentication required" });
      }
      const characterData = insertCharacterSchema.parse({
        ...req.body,
        userId: req.user.id
        // Add the current user's ID
      });
      const newCharacter = await storage.createCharacter(characterData);
      res.status(201).json(newCharacter);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid character data", errors: error.format() });
      }
      res.status(500).json({ message: "Failed to create character", error });
    }
  });
  app2.put("/api/characters/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid character ID" });
      }
      const characterData = insertCharacterSchema.partial().parse(req.body);
      const updatedCharacter = await storage.updateCharacter(id, characterData);
      if (!updatedCharacter) {
        return res.status(404).json({ message: "Character not found" });
      }
      res.json(updatedCharacter);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid character data", errors: error.format() });
      }
      res.status(500).json({ message: "Failed to update character", error });
    }
  });
  app2.delete("/api/characters/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid character ID" });
      }
      const success = await storage.deleteCharacter(id);
      if (!success) {
        return res.status(404).json({ message: "Character not found" });
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Failed to delete character", error });
    }
  });
  app2.get("/api/teams", async (req, res) => {
    try {
      let teams2 = [];
      if (req.isAuthenticated()) {
        teams2 = await storage.getTeams(req.user.id);
      }
      res.json(teams2);
    } catch (error) {
      res.status(500).json({ message: "Failed to get teams", error });
    }
  });
  app2.get("/api/teams/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid team ID" });
      }
      const team = await storage.getTeam(id);
      if (!team) {
        return res.status(404).json({ message: "Team not found" });
      }
      res.json(team);
    } catch (error) {
      res.status(500).json({ message: "Failed to get team", error });
    }
  });
  app2.post("/api/teams", async (req, res) => {
    try {
      if (!req.isAuthenticated()) {
        return res.status(401).json({ message: "Authentication required" });
      }
      const teamData = insertTeamSchema.parse({
        ...req.body,
        userId: req.user.id
        // Add the current user's ID
      });
      const newTeam = await storage.createTeam(teamData);
      res.status(201).json(newTeam);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid team data", errors: error.format() });
      }
      res.status(500).json({ message: "Failed to create team", error });
    }
  });
  app2.put("/api/teams/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid team ID" });
      }
      const teamData = insertTeamSchema.partial().parse(req.body);
      const updatedTeam = await storage.updateTeam(id, teamData);
      if (!updatedTeam) {
        return res.status(404).json({ message: "Team not found" });
      }
      res.json(updatedTeam);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid team data", errors: error.format() });
      }
      res.status(500).json({ message: "Failed to update team", error });
    }
  });
  app2.delete("/api/teams/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid team ID" });
      }
      const success = await storage.deleteTeam(id);
      if (!success) {
        return res.status(404).json({ message: "Team not found" });
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Failed to delete team", error });
    }
  });
  app2.get("/api/battles", async (req, res) => {
    try {
      let battles2 = [];
      if (req.isAuthenticated()) {
        battles2 = await storage.getBattles(req.user.id);
      }
      res.json(battles2);
    } catch (error) {
      res.status(500).json({ message: "Failed to get battles", error });
    }
  });
  app2.get("/api/battles/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid battle ID" });
      }
      const battle = await storage.getBattle(id);
      if (!battle) {
        return res.status(404).json({ message: "Battle not found" });
      }
      res.json(battle);
    } catch (error) {
      res.status(500).json({ message: "Failed to get battle", error });
    }
  });
  app2.post("/api/battles", async (req, res) => {
    try {
      if (!req.isAuthenticated()) {
        return res.status(401).json({ message: "Authentication required" });
      }
      const battleData = insertBattleSchema.parse({
        ...req.body,
        userId: req.user.id
        // Add the current user's ID
      });
      const newBattle = await storage.createBattle(battleData);
      res.status(201).json(newBattle);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid battle data", errors: error.format() });
      }
      res.status(500).json({ message: "Failed to create battle", error });
    }
  });
  app2.put("/api/battles/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid battle ID" });
      }
      const battleData = insertBattleSchema.partial().parse(req.body);
      const updatedBattle = await storage.updateBattle(id, battleData);
      if (!updatedBattle) {
        return res.status(404).json({ message: "Battle not found" });
      }
      res.json(updatedBattle);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid battle data", errors: error.format() });
      }
      res.status(500).json({ message: "Failed to update battle", error });
    }
  });
  app2.delete("/api/battles/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid battle ID" });
      }
      const success = await storage.deleteBattle(id);
      if (!success) {
        return res.status(404).json({ message: "Battle not found" });
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Failed to delete battle", error });
    }
  });
  const httpServer = createServer(app2);
  return httpServer;
}

// server/vite.ts
import express from "express";
import fs from "fs";
import path2, { dirname as dirname2 } from "path";
import { fileURLToPath as fileURLToPath2 } from "url";
import { createServer as createViteServer, createLogger } from "vite";

// vite.config.ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import themePlugin from "@replit/vite-plugin-shadcn-theme-json";
import path, { dirname } from "path";
import runtimeErrorOverlay from "@replit/vite-plugin-runtime-error-modal";
import { fileURLToPath } from "url";
var __filename = fileURLToPath(import.meta.url);
var __dirname = dirname(__filename);
var vite_config_default = defineConfig({
  base: "/CollisionBoardGame/",
  // GitHub Pages base path
  plugins: [
    react(),
    runtimeErrorOverlay(),
    themePlugin(),
    ...process.env.NODE_ENV !== "production" && process.env.REPL_ID !== void 0 ? [
      await import("@replit/vite-plugin-cartographer").then(
        (m) => m.cartographer()
      )
    ] : []
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
      "@shared": path.resolve(__dirname, "shared"),
      "@assets": path.resolve(__dirname, "attached_assets")
    }
  },
  root: __dirname,
  build: {
    outDir: path.resolve(__dirname, "dist"),
    emptyOutDir: true
  }
});

// server/vite.ts
import { nanoid } from "nanoid";
var __filename2 = fileURLToPath2(import.meta.url);
var __dirname2 = dirname2(__filename2);
var viteLogger = createLogger();
function log(message, source = "express") {
  const formattedTime = (/* @__PURE__ */ new Date()).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true
  });
  console.log(`${formattedTime} [${source}] ${message}`);
}
async function setupVite(app2, server) {
  const serverOptions = {
    middlewareMode: true,
    hmr: { server },
    allowedHosts: true
  };
  const vite = await createViteServer({
    ...vite_config_default,
    configFile: false,
    customLogger: {
      ...viteLogger,
      error: (msg, options) => {
        viteLogger.error(msg, options);
        process.exit(1);
      }
    },
    server: serverOptions,
    appType: "custom"
  });
  app2.use(vite.middlewares);
  app2.use("*", async (req, res, next) => {
    const url = req.originalUrl;
    try {
      const clientTemplate = path2.resolve(
        __dirname2,
        "..",
        "client",
        "index.html"
      );
      let template = await fs.promises.readFile(clientTemplate, "utf-8");
      template = template.replace(
        `src="/src/main.tsx"`,
        `src="/src/main.tsx?v=${nanoid()}"`
      );
      const page = await vite.transformIndexHtml(url, template);
      res.status(200).set({ "Content-Type": "text/html" }).end(page);
    } catch (e) {
      vite.ssrFixStacktrace(e);
      next(e);
    }
  });
}
function serveStatic(app2) {
  const distPath = path2.resolve(__dirname2, "public");
  if (!fs.existsSync(distPath)) {
    throw new Error(
      `Could not find the build directory: ${distPath}, make sure to build the client first`
    );
  }
  app2.use(express.static(distPath));
  app2.use("*", (_req, res) => {
    res.sendFile(path2.resolve(distPath, "index.html"));
  });
}

// server/index.ts
var app = express2();
app.use(express2.json());
app.use(express2.urlencoded({ extended: false }));
app.use((req, res, next) => {
  const start = Date.now();
  const path3 = req.path;
  let capturedJsonResponse = void 0;
  const originalResJson = res.json;
  res.json = function(bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };
  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path3.startsWith("/api")) {
      let logLine = `${req.method} ${path3} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }
      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "\u2026";
      }
      log(logLine);
    }
  });
  next();
});
(async () => {
  const server = await registerRoutes(app);
  app.use((err, _req, res, _next) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    res.status(status).json({ message });
    throw err;
  });
  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }
  const port = 5e3;
  server.listen({
    port,
    host: "0.0.0.0",
    reusePort: true
  }, () => {
    log(`serving on port ${port}`);
  });
})();
