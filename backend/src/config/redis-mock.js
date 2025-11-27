// Mock Redis для локальной разработки без Redis
const cache = new Map();

export const connectRedis = () => {
  console.log('Using in-memory cache (Redis disabled)');
};

export const getCache = async (key) => {
  return cache.get(key) || null;
};

export const setCache = async (key, value, ttl) => {
  cache.set(key, value);
  if (ttl) {
    setTimeout(() => cache.delete(key), ttl * 1000);
  }
  return 'OK';
};

export const deleteCache = async (key) => {
  return cache.delete(key);
};

export const deleteCachePattern = async (pattern) => {
  const keysToDelete = [];
  for (const key of cache.keys()) {
    if (key.includes(pattern.replace('*', ''))) {
      keysToDelete.push(key);
    }
  }
  keysToDelete.forEach(key => cache.delete(key));
  return keysToDelete.length;
};

export const clearAllCache = async () => {
  cache.clear();
  return 'OK';
};