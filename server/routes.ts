import type { Express } from "express";
import { createServer, type Server } from "http";
import multer from "multer";
import { z } from "zod";
import { storage } from "./storage";
import { validatePhoto } from "./openai";

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("Only image files are allowed"));
    }
  },
});

// Simple in-memory session storage
let currentUserId: string | null = null;

export async function registerRoutes(app: Express): Promise<Server> {
  // Get current user
  app.get("/api/auth/current-user", async (req, res) => {
    try {
      if (!currentUserId) {
        return res.json({ user: null });
      }

      const user = await storage.getUser(currentUserId);
      if (!user) {
        currentUserId = null;
        return res.json({ user: null });
      }

      res.json({ user });
    } catch (error) {
      console.error("Error fetching current user:", error);
      res.status(500).json({ message: "Error fetching current user" });
    }
  });

  // Set current user (for demo purposes)
  app.post("/api/auth/set-user", async (req, res) => {
    try {
      const { userId } = req.body;
      
      if (!userId) {
        currentUserId = null;
        return res.json({ success: true });
      }

      const user = await storage.getUser(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      currentUserId = userId;
      res.json({ success: true, user });
    } catch (error) {
      console.error("Error setting current user:", error);
      res.status(500).json({ message: "Error setting current user" });
    }
  });

  // Get all users (for user selection)
  app.get("/api/users", async (req, res) => {
    try {
      const users = await storage.getAllUsers();
      res.json(users);
    } catch (error) {
      console.error("Error fetching users:", error);
      res.status(500).json({ message: "Error fetching users" });
    }
  });

  // Create profile with photos and defects
  app.post("/api/profiles", upload.fields([
    { name: 'photos', maxCount: 6 },
    { name: 'defectPhotos', maxCount: 10 }
  ]), async (req, res) => {
    try {
      const { name, age, bio, defects } = req.body;
      const files = req.files as { photos?: Express.Multer.File[], defectPhotos?: Express.Multer.File[] };
      const profilePhotos = files.photos || [];
      const defectPhotoFiles = files.defectPhotos || [];

      // Validation
      if (!name || !age) {
        return res.status(400).json({ message: "Name and age are required" });
      }

      const ageNum = parseInt(age);
      if (isNaN(ageNum) || ageNum < 18 || ageNum > 100) {
        return res.status(400).json({ message: "Age must be between 18 and 100" });
      }

      if (!profilePhotos || profilePhotos.length === 0) {
        return res.status(400).json({ message: "At least one photo is required" });
      }

      // Parse and validate defects
      let parsedDefects: Array<{ category: string; title: string; description: string }> = [];
      try {
        parsedDefects = JSON.parse(defects);
      } catch (e) {
        return res.status(400).json({ message: "Invalid defects format" });
      }

      if (!Array.isArray(parsedDefects) || parsedDefects.length === 0) {
        return res.status(400).json({ message: "At least one defect is required" });
      }

      // Validate each defect
      for (const defect of parsedDefects) {
        if (!defect.category || !defect.title || !defect.description) {
          return res.status(400).json({ message: "Each defect must have category, title, and description" });
        }
      }

      // Create user
      const user = await storage.createUser({
        name,
        age: ageNum,
        bio: bio || null,
      });

      // Set as current user
      currentUserId = user.id;

      // Create defects
      const createdDefects = [];
      for (let i = 0; i < parsedDefects.length; i++) {
        const defect = parsedDefects[i];
        const createdDefect = await storage.createDefect({
          userId: user.id,
          category: defect.category,
          title: defect.title,
          description: defect.description,
        });
        createdDefects.push({ index: i, id: createdDefect.id });
      }

      // Upload profile photos
      const photoPromises = profilePhotos.map(async (file, index) => {
        try {
          // Convert buffer to base64
          const base64Image = file.buffer.toString("base64");
          
          // Create photo record
          const photo = await storage.createPhoto({
            userId: user.id,
            url: `data:${file.mimetype};base64,${base64Image}`,
            isPrimary: index === 0,
          });

          // Auto-approve photos for now (validation disabled temporarily)
          await storage.updatePhotoValidation(
            photo.id,
            true,
            null
          );

          return { 
            photoId: photo.id, 
            isApproved: true,
            feedback: "Foto aceptada",
          };
        } catch (error) {
          console.error("Error processing photo:", error);
          return {
            photoId: null,
            isApproved: false,
            feedback: "Error procesando imagen",
          };
        }
      });

      const validationResults = await Promise.all(photoPromises);

      // Upload defect photos if any
      if (defectPhotoFiles && defectPhotoFiles.length > 0) {
        for (const file of defectPhotoFiles) {
          try {
            // Extract defect index from field name (e.g., "defectPhotos[0]" -> 0)
            const fieldNameMatch = file.fieldname.match(/\[(\d+)\]/);
            if (!fieldNameMatch) continue;
            
            const defectIndex = parseInt(fieldNameMatch[1]);
            const defectRecord = createdDefects.find(d => d.index === defectIndex);
            
            if (defectRecord) {
              // Convert buffer to base64
              const base64Image = file.buffer.toString("base64");
              const photoUrl = `data:${file.mimetype};base64,${base64Image}`;
              
              // Update defect with photo
              await storage.updateDefectPhoto(defectRecord.id, photoUrl);
            }
          } catch (error) {
            console.error("Error processing defect photo:", error);
          }
        }
      }

      res.json({
        user,
        validationResults,
      });
    } catch (error) {
      console.error("Error creating profile:", error);
      res.status(500).json({ message: "Error creating profile" });
    }
  });

  // Get discovery profiles
  app.get("/api/profiles/discover", async (req, res) => {
    try {
      if (!currentUserId) {
        return res.json([]);
      }

      const profiles = await storage.getDiscoveryProfiles(currentUserId);
      res.json(profiles);
    } catch (error) {
      console.error("Error fetching discovery profiles:", error);
      res.status(500).json({ message: "Error fetching profiles" });
    }
  });

  // Get profile details
  app.get("/api/profiles/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const profile = await storage.getProfileWithDetails(id);

      if (!profile) {
        return res.status(404).json({ message: "Profile not found" });
      }

      res.json(profile);
    } catch (error) {
      console.error("Error fetching profile:", error);
      res.status(500).json({ message: "Error fetching profile" });
    }
  });

  // Create a like
  app.post("/api/likes", async (req, res) => {
    try {
      if (!currentUserId) {
        return res.status(401).json({ message: "No current user" });
      }

      const { toUserId } = req.body;

      if (!toUserId) {
        return res.status(400).json({ message: "toUserId is required" });
      }

      // Create the like
      await storage.createLike({
        fromUserId: currentUserId,
        toUserId,
      });

      // Check if there's a mutual like (match)
      const likes = await storage.getLikesBetweenUsers(currentUserId, toUserId);
      
      const isMutualLike = likes.some(
        (like) => like.fromUserId === toUserId && like.toUserId === currentUserId
      );

      if (isMutualLike) {
        // Create a match
        const compatibility = await storage.calculateCompatibility(currentUserId, toUserId);
        
        const match = await storage.createMatch({
          user1Id: currentUserId,
          user2Id: toUserId,
          compatibilityScore: compatibility.score,
          sharedDefects: compatibility.sharedDefects,
        });

        return res.json({ isMatch: true, matchId: match.id });
      }

      res.json({ isMatch: false });
    } catch (error) {
      console.error("Error creating like:", error);
      res.status(500).json({ message: "Error creating like" });
    }
  });

  // Get matches
  app.get("/api/matches", async (req, res) => {
    try {
      if (!currentUserId) {
        return res.json([]);
      }

      const matches = await storage.getMatchesByUserId(currentUserId);
      res.json(matches);
    } catch (error) {
      console.error("Error fetching matches:", error);
      res.status(500).json({ message: "Error fetching matches" });
    }
  });

  // Seed database endpoint (clears DB and loads all 15 users with photos)
  app.post("/api/admin/seed", async (req, res) => {
    try {
      // Import database tables
      const { users: usersTable, defects: defectsTable, photos: photosTable, likes: likesTable, matches: matchesTable } = await import("@shared/schema");
      const { db } = await import("./storage");
      
      // Clear database
      await db.delete(matchesTable);
      await db.delete(likesTable);
      await db.delete(photosTable);
      await db.delete(defectsTable);
      await db.delete(usersTable);
      
      console.log("✓ Database cleared");
      
      // Import and execute seed module
      const { execSync } = await import("child_process");
      execSync("npx tsx server/seed-simple.ts", { 
        cwd: process.cwd(),
        stdio: "inherit" 
      });
      
      res.json({ 
        success: true, 
        message: "Base de datos limpiada y 15 usuarios creados con fotos completas"
      });
    } catch (error) {
      console.error("Error seeding database:", error);
      res.status(500).json({ message: "Error seeding database", error: String(error) });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
