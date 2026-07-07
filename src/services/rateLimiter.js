/**
 * Rate limiter para evitar sobrecargar la API
 */

const queue = [];
let isProcessing = false;

const getRateLimitDelay = () => {
  return parseInt(import.meta.env.VITE_RATE_LIMIT_DELAY || '100');
};

export const executeWithRateLimit = async (fn) => {
  return new Promise((resolve, reject) => {
    queue.push({ fn, resolve, reject });
    processQueue();
  });
};

const processQueue = async () => {
  if (isProcessing || queue.length === 0) {
    return;
  }

  isProcessing = true;

  while (queue.length > 0) {
    const { fn, resolve, reject } = queue.shift();
    
    try {
      const result = await fn();
      resolve(result);
    } catch (error) {
      reject(error);
    }

    // Esperar el delay antes de procesar el siguiente
    if (queue.length > 0) {
      await new Promise(resolve => 
        setTimeout(resolve, getRateLimitDelay())
      );
    }
  }

  isProcessing = false;
};

export const clearQueue = () => {
  queue.length = 0;
  isProcessing = false;
};
