# 🔒 Sistema de Conexión Segura a PokeAPI

## Características de Seguridad Implementadas

### 1. **Variables de Entorno (.env.local)**
Almacena la configuración sensible fuera del código:
- `VITE_POKE_API_BASE`: URL base de la API
- `VITE_API_TIMEOUT`: Timeout para solicitudes (10s por defecto)
- `VITE_MAX_RETRIES`: Reintentos automáticos (3 por defecto)
- `VITE_CACHE_DURATION`: Duración del caché (1 hora por defecto)
- `VITE_RATE_LIMIT_DELAY`: Delay entre requests (100ms por defecto)

### 2. **Timeouts y Reintentos**
```javascript
- Timeout: 10 segundos para cada solicitud
- Reintentos: Hasta 3 intentos para fallos de red
- Backoff: Espera exponencial entre reintentos
```

### 3. **Rate Limiting**
- Controla el número de solicitudes simultáneas
- Evita sobrecargar la API con una cola de espera
- Delay configurable entre requests

### 4. **Sistema de Caché Inteligente**
- **Caché en Memoria**: Acceso rápido durante la sesión
- **Caché en localStorage**: Persistencia entre sesiones
- **Expiración**: 1 hora por defecto
- **Recuperación**: Usa caché si la API falla

### 5. **Manejo de Errores Robusto**
```javascript
ApiError: Clase personalizada para errores de API
- Diferencia entre errores de red y de API
- Mensajes amigables para el usuario
- Contexto detallado para debugging
```

### 6. **Validación de Datos**
- Valida estructura de respuestas
- Verifica campos requeridos
- Usa fallbacks para campos faltantes

### 7. **Monitoreo de Salud**
- `checkApiHealth()`: Verifica disponibilidad de la API
- Muestra alertas si la API no está disponible
- Permite reintentos manuales

## Estructura de Servicios

```
services/
├── pokemonService.js    # API principal con seguridad
├── cacheService.js      # Gestión de caché
├── errorHandler.js      # Manejo de errores
└── rateLimiter.js       # Control de velocidad
```

## Flujo de Solicitud Segura

```
1. Verificar caché en memoria ✓
   ↓ (si existe y no ha expirado)
2. Verificar caché en localStorage ✓
   ↓ (si existe y no ha expirado)
3. Ejecutar con rate limiting ✓
   ↓
4. Realizar fetch con timeout ✓
   ↓
5. Validar respuesta ✓
   ↓
6. Guardar en caché ✓
   ↓
7. Retornar datos ✓
```

## Manejo de Errores

### Tipos de Errores
1. **Network Error (timeout)**: Reintentos automáticos
2. **HTTP Error (404, 500)**: Mensaje específico
3. **Rate Limit (429)**: Espera y reintentos
4. **Invalid Response**: Usa datos en caché

### Notificaciones al Usuario
- ✅ Éxito: "Se cargaron 150 Pokémon correctamente"
- ⚠️ Advertencia: "API fuera de servicio. Mostrando datos en caché."
- ❌ Error: "Error al cargar los Pokémon"

## Uso

### En Desarrollo
```bash
npm run dev
# Las variables de .env.local se cargan automáticamente
```

### Personalización
Edita `.env.local` para ajustar:
```env
VITE_API_TIMEOUT=15000           # Timeout más largo
VITE_MAX_RETRIES=5               # Más reintentos
VITE_CACHE_DURATION=7200000      # Caché por 2 horas
VITE_RATE_LIMIT_DELAY=200        # Delay más largo
```

## Seguridad en Producción

### Recomendaciones
1. **Headers Seguros**: Implementar CORS adecuado
2. **HTTPS**: Usar siempre en producción
3. **CSP (Content Security Policy)**: Restringir orígenes
4. **Rate Limiting de Servidor**: Implementar en backend
5. **Monitoreo**: Registrar errores para análisis

### Build Producción
```bash
npm run build
# El archivo .env.local NO se incluye en el build
# Las variables se reemplazan en tiempo de build
```

## Ventajas del Sistema

✅ **Confiabilidad**: Reintentos y caché  
✅ **Rendimiento**: Caché en memoria y localStorage  
✅ **Seguridad**: Validación y timeouts  
✅ **UX**: Notificaciones claras  
✅ **Debugging**: Logs detallados en desarrollo  
✅ **Escalabilidad**: Rate limiting  

## Ejemplo de Uso

```javascript
import { fetchPokemonList, checkApiHealth } from './services/pokemonService';

// Verificar salud de la API
const health = await checkApiHealth();
if (!health.isHealthy) {
  console.log('API no disponible, usando caché');
}

// Cargar Pokémon (automáticamente usa caché si existe)
const pokemon = await fetchPokemonList(150);
```

## Troubleshooting

### "API fuera de servicio"
- Revisa tu conexión a internet
- Haz clic en "Reintentar"
- Los datos se mostrarán desde el caché local

### Caché muy antiguo
- Edita `VITE_CACHE_DURATION` en `.env.local`
- Limpia manualmente el caché con DevTools → Application → LocalStorage

### Solicitudes lentas
- Aumenta `VITE_API_TIMEOUT`
- Reduce `VITE_RATE_LIMIT_DELAY`

---

Sistema implementado con ❤️ para máxima confiabilidad
