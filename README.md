# RetinaScan Frontend

Aplikasi frontend untuk sistem RetinaScan yang dibangun dengan React dan Vite.

## Instalasi

```bash
npm install
```

## Environment Variables

Buat file `.env` di root folder frontend dengan variabel-variabel berikut:

```
# API URL untuk koneksi ke backend
VITE_API_URL=http://localhost:5000

# URL untuk dashboard (opsional)
VITE_DASHBOARD_URL=http://localhost:3001
```

## Development

```bash
npm run dev
```

## Build

```bash
npm run build
```

## Menjalankan Build

```bash
npm start
```

## Deployment

Aplikasi ini dikonfigurasi untuk di-deploy ke Render.

# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
