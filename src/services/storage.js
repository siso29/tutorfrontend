// LocalStorage persistence helpers for client state
export function getStorage(key, defaultValue) {
  try {
    const item = localStorage.getItem(key);
    if (item === null) {
      if (defaultValue !== undefined) {
        setStorage(key, defaultValue);
      }
      return defaultValue;
    }
    return JSON.parse(item);
  } catch (error) {
    console.warn(`Error reading localStorage key "${key}":`, error);
    return defaultValue;
  }
}

export function setStorage(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error(`Error saving localStorage key "${key}":`, error);
  }
}

export function removeStorage(key) {
  try {
    localStorage.removeItem(key);
  } catch (error) {
    console.error(`Error removing localStorage key "${key}":`, error);
  }
}
