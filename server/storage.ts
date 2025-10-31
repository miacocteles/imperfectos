import { drizzle } from "drizzle-orm/neon-serverless";
import { Pool, neonConfig } from "@neondatabase/serverless";
import { eq, and, inArray, sql, ne } from "drizzle-orm";
import ws from "ws";
import * as schema from "@shared/schema";
import type {
  User,
  InsertUser,
  Defect,
  InsertDefect,
  Photo,
  InsertPhoto,
  Like,
  InsertLike,
  Match,
  InsertMatch,
  ProfileCard,
  ProfileWithDetails,
  MatchWithProfile,
} from "@shared/schema";

neonConfig.webSocketConstructor = ws;

const pool = new Pool({ connectionString: process.env.DATABASE_URL! });
const db = drizzle(pool, { schema });

export interface IStorage {
  // Users
  createUser(user: InsertUser): Promise<User>;
  getUser(id: string): Promise<User | undefined>;
  getAllUsers(): Promise<User[]>;
  
  // Defects
  createDefect(defect: InsertDefect): Promise<Defect>;
  getDefectsByUserId(userId: string): Promise<Defect[]>;
  
  // Photos
  createPhoto(photo: InsertPhoto): Promise<Photo>;
  updatePhotoValidation(id: string, isValidated: boolean, feedback: string | null): Promise<Photo | undefined>;
  getPhotosByUserId(userId: string): Promise<Photo[]>;
  
  // Likes
  createLike(like: InsertLike): Promise<Like>;
  getLikesBetweenUsers(userId1: string, userId2: string): Promise<Like[]>;
  
  // Matches
  createMatch(match: InsertMatch): Promise<Match>;
  getMatchesByUserId(userId: string): Promise<MatchWithProfile[]>;
  
  // Discovery
  getDiscoveryProfiles(currentUserId: string): Promise<ProfileCard[]>;
  getProfileWithDetails(userId: string): Promise<ProfileWithDetails | undefined>;
  
  // Compatibility
  calculateCompatibility(userId1: string, userId2: string): Promise<{ score: number; sharedDefects: string[] }>;
}

