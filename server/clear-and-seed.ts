import "dotenv/config";
import { db } from "./storage";
import { users, defects, photos, likes, matches } from "@shared/schema";

async function clearDatabase() {
  console.log("🗑️  Limpiando base de datos...");
  
  try {
    // Delete in correct order due to foreign keys
    await db.delete(matches);
    console.log("✓ Matches eliminados");
    
    await db.delete(likes);
    console.log("✓ Likes eliminados");
    
    await db.delete(photos);
    console.log("✓ Fotos eliminadas");
    
    await db.delete(defects);
    console.log("✓ Defectos eliminados");
    
    await db.delete(users);
    console.log("✓ Usuarios eliminados");
    
    console.log("\n✅ Base de datos limpia");
    console.log("💡 Ahora ejecuta: npm run seed:simple\n");
    
    process.exit(0);
  } catch (error) {
    console.error("❌ Error:", error);
    process.exit(1);
  }
}

clearDatabase();
