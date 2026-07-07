/**
 * Manejador centralizado de errores de la API
 */

export class ApiError extends Error {
  constructor(message, statusCode, details) {
    super(message);
    this.name = 'ApiError';
    this.statusCode = statusCode;
    this.details = details;
  }
}

export const handleApiError = (error, context = '') => {
  const errorInfo = {
    message: error.message,
    statusCode: error.statusCode || null,
    context,
    timestamp: new Date().toISOString()
  };

  // Log detallado en desarrollo
  if (import.meta.env.DEV) {
    console.error(`[API Error - ${context}]`, errorInfo);
  }

  // Mensajes amigables para el usuario
  let userMessage = 'Ocurrió un error al conectar con la API';

  if (error instanceof ApiError) {
    switch (error.statusCode) {
      case 404:
        userMessage = 'Pokémon no encontrado';
        break;
      case 429:
        userMessage = 'Demasiadas solicitudes. Intenta de nuevo en un momento';
        break;
      case 500:
      case 502:
      case 503:
        userMessage = 'El servidor de Pokémon API está fuera de servicio';
        break;
      case 0:
        userMessage = 'No hay conexión a internet';
        break;
      default:
        userMessage = error.message;
    }
  }

  return { userMessage, errorInfo };
};

export const validateApiResponse = (data, expectedFields = []) => {
  if (!data || typeof data !== 'object') {
    throw new ApiError('Respuesta inválida de la API', 500, 'Invalid data type');
  }

  for (const field of expectedFields) {
    if (!(field in data)) {
      throw new ApiError(`Campo requerido faltante: ${field}`, 500, `Missing field: ${field}`);
    }
  }

  return data;
};
