import "dotenv/config";
import { db } from "./storage";
import { users, defects, photos } from "@shared/schema";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

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
    imagePrompts: [
      "Portrait of a bald overweight man in his 30s with a big belly, smiling naturally, casual selfie style",
      "Close-up photo of a bald man showing his receding hairline proudly",
      "Full body shot of an overweight man in casual clothes, natural lighting"
    ]
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
    imagePrompts: [
      "Portrait of a woman in her late 20s with visible acne on face, natural lighting, no makeup",
      "Close-up of a woman's face showing dark circles under eyes and skin texture",
      "Natural photo of a woman with acne, looking directly at camera confidently"
    ]
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
    imagePrompts: [
      "Portrait of a 45-year-old man with completely gray hair and deep wrinkles on forehead",
      "Close-up of a man's face showing crow's feet and worry lines, gray hair",
      "Professional but tired-looking man with gray hair working on laptop"
    ]
  },
  {
    name: "Laura",
    age: 35,
    bio: "Celulitis visible y insegura. Aprendiendo a aceptarme.",
    defects: [
      { category: "fisico", title: "Celulitis severa", description: "Celulitis visible en piernas y glúteos" },
      { category: "fisico", title: "Estrías", description: "Estrías en abdomen y muslos" },
      { category: "personalidad", title: "Baja autoestima", description: "Me comparo constantemente con otros" },
    ],
    imagePrompts: [
      "Natural photo showing a woman's legs with visible cellulite, beach setting",
      "Close-up of stretch marks on skin, natural lighting",
      "Woman in casual clothes showing natural body without filters"
    ]
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
    imagePrompts: [
      "Portrait of a young man with crooked teeth smiling awkwardly, showing teeth",
      "Side profile of a man showing prominent ears",
      "Shy-looking man with crooked teeth, natural expression"
    ]
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
    imagePrompts: [
      "Portrait of a woman with vitiligo patches on face, natural lighting",
      "Close-up showing vitiligo skin condition on hands and face",
      "Woman with visible facial hair on upper lip, natural photo"
    ]
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
    imagePrompts: [
      "Portrait of a man with beer belly and large nose, laughing",
      "Side profile showing man with prominent large nose",
      "Man with big belly holding a beer, casual setting"
    ]
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
    imagePrompts: [
      "Portrait of a young woman with face completely covered in freckles",
      "Close-up of woman with extremely frizzy curly hair and freckles",
      "Natural photo of freckled woman with messy wild hair"
    ]
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
    imagePrompts: [
      "Portrait of an obese man in his 50s with large belly and double chin",
      "Close-up showing man's double chin and neck fat",
      "Full body photo of very overweight man, natural lighting"
    ]
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
    imagePrompts: [
      "Close-up portrait of woman with visible acne scars and pitted skin texture",
      "Natural photo of woman's face showing oily skin and acne scarring",
      "Profile view of woman with acne scars on cheeks"
    ]
  },
  {
    name: "Miguel",
    age: 43,
    bio: "Calvo total y egoísta. Al menos soy honesto.",
    defects: [
      { category: "fisico", title: "Calvicie total", description: "Ni un pelo en la cabeza, calvo completo" },
      { category: "fisico", title: "Manchas de edad", description: "Manchas cafés en cara y brazos" },
      { category: "personalidad", title: "Egocentrico", description: "Todo gira en torno a mí, primero yo" },
    ],
    imagePrompts: [
      "Portrait of a completely bald man in his 40s with age spots on face",
      "Close-up of bald head showing shiny scalp and age spots",
      "Bald middle-aged man with sun damage spots on skin"
    ]
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
    imagePrompts: [
      "Photo showing woman's legs with visible varicose veins",
      "Close-up of woman's face with puffy eye bags underneath",
      "Natural photo of woman with tired eyes and visible eye bags"
    ]
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
    imagePrompts: [
      "Side view of a man with hunched posture and rounded shoulders",
      "Portrait of man with bad posture, slouching forward",
      "Man sitting with curved spine, poor posture visible"
    ]
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
    imagePrompts: [
      "Close-up of woman smiling showing stained yellow teeth",
      "Portrait of woman with large dark moles on face",
      "Woman with visible yellow teeth and facial moles, natural photo"
    ]
  },
  {
    name: "Pablo",
    age: 40,
    bio: "Barba con canas y impuntual. Siempre llego tarde.",
    defects: [
      { category: "fisico", title: "Barba desprolija con canas", description: "Barba irregular, mitad gris mitad negro" },
      { category: "fisico", title: "Entradas pronunciadas", description: "Frente amplia, perdiendo pelo en sienes" },
      { category: "personalidad", title: "Impuntualidad crónica", description: "Llego tarde a todo, es un problema serio" },
    ],
    imagePrompts: [
      "Portrait of man with patchy gray and black beard, receding hairline",
      "Close-up of man's face showing uneven beard with gray patches",
      "Man with salt and pepper beard and receding hairline, natural photo"
    ]
  }
];

async function generateImage(prompt: string): Promise<string> {
  try {
    console.log(`Generando imagen: ${prompt.substring(0, 50)}...`);
    
    const response = await openai.images.generate({
      model: "dall-e-3",
      prompt: prompt + " - realistic photography, natural, unfiltered, authentic",
      n: 1,
      size: "1024x1024",
      quality: "standard",
    });

    const imageUrl = response.data[0].url;
    if (!imageUrl) throw new Error("No se generó URL de imagen");
    
    // Descargar la imagen
    const imageResponse = await fetch(imageUrl);
    const arrayBuffer = await imageResponse.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const base64 = buffer.toString('base64');
    
    return base64;
  } catch (error) {
    console.error("Error generando imagen:", error);
    throw error;
  }
}

async function seedDatabase() {
  console.log("🌱 Iniciando seed de base de datos...");

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

      // Generar y crear fotos
      for (let j = 0; j < userData.imagePrompts.length; j++) {
        try {
          console.log(`  📸 Generando foto ${j + 1}/3...`);
          const base64Image = await generateImage(userData.imagePrompts[j]);
          
          await db.insert(photos).values({
            userId: user.id,
            url: `data:image/png;base64,${base64Image}`,
            isValidated: true,
            isPrimary: j === 0,
          });
          
          console.log(`  ✓ Foto ${j + 1} creada`);
          
          // Pequeña pausa para no saturar la API
          await new Promise(resolve => setTimeout(resolve, 2000));
        } catch (error) {
          console.error(`  ✗ Error generando foto ${j + 1}:`, error);
        }
      }

      console.log(`✅ Usuario ${userData.name} completado\n`);
      
      // Pausa entre usuarios para evitar rate limits
      if (i < seedUsers.length - 1) {
        console.log("⏳ Esperando 5 segundos antes del siguiente usuario...");
        await new Promise(resolve => setTimeout(resolve, 5000));
      }
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
