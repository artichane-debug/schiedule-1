import { createRoot } from "react-dom/client";
import App from "@/App";
import ErrorBoundary from "@/components/ErrorBoundary";
import "@/index.css";

const checkForUpdates = async () => {
  const currentVersion = '1.1.1';
  const storedVersion = localStorage.getItem('app-version');

  // If version changed, clear caches and unregister SW without deleting user data
  if (storedVersion && storedVersion !== currentVersion) {
    const userData = localStorage.getItem('schiedule-data');

    try {
      // Unregister all service workers if any are still controlling the page
      if ('serviceWorker' in navigator) {
        const regs = await navigator.serviceWorker.getRegistrations();
        await Promise.all(regs.map(r => r.unregister()));
      }

      // Clear Cache Storage (does not touch localStorage)
      if ('caches' in window) {
        const keys = await caches.keys();
        await Promise.all(keys.map(k => caches.delete(k)));
      }
    } catch (e) {
      console.warn('Update cleanup failed:', e);
    }

    // Preserve user data and bump stored version
    localStorage.clear();
    if (userData) {
      localStorage.setItem('schiedule-data', userData);
    }
    localStorage.setItem('app-version', currentVersion);

    // Force a hard reload to bypass any remaining caches
    window.location.reload();
    return;
  }

  // First load or already on latest
  localStorage.setItem('app-version', currentVersion);
};

checkForUpdates();

createRoot(document.getElementById("root")!).render(
  <ErrorBoundary>
    <App />
  </ErrorBoundary>
);
