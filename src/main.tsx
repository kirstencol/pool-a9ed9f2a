
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import './styles/index.css';
import { MeetingProvider } from './context/meeting';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <MeetingProvider>
      <App />
    </MeetingProvider>
  </React.StrictMode>,
);
