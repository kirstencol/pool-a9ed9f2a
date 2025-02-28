
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { MeetingProvider } from './context/MeetingContext.tsx';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <MeetingProvider>
      <App />
    </MeetingProvider>
  </React.StrictMode>,
);
