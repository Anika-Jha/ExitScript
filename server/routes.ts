import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { generateExcuseRequestSchema, insertExcuseSchema } from "@shared/schema";
import { generateExcuse } from "./services/openai";

export async function registerRoutes(app: Express): Promise<Server> {
  
  // Generate AI-powered excuse
  app.post("/api/excuses/generate", async (req, res) => {
    try {
      const { category, tone } = generateExcuseRequestSchema.parse(req.body);
      
      const result = await generateExcuse(category, tone);
      
      // Store the generated excuse
      const excuse = await storage.createExcuse({
        category,
        tone,
        content: result.excuse
      });

      res.json({
        id: excuse.id,
        content: result.excuse,
        category,
        tone,
        believability: result.believability,
        createdAt: excuse.createdAt,
        source: result.source
      });
    } catch (error) {
      console.error("Error generating excuse:", error);
      res.status(500).json({ 
        message: "Failed to generate excuse. Please try again.",
        error: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });

  // Get recent excuses
  app.get("/api/excuses/recent", async (req, res) => {
    try {
      const limit = parseInt(req.query.limit as string) || 10;
      const excuses = await storage.getRecentExcuses(limit);
      res.json(excuses);
    } catch (error) {
      console.error("Error fetching recent excuses:", error);
      res.status(500).json({ 
        message: "Failed to fetch recent excuses",
        error: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });

  // Emergency excuse endpoint - combines generation with immediate response
  app.post("/api/excuses/emergency", async (req, res) => {
    try {
      const { callType = "audio" } = req.body; // audio or video
      
      // Default to family emergency with urgent tone for panic situations
      const result = await generateExcuse("family", "urgent");
      
      const excuse = await storage.createExcuse({
        category: "family",
        tone: "urgent", 
        content: result.excuse
      });

      res.json({
        id: excuse.id,
        content: result.excuse,
        category: "family",
        tone: "urgent",
        believability: result.believability,
        createdAt: excuse.createdAt,
        source: result.source,
        callType: callType,
        fakeContact: {
          name: "Sarah Johnson",
          relationship: "Sister"
        }
      });
    } catch (error) {
      console.error("Error generating emergency excuse:", error);
      res.status(500).json({ 
        message: "Emergency excuse generation failed",
        error: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
