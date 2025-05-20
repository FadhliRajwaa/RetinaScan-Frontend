import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, HashRouter } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import App from './App.jsx';
import './index.css';

// Gunakan HashRouter saat di production untuk menghindari masalah routing pada server static
// BrowserRouter memerlukan konfigurasi server side untuk menangani routing
const Router = import.meta.env.PROD ? HashRouter : BrowserRouter;

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Router>
      <ThemeProvider>
        <App />
      </ThemeProvider>
    </Router>
  </React.StrictMode>
);