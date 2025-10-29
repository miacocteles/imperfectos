import "dotenv/config";
import { db } from "./storage";
import { users, defects, photos } from "@shared/schema";

// URLs de imágenes de placeholder de Unsplash (personas reales, diversas)
const placeholderImages = {
  overweight_man: [
    "https://images.unsplash.com/photo-1463453091185-61582044d556?w=800",
    "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800",
    "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=800"
  ],
  woman_natural: [
    "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=800",
    "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=800",
    "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=800"
  ],
  older_man: [
    "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=800",
    "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=800",
    "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=800"
  ],
  diverse_people: [
    "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=800",
    "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=800",
    "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=800",
    "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800",
    "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=800",
    "https://images.unsplash.com/photo-1531427186611-ecfd6d936c79?w=800",
    "https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?w=800",
    "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=800"
  ]
};

// Definición de usuarios con sus defectos
const seedUsers = [
  {
    name: "Carlos",
    age: 32,
    bio: "Gordo y orgulloso. Me encanta comer y no me avergüenzo de mi barriga.",
    defects: [
      { category: "fisico", title: "Sobrepeso", description: "Tengo 40 kilos de más y una barriga prominente" },
      { category: "fisico", title: "Calvicie avanzada", description: "Perdí todo el pelo a los 28 años" },
      { category: "personalidad", title: "Procrastinador crónico", description: "Dejo todo para último momento" },
    ],
    images: placeholderImages.overweight_man
  },
  {
    name: "María",
    age: 28,
    bio: "Acné adulto y carácter fuerte. No finjo ser perfecta.",
    defects: [
      { category: "fisico", title: "Acné severo", description: "Tengo acné en cara y espalda desde la adolescencia" },
      { category: "fisico", title: "Ojeras pronunciadas", description: "Siempre parezco cansada por mis ojeras" },
      { category: "personalidad", title: "Mal genio", description: "Me enojo fácilmente y grito cuando me frustro" },
    ],
    images: placeholderImages.woman_natural
  },
  {
    name: "Jorge",
    age: 45,
    bio: "Canoso prematuro y adicto al trabajo. La vida me marcó.",
    defects: [
      { category: "fisico", title: "Canas prematuras", description: "Todo el pelo gris desde los 30" },
      { category: "fisico", title: "Arrugas profundas", description: "Arrugas marcadas en frente y ojos" },
      { category: "personalidad", title: "Workaholic", description: "No puedo desconectar del trabajo, reviso emails 24/7" },
    ],
    images: placeholderImages.older_man
  },
  {
    name: "Laura",
    age: 35,
    bio: "Celulitis visible e insegura. Aprendiendo a aceptarme.",
    defects: [
      { category: "fisico", title: "Celulitis severa", description: "Celulitis visible en piernas y glúteos" },
      { category: "fisico", title: "Estrías", description: "Estrías en abdomen y muslos" },
      { category: "personalidad", title: "Baja autoestima", description: "Me comparo constantemente con otros" },
    ],
    images: [placeholderImages.diverse_people[0], placeholderImages.diverse_people[1], placeholderImages.diverse_people[2]]
  },
  {
    name: "Roberto",
    age: 29,
    bio: "Dientes chuecos y tímido. Sonrío poco pero soy buena onda.",
    defects: [
      { category: "fisico", title: "Dientes torcidos", description: "Nunca usé brackets, dientes muy chuecos" },
      { category: "fisico", title: "Orejas grandes", description: "Orejas prominentes que sobresalen" },
      { category: "personalidad", title: "Timidez extrema", description: "Me cuesta hablar con personas nuevas" },
    ],
    images: [placeholderImages.diverse_people[3], placeholderImages.diverse_people[4], placeholderImages.overweight_man[1]]
  },
  {
    name: "Patricia",
    age: 41,
    bio: "Manchas en la piel y controladora. Soy quien soy.",
    defects: [
      { category: "fisico", title: "Vitiligo", description: "Manchas blancas en cara y manos por vitiligo" },
      { category: "fisico", title: "Vello facial", description: "Crecimiento de vello en mentón y labio superior" },
      { category: "personalidad", title: "Control freak", description: "Necesito controlar todo, me estresa el desorden" },
    ],
    images: [placeholderImages.woman_natural[1], placeholderImages.woman_natural[2], placeholderImages.diverse_people[5]]
  },
  {
    name: "Andrés",
    age: 38,
    bio: "Pancita cervecera y ruidoso. Me río fuerte de todo.",
    defects: [
      { category: "fisico", title: "Barriga cervecera", description: "Abdomen prominente por amor a la cerveza" },
      { category: "fisico", title: "Nariz grande", description: "Nariz grande y ancha, muy notoria" },
      { category: "personalidad", title: "Habla muy fuerte", description: "No controlo el volumen de mi voz" },
    ],
    images: [placeholderImages.overweight_man[2], placeholderImages.older_man[1], placeholderImages.diverse_people[6]]
  },
  {
    name: "Sofía",
    age: 26,
    bio: "Pecas extremas y desordenada. Mi cuarto es un caos.",
    defects: [
      { category: "fisico", title: "Pecas en exceso", description: "Cara cubierta de pecas y manchas solares" },
      { category: "fisico", title: "Cabello rebelde", description: "Pelo súper crespo e indomable" },
      { category: "personalidad", title: "Desorganizada total", description: "Pierdo todo, mi vida es un desastre" },
    ],
    images: [placeholderImages.diverse_people[7], placeholderImages.woman_natural[0], placeholderImages.diverse_people[1]]
  },
  {
    name: "Fernando",
    age: 52,
    bio: "Panza grande y mentiroso compulsivo. Trabajo en ello.",
    defects: [
      { category: "fisico", title: "Obesidad", description: "100+ kilos, panza muy grande" },
      { category: "fisico", title: "Papada pronunciada", description: "Doble mentón muy visible" },
      { category: "personalidad", title: "Mentiroso compulsivo", description: "Miento sin necesidad, es automático" },
    ],
    images: [placeholderImages.older_man[2], placeholderImages.overweight_man[0], placeholderImages.older_man[0]]
  },
  {
    name: "Diana",
    age: 31,
    bio: "Cicatrices de acné y celosa. Mi piel cuenta historias.",
    defects: [
      { category: "fisico", title: "Cicatrices de acné", description: "Marcas profundas en mejillas y frente" },
      { category: "fisico", title: "Piel grasa", description: "Cara siempre brillante por grasa excesiva" },
      { category: "personalidad", title: "Celos enfermizos", description: "Reviso el celular de mi pareja constantemente" },
    ],
    images: [placeholderImages.diverse_people[4], placeholderImages.woman_natural[1], placeholderImages.diverse_people[2]]
  },
  {
    name: "Miguel",
    age: 43,
    bio: "Calvo total y egoísta. Al menos soy honesto.",
    defects: [
      { category: "fisico", title: "Calvicie total", description: "Ni un pelo en la cabeza, calvo completo" },
      { category: "fisico", title: "Manchas de edad", description: "Manchas cafés en cara y brazos" },
      { category: "personalidad", title: "Egocéntrico", description: "Todo gira en torno a mí, primero yo" },
    ],
    images: [placeholderImages.older_man[1], placeholderImages.diverse_people[3], placeholderImages.older_man[2]]
  },
  {
    name: "Valeria",
    age: 37,
    bio: "Várices visibles y criticona. Digo lo que pienso.",
    defects: [
      { category: "fisico", title: "Várices", description: "Venas varicosas muy visibles en piernas" },
      { category: "fisico", title: "Bolsas en ojos", description: "Bolsas permanentes bajo los ojos" },
      { category: "personalidad", title: "Criticona", description: "Critico todo y a todos, no me callo nada" },
    ],
    images: [placeholderImages.woman_natural[2], placeholderImages.diverse_people[5], placeholderImages.woman_natural[0]]
  },
  {
    name: "Héctor",
    age: 34,
    bio: "Joroba y pesimista. La vida es dura.",
    defects: [
      { category: "fisico", title: "Postura encorvada", description: "Espalda encorvada, joroba visible" },
      { category: "fisico", title: "Acné en espalda", description: "Espinillas y granos en toda la espalda" },
      { category: "personalidad", title: "Pesimista crónico", description: "Todo lo veo mal, siempre espero lo peor" },
    ],
    images: [placeholderImages.diverse_people[6], placeholderImages.overweight_man[1], placeholderImages.diverse_people[7]]
  },
  {
    name: "Raquel",
    age: 29,
    bio: "Dientes amarillos y chismosa. Café es mi vida.",
    defects: [
      { category: "fisico", title: "Dientes manchados", description: "Dientes amarillos por café y cigarro" },
      { category: "fisico", title: "Lunares grandes", description: "Lunares grandes y oscuros en cara" },
      { category: "personalidad", title: "Chismosa", description: "Me encanta el chisme, cuento todo lo que sé" },
    ],
    images: [placeholderImages.diverse_people[0], placeholderImages.woman_natural[1], placeholderImages.diverse_people[4]]
  },
  {
    name: "Pablo",
    age: 40,
    bio: "Barba con canas e impuntual. Siempre llego tarde.",
    defects: [
      { category: "fisico", title: "Barba desprolija con canas", description: "Barba irregular, mitad gris mitad negro" },
      { category: "fisico", title: "Entradas pronunciadas", description: "Frente amplia, perdiendo pelo en sienes" },
      { category: "personalidad", title: "Impuntualidad crónica", description: "Llego tarde a todo, es un problema serio" },
    ],
    images: [placeholderImages.older_man[0], placeholderImages.diverse_people[3], placeholderImages.older_man[1]]
  }
];

