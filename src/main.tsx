import { createRoot } from "react-dom/client";
import App from "@/App";
import ErrorBoundary from "@/components/ErrorBoundary";
import "@/index.css";

const checkForUpdates = () => {
  const currentVersion = '1.0.6';
  const storedVersion = localStorage.getItem('app-version');
  
  if (storedVersion && storedVersion !== currentVersion) {
    const userData = localStorage.getItem('schiedule-data');
    localStorage.clear();
    if (userData) {
      localStorage.setItem('schiedule-data', userData);
    }
    localStorage.setItem('app-version', currentVersion);
    window.location.reload();
    return;
  }
  
  localStorage.setItem('app-version', currentVersion);
};

checkForUpdates();

createRoot(document.getElementById("root")!).render(
  <ErrorBoundary>
    <App />
  </ErrorBoundary>
);
