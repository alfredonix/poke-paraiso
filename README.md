#  Poke Paraiso

Gestor web interactivo de Pokémon con búsqueda, favoritos y bloqueos. Integración segura con PokeAPI con caché, reintentos automáticos y manejo robusto de errores.

## ✨ Características

- **🔍 Búsqueda en Tiempo Real**: Busca Pokémon por nombre o ID
- **⭐ Sistema de Favoritos**: Marca tus Pokémon favoritos (persistente)
- **🚫 Bloqueo de Elementos**: Oculta Pokémon que no te interesan
- **🔒 Conexión Segura a API**: 
  - Timeout automático (10s)
  - Reintentos inteligentes (hasta 3 veces)
  - Rate limiting para evitar sobrecargas
  - Caché en memoria y localStorage
  - Validación de datos
- **⚡ Rendimiento Optimizado**: 
  - Caché de respuestas
  - Carga progresiva
  - Lazy loading
- **📱 Diseño Responsivo**: Funciona en desktop, tablet y móvil
- **🎨 UI Moderna**: Interfaz visual atractiva con animaciones

## 🚀 Inicio Rápido

### Requisitos
- Node.js 16+
- npm 7+

### Instalación

```bash
# Clonar o descargar el proyecto
cd poke-paraiso

# Instalar dependencias
npm install

# Iniciar en desarrollo
npm run dev
```

Abre `http://localhost:5173` en tu navegador.

## 📦 Build para Producción

```bash
npm run build
npm run preview
```

## � Despliegue en Vercel

### Opción 1: Desde GitHub (Recomendado)

1. **Sube tu proyecto a GitHub**
   ```bash
   git add .
   git commit -m "Proyecto PokeParaiso listo para deploy"
   git push origin main
   ```