async function seedDatabase() {
  console.log("🌱 Iniciando seed de base de datos con imágenes de placeholder...");

  try {
    for (let i = 0; i < seedUsers.length; i++) {
      const userData = seedUsers[i];
      console.log(`\n👤 Creando usuario ${i + 1}/${seedUsers.length}: ${userData.name}`);

      // Crear usuario
      const [user] = await db.insert(users).values({
        name: userData.name,
        age: userData.age,
        bio: userData.bio,
      }).returning();

      console.log(`✓ Usuario creado: ${user.id}`);

      // Crear defectos
      for (const defect of userData.defects) {
        await db.insert(defects).values({
          userId: user.id,
          category: defect.category,
          title: defect.title,
          description: defect.description,
        });
      }
      console.log(`✓ ${userData.defects.length} defectos creados`);

      // Crear fotos con URLs de placeholder
      for (let j = 0; j < userData.images.length; j++) {
        await db.insert(photos).values({
          userId: user.id,
          url: userData.images[j],
          isValidated: true,
          isPrimary: j === 0,
        });
      }
      
      console.log(`✓ ${userData.images.length} fotos creadas`);
      console.log(`✅ Usuario ${userData.name} completado\n`);
    }

    console.log("\n🎉 ¡Seed completado exitosamente!");
    console.log(`📊 Creados: ${seedUsers.length} usuarios con perfiles, defectos y fotos`);
    
  } catch (error) {
    console.error("❌ Error en seed:", error);
    throw error;
  }
}

// Ejecutar seed
seedDatabase()
  .then(() => {
    console.log("\n✨ Proceso terminado");
    process.exit(0);
  })
  .catch((error) => {
    console.error("\n💥 Error fatal:", error);
    process.exit(1);
  });
