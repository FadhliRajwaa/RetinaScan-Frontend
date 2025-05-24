import React from 'react';
import ReactDOM from 'react-dom/client';
import { HashRouter } from 'react-router-dom';
import App from './App.jsx';
import './index.css';
import { ThemeProvider } from './context/ThemeContext.jsx';
import { initEmailJS } from './utils/emailService';

// Inisialisasi EmailJS
initEmailJS();

// Menggunakan HashRouter untuk mengatasi masalah routing static hosting
// HashRouter menambahkan # pada URL dan menghindari masalah 404 saat refresh
// Contoh URL: https://retinascan.onrender.com/#/login 

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ThemeProvider>
      <HashRouter>
        <App />
      </HashRouter>
    </ThemeProvider>
  </React.StrictMode>
);