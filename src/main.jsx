import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App.jsx';
import './index.css';
import { ThemeProvider } from './context/ThemeContext.jsx';
import { initEmailJS } from './utils/emailService';

// Inisialisasi EmailJS
initEmailJS();

// Menggunakan BrowserRouter untuk mengatasi masalah routing static hosting
// BrowserRouter menambahkan # pada URL tapi menghindari masalah 404 saat refresh
// Contoh URL: https://retinascan.onrender.com/#/login 

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ThemeProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </ThemeProvider>
  </React.StrictMode>
);