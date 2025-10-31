import { drizzle } from "drizzle-orm/neon-serverless";
import { Pool } from "@neondatabase/serverless";
import * as schema from "../shared/schema";
import { eq } from "drizzle-orm";

const pool = new Pool({ connectionString: process.env.DATABASE_URL! });
const db = drizzle(pool, { schema });

async function validateProfiles() {
  try {
    console.log("🔍 Buscando perfiles sin validar...");
    
    const unvalidatedProfiles = await db.query.users.findMany({
      where: eq(schema.users.isValidated, false),
      columns: {
        id: true,
        name: true,
        isValidated: true,
      }
    });
    
    console.log(`📊 Encontrados ${unvalidatedProfiles.length} perfiles sin validar`);
    
    if (unvalidatedProfiles.length === 0) {
      console.log("✅ Todos los perfiles ya están validados");
      process.exit(0);
    }
    
    for (const profile of unvalidatedProfiles) {
      await db.update(schema.users)
        .set({ isValidated: true })
        .where(eq(schema.users.id, profile.id));
      console.log(`✅ Perfil validado: ${profile.name}`);
    }
    
    console.log("\n🎉 ¡Todos los perfiles han sido validados!");
    process.exit(0);
  } catch (error) {
    console.error("❌ Error:", error);
    process.exit(1);
  }
}

validateProfiles();
