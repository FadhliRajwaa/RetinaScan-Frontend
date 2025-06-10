# 🖥️ RetinaScan Frontend

<div align="center">
  
  ![RetinaScan Frontend](https://img.shields.io/badge/RetinaScan-Frontend-blue?style=for-the-badge)
  
  [![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org/)
  [![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
  [![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
  
  Aplikasi frontend untuk sistem RetinaScan yang dibangun dengan React, Vite, dan TailwindCSS.
</div>

## 📋 Daftar Isi
- [Pengenalan](#-pengenalan)
- [Fitur](#-fitur)
- [Teknologi](#-teknologi)
- [Memulai](#-memulai)
- [Struktur Proyek](#-struktur-proyek)
- [Konfigurasi](#-konfigurasi)
- [Deployment](#-deployment)

## 🔍 Pengenalan

Frontend RetinaScan adalah antarmuka pengguna untuk sistem deteksi retinopati diabetik. Aplikasi ini memungkinkan pengguna untuk mengunggah gambar retina, melihat hasil analisis, dan mengelola riwayat pemindaian.

## ✨ Fitur

- **Autentikasi Pengguna** - Login, registrasi, dan manajemen profil
- **Upload Gambar** - Unggah gambar retina untuk dianalisis
- **Visualisasi Hasil** - Lihat hasil analisis dengan visualisasi yang jelas
- **Riwayat Pemindaian** - Akses dan kelola riwayat pemindaian sebelumnya
- **Antarmuka Responsif** - Desain yang responsif untuk berbagai ukuran layar
- **Mode Gelap/Terang** - Pilihan tampilan sesuai preferensi pengguna

## 🛠 Teknologi

- **React** - Library JavaScript untuk membangun antarmuka pengguna
- **Vite** - Build tool yang cepat untuk pengembangan modern
- **TailwindCSS** - Framework CSS untuk desain yang cepat dan responsif
- **React Router** - Routing untuk aplikasi React
- **Axios** - HTTP client untuk komunikasi dengan API
- **React Query** - Manajemen state dan fetching data
- **React Hook Form** - Manajemen form dengan validasi
- **Zustand** - Manajemen state global yang ringan

## 🚀 Memulai

### Persyaratan

- Node.js (v14+)
- npm atau yarn

### Instalasi

1. Clone repository:
   ```bash
   git clone https://github.com/username/RetinaScan.git
   cd RetinaScan/frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   # atau
   yarn
   ```

3. Buat file `.env` di root folder:
   ```
   VITE_API_URL=http://localhost:5000
   VITE_APP_NAME=RetinaScan
   ```

4. Jalankan aplikasi:
   ```bash
   npm run dev
   # atau
   yarn dev
   ```

5. Buka aplikasi di browser:
   ```
   http://localhost:5173
   ```

## 📂 Struktur Proyek

```
frontend/
├── public/                # Asset publik
├── src/                   # Kode sumber
│   ├── assets/            # Asset statis (gambar, font, dll)
│   │   ├── common/        # Komponen umum (Button, Card, dll)
│   │   ├── layout/        # Komponen layout (Header, Footer, dll)
│   │   └── ui/            # Komponen UI khusus
│   ├── contexts/          # Context API untuk state management
│   ├── hooks/             # Custom hooks
│   ├── pages/             # Komponen halaman
│   │   ├── auth/          # Halaman autentikasi
│   │   ├── dashboard/     # Halaman dashboard
│   │   └── scan/          # Halaman pemindaian
│   ├── services/          # Layanan API dan utilitas
│   ├── store/             # State management global
│   ├── styles/            # Style global dan utilitas
│   ├── utils/             # Fungsi utilitas
│   ├── App.jsx            # Komponen utama
│   ├── main.jsx           # Entry point
│   └── routes.jsx         # Konfigurasi rute
├── .env                   # Environment variables
├── .gitignore             # File yang diabaikan Git
├── index.html             # HTML template
├── package.json           # Dependencies dan scripts
├── tailwind.config.js     # Konfigurasi TailwindCSS
└── vite.config.js         # Konfigurasi Vite
```

## ⚙️ Konfigurasi

### Environment Variables

Buat file `.env` di root folder dengan variabel berikut:

```
VITE_API_URL=http://localhost:5000        # URL backend API
VITE_APP_NAME=RetinaScan                  # Nama aplikasi
VITE_FLASK_API_URL=http://localhost:5001  # URL Flask API (opsional)
```

### Scripts

- `npm run dev` - Menjalankan server pengembangan
- `npm run build` - Membangun aplikasi untuk production
- `npm run preview` - Preview build production
- `npm run lint` - Menjalankan linter
- `npm run test` - Menjalankan test

## 🚢 Deployment

### Build untuk Production

```bash
npm run build
# atau
yarn build
```

Build akan menghasilkan folder `dist` yang berisi file statis yang siap di-deploy.

### Deployment ke Render

1. Buat New Web Service di Render
2. Hubungkan dengan repository GitHub
3. Pilih direktori `frontend`
4. Konfigurasi:
   - Build Command: `npm install && npm run build`
   - Start Command: `npm run start`
   - Output Directory: `dist`
5. Tambahkan environment variables yang diperlukan
6. Deploy!

---

<div align="center">
  <p>Bagian dari proyek RetinaScan - Sistem Deteksi Retinopati Diabetik</p>
</div>