2. **Accede a Vercel**
   - Ve a [vercel.com](https://vercel.com)
   - Haz clic en "Sign Up" y conecta tu cuenta de GitHub

3. **Importa tu proyecto**
   - Haz clic en "New Project"
   - Selecciona tu repositorio `poke-paraiso`
   - Vercel detectará automáticamente Vite
   - Haz clic en "Deploy"

4. **Tu app estará en vivo en 2-3 minutos** ✨

### Opción 2: Desde CLI (Vercel CLI)

```bash
# Instalar Vercel CLI globalmente
npm install -g vercel

# Deployar desde la carpeta del proyecto
cd poke-paraiso
vercel

# Responde las preguntas interactivas
# Tu app estará lista al instante
```

## 🚀 Despliegue en Netlify

### Opción 1: Drag & Drop (Más simple)

1. **Construye el proyecto**
   ```bash
   npm run build
   ```

2. **Ve a Netlify**
   - Accede a [netlify.com](https://netlify.com)
   - Haz clic en "Sign up" (gratis)

3. **Drag & Drop la carpeta `dist`**
   - Arrastra la carpeta `dist` a la zona de drop
   - ¡Tu app estará en vivo en segundos!

### Opción 2: Desde GitHub (Recomendado)

1. **Sube a GitHub**
   ```bash
   git add .
   git commit -m "Proyecto PokeParaiso listo para deploy"
   git push origin main
   ```

2. **Conecta en Netlify**
   - Ve a [netlify.com](https://netlify.com)
   - Haz clic en "New site from Git"
   - Selecciona GitHub y tu repositorio

3. **Configuración automática**
   - Netlify leerá `netlify.toml`
   - Build command: `npm run build`
   - Publish directory: `dist`
   - Haz clic en "Deploy"

4. **Tu sitio estará en vivo** 🎉

### Opción 3: Netlify CLI

```bash
# Instalar Netlify CLI globalmente
npm install -g netlify-cli

# Deployar desde la carpeta del proyecto
cd poke-paraiso
netlify deploy

# Selecciona las opciones y listo
```

## 📊 Comparación Vercel vs Netlify

| Característica | Vercel | Netlify |
|---|---|---|
| Precio | Gratis | Gratis |
| Deploy automático | Sí | Sí |
| Dominio personalizado | Sí | Sí |
| SSL/HTTPS | ✅ | ✅ |
| Velocidad | ⚡⚡⚡ | ⚡⚡ |
| Facilidad | Muy fácil | Muy fácil |

**Recomendación**: Usa **Vercel** para mejor rendimiento, o **Netlify** si prefieres interfaz más simple.

## 📱 Responsiveness

✅ **Desktop** (1024px+): Layout con sidebar lateral
✅ **Tablet** (768-1024px): Botón flotante, sidebar deslizable
✅ **Mobile** (<768px): Botón flotante, sidebar desde abajo

Prueba en diferentes tamaños: tu app se adapta automáticamente.

## �🔐 Seguridad de API

El sistema implementa múltiples capas de seguridad:

- ✅ **Validación de Respuestas**: Verifica estructura de datos
- ✅ **Timeouts**: Cancela solicitudes que tarden más de 10s
- ✅ **Reintentos Automáticos**: Reintenta hasta 3 veces en caso de fallos
- ✅ **Rate Limiting**: Controla velocidad de solicitudes
- ✅ **Caché Inteligente**: Guarda datos para acceso sin conexión
- ✅ **Manejo de Errores**: Mensajes claros para el usuario

Ver [API_SECURITY.md](API_SECURITY.md) para documentación completa.

## 📁 Estructura del Proyecto

```
poke-paraiso/
├── src/
│   ├── components/           # Componentes React
│   │   ├── PokemonCard.jsx   # Tarjeta individual
│   │   ├── PokemonList.jsx   # Lista y gestor
│   │   └── Notification.jsx  # Sistema de notificaciones
│   ├── services/             # Lógica de negocio
│   │   ├── pokemonService.js # API con seguridad
│   │   ├── cacheService.js   # Gestión de caché
│   │   ├── errorHandler.js   # Manejo de errores
│   │   └── rateLimiter.js    # Control de velocidad
│   ├── styles/               # Estilos CSS
│   │   ├── PokemonCard.css
│   │   ├── PokemonList.css
│   │   └── Notification.css
│   ├── App.jsx
│   ├── index.css
│   └── main.jsx
├── public/                   # Archivos estáticos
├── .env                      # Variables de entorno (ejemplo)
├── .env.local                # Variables de entorno (local)
├── vite.config.js
├── package.json
└── API_SECURITY.md          # Documentación de seguridad
```

## ⚙️ Configuración

Las variables de entorno en `.env.local` controlan el comportamiento:

```env
VITE_POKE_API_BASE=https://pokeapi.co/api/v2
VITE_API_TIMEOUT=10000              # Timeout en ms
VITE_MAX_RETRIES=3                  # Número de reintentos
VITE_CACHE_DURATION=3600000         # Caché por 1 hora
VITE_RATE_LIMIT_DELAY=100           # Delay entre requests (ms)
```

## 🛠️ Scripts

```bash
npm run dev      # Iniciar servidor de desarrollo
npm run build    # Build para producción
npm run preview  # Vista previa del build
npm run lint     # Ejecutar oxlint
```

## 📊 Estadísticas

- **150 Pokémon** cargados inicialmente
- **Búsqueda** por nombre e ID
- **Favoritos** ilimitados
- **Bloqueos** ilimitados
- **Caché** por 1 hora por defecto

## 🎯 Casos de Uso

### Búsqueda
1. Escribe en el campo de búsqueda
2. Filtra por nombre: "pikachu"
3. O filtra por ID: "#25"

### Favoritos
1. Haz clic en la estrella (⭐) en una tarjeta
2. Ver solo favoritos con el botón "★ Favoritos"
3. Los favoritos se guardan automáticamente

### Bloqueo
1. Haz clic en el símbolo de bloqueo (🚫)
2. El Pokémon se muestra con opacidad reducida
3. Los bloqueos se guardan automáticamente

## 🌐 API Utilizada

[PokeAPI v2](https://pokeapi.co/) - Libre y de código abierto

- ✅ Sin autenticación requerida
- ✅ Rate limit generoso
- ✅ Datos en tiempo real
- ✅ Datos históricos disponibles

## 🐛 Troubleshooting

### "API fuera de servicio"
- Verifica tu conexión a internet
- Haz clic en el botón "Reintentar"
- Los datos se mostrarán desde el caché local

### Datos no se actualizan
- Limpia el caché en DevTools → Application → LocalStorage
- O cambia `VITE_CACHE_DURATION` en `.env.local`

### Respuestas lentas
- Aumenta `VITE_API_TIMEOUT` en `.env.local`
- Reduce `VITE_RATE_LIMIT_DELAY` (úsalo con cuidado)

## 📝 Licencia

MIT - Libre para usar y modificar

## 🤝 Contribuciones

Las contribuciones son bienvenidas. Por favor:
1. Fork el proyecto
2. Crea una rama (`git checkout -b feature/mejora`)
3. Commit cambios (`git commit -m 'Agrega mejora'`)
4. Push a la rama (`git push origin feature/mejora`)
5. Abre un Pull Request

## 📞 Soporte

Para reportar problemas o sugerencias, por favor abre un issue en el repositorio.

---

Hecho con ❤️ para la comunidad Pokémon
