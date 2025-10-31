import { db } from "./storage";
import { users, photos, defects } from "../shared/schema";
import { desc, eq } from "drizzle-orm";

async function checkDatabase() {
  console.log("🔍 Verificando usuarios más recientes...\n");
  
  const recentUsers = await db
    .select({
      id: users.id,
      name: users.name,
      age: users.age,
      bio: users.bio,
      createdAt: users.createdAt,
    })
    .from(users)
    .orderBy(desc(users.createdAt))
    .limit(3);

  console.log("Últimos 3 usuarios:");
  recentUsers.forEach((user, i) => {
    console.log(`\n${i + 1}. ${user.name} (${user.age} años)`);
    console.log(`   ID: ${user.id}`);
    console.log(`   Bio: ${user.bio?.substring(0, 50)}...`);
    console.log(`   Creado: ${user.createdAt}`);
  });

  if (recentUsers.length > 0) {
    const latestUserId = recentUsers[0].id;
    
    console.log(`\n\n📸 Verificando fotos del usuario ${recentUsers[0].name}...`);
    const userPhotos = await db
      .select()
      .from(photos)
      .where(eq(photos.userId, latestUserId));
    
    console.log(`Fotos: ${userPhotos.length}`);
    userPhotos.forEach((photo, i) => {
      console.log(`  ${i + 1}. ${photo.url.substring(0, 50)}...`);
    });

    console.log(`\n\n🩹 Verificando defectos del usuario ${recentUsers[0].name}...`);
    const userDefects = await db
      .select()
      .from(defects)
      .where(eq(defects.userId, latestUserId));
    
    console.log(`Defectos: ${userDefects.length}`);
    userDefects.forEach((defect, i) => {
      console.log(`  ${i + 1}. ${defect.category} - ${defect.description?.substring(0, 40)}`);
      console.log(`     Foto: ${defect.photoUrl ? 'Sí ✅' : 'No ❌'}`);
    });
  }

  console.log("\n\n✅ Verificación completa");
  process.exit(0);
}

checkDatabase().catch((error) => {
  console.error("❌ Error:", error);
  process.exit(1);
});
