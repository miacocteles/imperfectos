# Imperfectos - Imperfectos que hacen match

Una aplicación de citas innovadora donde las personas comparten sus defectos de personalidad y físicos. Los humanos somos imperfectos, y aquí reconocemos y celebramos lo que nos hace únicos, promoviendo conexiones basadas en la honestidad y la autenticidad.

## Visión General

Imperfectos es una plataforma que invierte el paradigma tradicional de las aplicaciones de citas. En lugar de destacar las virtudes, los usuarios comparten abiertamente sus defectos reales, tanto de personalidad como físicos. Reconocemos que ser humano es ser imperfecto, y celebramos estas imperfecciones. Un sistema de validación automática verifica que las fotos sean auténticas (no excesivamente editadas), y un algoritmo de matching conecta a personas con defectos similares o compatibles.

## Características Implementadas (MVP)

### 1. Sistema de Perfiles
- Creación de perfiles con nombre, edad y bio opcional
- Carga de hasta 6 fotos por perfil
- Validación de imágenes con IA (OpenAI GPT-5 Vision)
- Formulario intuitivo para agregar múltiples defectos

### 2. Sistema de Defectos
- Categorización por tipo: emocional, físico, personalidad, hábitos
- Título y descripción detallada para cada defecto
- Validación de contenido mínimo

### 3. Validación de Fotos con IA
- Integración con OpenAI GPT-5 para análisis de imágenes
- Detección de fotos excesivamente editadas o profesionales
- Feedback específico sobre por qué una foto es rechazada
- Sistema de puntuación (0-100) de autenticidad

### 4. Algoritmo de Matching
- Cálculo de compatibilidad basado en defectos compartidos
- Puntuación porcentual de compatibilidad
- Lista de defectos en común entre usuarios

### 5. Feed de Descubrimiento
- Vista de perfiles disponibles ordenados por compatibilidad
- Sistema de likes/pass similar a apps de citas tradicionales
- Vista detallada de perfiles con galería de fotos

### 6. Sistema de Matches
- Detección automática de likes mutuos
- Creación de matches con puntuación de compatibilidad
- Lista de matches con información destacada

### 7. Interfaz de Usuario
- Diseño minimalista y honesto
- Modo claro/oscuro
- Responsive (móvil y escritorio)
- Estados de carga y error elegantes
- Navegación intuitiva

## Arquitectura Técnica

### Frontend
- **Framework**: React con TypeScript
- **Routing**: Wouter
- **State Management**: TanStack Query (React Query)
- **Forms**: React Hook Form con Zod validation
- **UI Components**: Shadcn UI con Tailwind CSS
- **Theme**: Sistema de diseño personalizado con tokens CSS

### Backend
- **Runtime**: Node.js con Express
- **Database**: PostgreSQL (Neon)
- **ORM**: Drizzle ORM
- **File Handling**: Multer para carga de imágenes
- **AI Integration**: OpenAI GPT-5 Vision API

### Base de Datos
**Tablas**:
- `users`: Información básica de usuarios
- `defects`: Defectos de cada usuario con categorización
- `photos`: Imágenes con validación de IA
- `likes`: Registro de likes entre usuarios
- `matches`: Matches creados con compatibilidad

## Flujo de Usuario

1. **Selección/Creación de Perfil**: El usuario selecciona un perfil existente o crea uno nuevo
2. **Configuración de Perfil**: Agrega fotos (validadas por IA) y describe sus defectos
3. **Descubrimiento**: Navega perfiles ordenados por compatibilidad
4. **Interacción**: Da like o pass a perfiles
5. **Matching**: Se notifica cuando hay un match mutuo
6. **Conexión**: Ve la lista de matches con detalles de compatibilidad

## Configuración del Proyecto

### Variables de Entorno Requeridas
- `OPENAI_API_KEY`: API key de OpenAI para validación de imágenes
- `DATABASE_URL`: URL de conexión a PostgreSQL
- `SESSION_SECRET`: Secret para sesiones (auto-generado)

### Comandos Importantes
```bash
npm run dev          # Iniciar servidor de desarrollo
npm run db:push      # Sincronizar schema con base de datos
```

## Cambios Recientes

### 28 de Octubre, 2025
- Implementación completa del MVP
- Sistema de autenticación con selección de usuario
- Validación de imágenes con OpenAI GPT-5 Vision
- Algoritmo de matching basado en defectos compartidos
- Interfaz completa con todas las características MVP
- Validaciones de frontend y backend
- Manejo robusto de errores

## Características Futuras Planeadas
- Sistema de mensajería entre matches
- Categorización avanzada de defectos
- Verificación de perfil mejorada con múltiples fotos
- Filtros avanzados por tipo de defectos
- Estadísticas detalladas de compatibilidad
- Explicación de por qué dos personas son match

## Notas de Diseño

La aplicación sigue un diseño minimalista que refleja la filosofía de autenticidad:
- Paleta de colores cálida con tonos rosados/rojizos para el branding
- Tipografía Inter para legibilidad
- Espaciado generoso para respirabilidad
- Bordes redondeados sutiles
- Animaciones suaves y no intrusivas
- Estados visuales claros para todas las interacciones
