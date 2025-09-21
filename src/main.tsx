import { createRoot } from "react-dom/client";
import App from "@/App";
import ErrorBoundary from "@/components/ErrorBoundary";
import "@/index.css";

console.log('Main.tsx loaded - starting app');

// Auto-refresh detection for deployment updates
const checkForUpdates = () => {
  const currentVersion = '1.0.3'; // Increment this on each deployment
  const storedVersion = localStorage.getItem('app-version');
  
  if (storedVersion && storedVersion !== currentVersion) {
    console.log('New version detected, clearing cache...');
    // Clear all caches except user data
    const userData = localStorage.getItem('schiedule-data');
    localStorage.clear();
    if (userData) {
      localStorage.setItem('schiedule-data', userData);
    }
    localStorage.setItem('app-version', currentVersion);
    
    // Force reload to get fresh assets
    window.location.reload();
    return;
  }
  
  localStorage.setItem('app-version', currentVersion);
};

// Check for updates before starting app
checkForUpdates();

createRoot(document.getElementById("root")!).render(
  <ErrorBoundary>
    <App />
  </ErrorBoundary>
);
