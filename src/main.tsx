
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import './styles/index.css';
import { MeetingProvider } from './context/meeting';

// Debug element for root
console.log("DOM ready, looking for root element");

// Initialize the root and render the app with error handling
const rootElement = document.getElementById('root');
console.log("Root element found:", !!rootElement);

if (!rootElement) {
  console.error("Root element not found - this should never happen");
  // Create a fallback element to show error
  const fallbackEl = document.createElement('div');
  fallbackEl.innerHTML = '<div style="color: red; padding: 20px;">Error: Root element not found</div>';
  document.body.appendChild(fallbackEl);
} else {
  try {
    ReactDOM.createRoot(rootElement).render(
      <React.StrictMode>
        <MeetingProvider>
          <App />
        </MeetingProvider>
      </React.StrictMode>,
    );
    console.log("App successfully rendered");
  } catch (error) {
    console.error("Error rendering app:", error);
    rootElement.innerHTML = '<div style="color: red; padding: 20px;">Error rendering application. See console for details.</div>';
  }
}
