import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import ErrorBoundary from './component/ErrorBoundary';

const rootEl = document.getElementById('root');
if (!rootEl) {
  throw new Error('Missing #root in index.html — the React app cannot mount.');
}

createRoot(rootEl).render(
  <StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </StrictMode>
);
