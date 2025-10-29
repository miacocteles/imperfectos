# 🚀 Desplegar Imperfectos en Vercel

## Pasos para Deploy

### 1. Crear cuenta en Vercel
- Ve a [vercel.com](https://vercel.com)
- Regístrate con GitHub

### 2. Subir código a GitHub
```bash
# Crear repositorio en GitHub (ve a github.com/new)
# Luego conecta tu repositorio local:
git remote add origin https://github.com/TU_USUARIO/imperfectos.git
git branch -M main
git push -u origin main
```

### 3. Importar en Vercel
1. En Vercel dashboard, click "Add New" → "Project"
2. Selecciona tu repositorio "imperfectos"
3. Click "Import"

### 4. Configurar Variables de Entorno
En la página de configuración del proyecto, agrega estas variables:

- **OPENAI_API_KEY**: Tu API key de OpenAI
- **DATABASE_URL**: Tu URL de Neon PostgreSQL

### 5. Deploy
- Click "Deploy"
- Espera 2-3 minutos
- ¡Tu app estará lista!

## URL de la Aplicación
Una vez desplegada, Vercel te dará una URL como:
```
https://imperfectos.vercel.app
```

Comparte esta URL con tu cliente y cualquier persona para que pruebe la app.

## Actualizaciones Automáticas
Cada vez que hagas `git push`, Vercel desplegará automáticamente la nueva versión.

## Problemas Comunes

### Error de Build
Si falla el build, verifica que:
- Las variables de entorno estén configuradas
- El DATABASE_URL sea válido (no el placeholder)

### Error 500
- Verifica que OPENAI_API_KEY esté configurada correctamente
- Revisa los logs en Vercel Dashboard → Tu Proyecto → Functions

## Soporte
Si necesitas ayuda, revisa los logs en Vercel Dashboard.
