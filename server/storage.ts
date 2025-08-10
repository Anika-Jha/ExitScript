import { type Excuse, type InsertExcuse } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  createExcuse(excuse: InsertExcuse): Promise<Excuse>;
  getRecentExcuses(limit?: number): Promise<Excuse[]>;
}

export class MemStorage implements IStorage {
  private excuses: Map<string, Excuse>;

  constructor() {
    this.excuses = new Map();
  }

  async createExcuse(insertExcuse: InsertExcuse): Promise<Excuse> {
    const id = randomUUID();
    const excuse: Excuse = { 
      ...insertExcuse, 
      id,
      createdAt: new Date()
    };
    this.excuses.set(id, excuse);
    return excuse;
  }

  async getRecentExcuses(limit: number = 10): Promise<Excuse[]> {
    return Array.from(this.excuses.values())
      .sort((a, b) => (b.createdAt?.getTime() || 0) - (a.createdAt?.getTime() || 0))
      .slice(0, limit);
  }
}

export const storage = new MemStorage();
