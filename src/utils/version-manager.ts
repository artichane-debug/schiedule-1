// Version management for handling app updates without losing user data
export const APP_VERSION = '1.0.2';
export const DATA_VERSION_KEY = 'schiedule-app-version';
export const DATA_KEY = 'schiedule-data';

export interface VersionInfo {
  version: string;
  timestamp: number;
}

export const getCurrentVersion = (): VersionInfo => {
  return {
    version: APP_VERSION,
    timestamp: Date.now()
  };
};

export const getStoredVersion = (): VersionInfo | null => {
  try {
    const stored = localStorage.getItem(DATA_VERSION_KEY);
    return stored ? JSON.parse(stored) : null;
  } catch (error) {
    console.warn('Failed to get stored version:', error);
    return null;
  }
};

export const setStoredVersion = (versionInfo: VersionInfo): void => {
  try {
    localStorage.setItem(DATA_VERSION_KEY, JSON.stringify(versionInfo));
  } catch (error) {
    console.warn('Failed to set stored version:', error);
  }
};

export const isVersionCompatible = (storedVersion: string, currentVersion: string): boolean => {
  // Simple version compatibility check
  // In the future, you can implement more sophisticated version comparison
  const stored = storedVersion.split('.').map(Number);
  const current = currentVersion.split('.').map(Number);
  
  // Major version must match, minor and patch can be different
  return stored[0] === current[0];
};

export const handleVersionUpdate = (): boolean => {
  const currentVersion = getCurrentVersion();
  const storedVersion = getStoredVersion();
  
  if (!storedVersion) {
    // First time user
    setStoredVersion(currentVersion);
    return true;
  }
  
  if (storedVersion.version !== currentVersion.version) {
    console.log(`App updated from ${storedVersion.version} to ${currentVersion.version}`);
    
    if (isVersionCompatible(storedVersion.version, currentVersion.version)) {
      // Compatible version - keep data, update version
      setStoredVersion(currentVersion);
      return true;
    } else {
      // Incompatible version - might need data migration
      console.warn('Version incompatible, data migration might be needed');
      setStoredVersion(currentVersion);
      return false;
    }
  }
  
  return true;
};

export const clearAppCache = (): void => {
  try {
    // Clear localStorage except for user data
    const userData = localStorage.getItem(DATA_KEY);
    localStorage.clear();
    
    // Restore user data
    if (userData) {
      localStorage.setItem(DATA_KEY, userData);
    }
    
    // Set current version
    setStoredVersion(getCurrentVersion());
    
    // Clear service worker caches
    if ('caches' in window) {
      caches.keys().then((cacheNames) => {
        cacheNames.forEach((cacheName) => {
          caches.delete(cacheName);
        });
      });
    }
    
    console.log('App cache cleared, user data preserved');
  } catch (error) {
    console.warn('Failed to clear app cache:', error);
  }
};