class DatabaseStorage implements IStorage {
  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db.insert(schema.users).values(insertUser).returning();
    return user;
  }

  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(schema.users).where(eq(schema.users.id, id));
    return user;
  }

  async getAllUsers(): Promise<User[]> {
    return db.select().from(schema.users);
  }

  async createDefect(insertDefect: InsertDefect): Promise<Defect> {
    const [defect] = await db.insert(schema.defects).values(insertDefect).returning();
    return defect;
  }

  async getDefectsByUserId(userId: string): Promise<Defect[]> {
    return db.select().from(schema.defects).where(eq(schema.defects.userId, userId));
  }

  async updateDefectPhoto(defectId: string, photoUrl: string): Promise<Defect | undefined> {
    const [defect] = await db
      .update(schema.defects)
      .set({ photoUrl })
      .where(eq(schema.defects.id, defectId))
      .returning();
    return defect;
  }

  async createPhoto(insertPhoto: InsertPhoto): Promise<Photo> {
    const [photo] = await db.insert(schema.photos).values(insertPhoto).returning();
    return photo;
  }

  async updatePhotoValidation(
    id: string,
    isValidated: boolean,
    feedback: string | null
  ): Promise<Photo | undefined> {
    const [photo] = await db
      .update(schema.photos)
      .set({ isValidated, validationFeedback: feedback })
      .where(eq(schema.photos.id, id))
      .returning();
    return photo;
  }

  async getPhotosByUserId(userId: string): Promise<Photo[]> {
    return db.select().from(schema.photos).where(eq(schema.photos.userId, userId));
  }

  async createLike(insertLike: InsertLike): Promise<Like> {
    const [like] = await db.insert(schema.likes).values(insertLike).returning();
    return like;
  }

  async getLikesBetweenUsers(userId1: string, userId2: string): Promise<Like[]> {
    return db
      .select()
      .from(schema.likes)
      .where(
        and(
          inArray(schema.likes.fromUserId, [userId1, userId2]),
          inArray(schema.likes.toUserId, [userId1, userId2])
        )
      );
  }

  async createMatch(insertMatch: InsertMatch): Promise<Match> {
    const [match] = await db.insert(schema.matches).values(insertMatch).returning();
    return match;
  }

  async getMatchesByUserId(userId: string): Promise<MatchWithProfile[]> {
    const matches = await db
      .select()
      .from(schema.matches)
      .where(
        sql`${schema.matches.user1Id} = ${userId} OR ${schema.matches.user2Id} = ${userId}`
      );

    const matchesWithProfiles: MatchWithProfile[] = [];

    for (const match of matches) {
      const otherUserId = match.user1Id === userId ? match.user2Id : match.user1Id;
      const otherUser = await this.getUser(otherUserId);
      
      if (!otherUser) continue;

      const otherUserPhotos = await this.getPhotosByUserId(otherUserId);
      const otherUserDefects = await this.getDefectsByUserId(otherUserId);

      matchesWithProfiles.push({
        ...match,
        otherUser,
        otherUserPhotos,
        otherUserDefects,
      });
    }

    return matchesWithProfiles;
  }

  async getDiscoveryProfiles(currentUserId: string): Promise<ProfileCard[]> {
    // Get users that the current user has already seen (liked OR disliked)
    const seenUserIds = await db
      .select({ id: schema.likes.toUserId })
      .from(schema.likes)
      .where(eq(schema.likes.fromUserId, currentUserId));

    const seenIds = seenUserIds.map(l => l.id);

    // Get all other users except current user and already seen users
    let users;
    if (seenIds.length > 0) {
      users = await db
        .select()
        .from(schema.users)
        .where(
          and(
            ne(schema.users.id, currentUserId),
            sql`${schema.users.id} NOT IN (${sql.join(seenIds.map(id => sql`${id}`), sql`, `)})`
          )
        )
        .limit(20);
    } else {
      users = await db
        .select()
        .from(schema.users)
        .where(ne(schema.users.id, currentUserId))
        .limit(20);
    }

    if (users.length === 0) {
      return [];
    }

    const userIds = users.map(u => u.id);

    // Get all defects for these users in one query
    const allDefects = await db
      .select()
      .from(schema.defects)
      .where(inArray(schema.defects.userId, userIds));

    // Get all photos for these users in one query
    const allPhotos = await db
      .select()
      .from(schema.photos)
      .where(inArray(schema.photos.userId, userIds));

    // Get current user's defects once
    const currentUserDefects = await this.getDefectsByUserId(currentUserId);

    const profiles: ProfileCard[] = [];

    for (const user of users) {
      const defects = allDefects.filter(d => d.userId === user.id);
      const photos = allPhotos.filter(p => p.userId === user.id);
      const primaryPhoto = photos.find(p => p.isPrimary && p.isValidated) || photos.find(p => p.isValidated);
      
      // Calculate compatibility score (simplified for performance)
      let compatibilityScore = 50; // base score
      if (defects.length > 0 && currentUserDefects.length > 0) {
        // Simple category matching
        const userCategories = new Set(defects.map(d => d.category));
        const matchingCategories = currentUserDefects.filter(d => userCategories.has(d.category));
        compatibilityScore = Math.min(100, 50 + (matchingCategories.length * 10));
      }

      profiles.push({
        id: user.id,
        name: user.name,
        age: user.age,
        primaryPhoto: primaryPhoto?.url || null,
        defectCount: defects.length,
        topDefects: defects.slice(0, 3).map(d => d.title),
        compatibilityScore,
      });
    }

    // Sort by compatibility score
    profiles.sort((a, b) => (b.compatibilityScore || 0) - (a.compatibilityScore || 0));

    return profiles;
  }

  async getProfileWithDetails(userId: string): Promise<ProfileWithDetails | undefined> {
    const user = await this.getUser(userId);
    if (!user) return undefined;

    const defects = await this.getDefectsByUserId(userId);
    const photos = await this.getPhotosByUserId(userId);

    return {
      ...user,
      defects,
      photos,
    };
  }

  async calculateCompatibility(
    userId1: string,
    userId2: string
  ): Promise<{ score: number; sharedDefects: string[] }> {
    const defects1 = await this.getDefectsByUserId(userId1);
    const defects2 = await this.getDefectsByUserId(userId2);

    if (defects1.length === 0 || defects2.length === 0) {
      return { score: 0, sharedDefects: [] };
    }

    // Find shared defects by category and similar titles
    const sharedDefects: string[] = [];
    
    for (const d1 of defects1) {
      for (const d2 of defects2) {
        if (d1.category === d2.category) {
          // Simple similarity check - if titles share common words
          const words1 = d1.title.toLowerCase().split(/\s+/);
          const words2 = d2.title.toLowerCase().split(/\s+/);
          const commonWords = words1.filter(w => words2.includes(w) && w.length > 3);
          
          if (commonWords.length > 0 && !sharedDefects.includes(d1.title)) {
            sharedDefects.push(d1.title);
          } else if (d1.category === d2.category && !sharedDefects.some(s => s.includes(d1.category))) {
            // At least share the same category
            sharedDefects.push(`Ambos tienen defectos de tipo: ${d1.category}`);
          }
        }
      }
    }

    // Calculate score based on shared defects
    const score = Math.min(100, Math.round((sharedDefects.length / Math.max(defects1.length, defects2.length)) * 100));

    return { score, sharedDefects };
  }
}

export const storage = new DatabaseStorage();

// Exportar db para uso en scripts
export { db };
