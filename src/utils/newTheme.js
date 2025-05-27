// Tema dan warna aplikasi dengan dukungan untuk mode gelap dan terang
// Dengan peningkatan untuk desain modern dan aksesibilitas yang lebih baik

// Warna dasar dengan skema warna yang lebih modern
export const newTheme = {
  // Primary colors - Palet warna utama
  primary: {
    50: '#e3f6fd',
    100: '#b3e4fa',
    200: '#81d1f7',
    300: '#4ebef3',
    400: '#25aef1',
    500: '#089eef', // Warna utama
    600: '#0690e0',
    700: '#047cce',
    800: '#0369be',
    900: '#0349a0',
  },
  
  // Secondary colors - Aksen dan highlight
  secondary: {
    50: '#f3e8fd',
    100: '#e3c6fb',
    200: '#d0a1f9',
    300: '#be7cf7',
    400: '#b061f5',
    500: '#a145f3', // Warna sekunder
    600: '#9540e0',
    700: '#8538c8',
    800: '#7530b2',
    900: '#5c2490',
  },
  
  // Accent colors - Untuk emphasis dan call-to-action
  accent: {
    50: '#eefbf2',
    100: '#d0f4dd',
    200: '#a7ebc5',
    300: '#75e0a7',
    400: '#43d689',
    500: '#1dcb6b', // Warna aksen
    600: '#15bc59',
    700: '#0ea847',
    800: '#089337',
    900: '#027626',
  },
  
  // Background colors
  background: {
    light: '#FFFFFF',
    light2: '#F5F7FA',
    light3: '#EDF1F7',
    dark: '#121212',
    dark2: '#1E1E1E',
    dark3: '#292929',
  },
  
  // Text colors with improved contrast
  text: {
    primary: '#2B2D42',
    secondary: '#575A7B',
    tertiary: '#8D91A5',
    light: '#F8F9FA',
    light2: '#E9ECEF',
    dark: '#212529',
    dark2: '#343A40',
  },
  
  // Border colors
  border: {
    light: '#E1E5EB',
    dark: '#3A3A3A',
  },
  
  // Semantic colors
  semantic: {
    success: '#06c270',
    warning: '#ffcc00',
    error: '#ff3b30',
    info: '#007aff',
  },
  
  // Glass effect with better blur for modern UI
  glass: {
    light: {
      background: 'rgba(255, 255, 255, 0.7)',
      blur: '10px',
      border: '1px solid rgba(255, 255, 255, 0.18)',
    },
    dark: {
      background: 'rgba(18, 18, 18, 0.75)',
      blur: '10px',
      border: '1px solid rgba(255, 255, 255, 0.08)',
    },
  },
  
  // Shadow variants
  shadow: {
    sm: '0 2px 4px rgba(0, 0, 0, 0.05)',
    md: '0 4px 6px rgba(0, 0, 0, 0.07)',
    lg: '0 10px 15px rgba(0, 0, 0, 0.1)',
    xl: '0 20px 25px rgba(0, 0, 0, 0.15)',
    inner: 'inset 0 2px 4px rgba(0, 0, 0, 0.05)',
    outline: '0 0 0 3px rgba(8, 158, 239, 0.3)',
    none: 'none',
  }
};

// Animasi yang lebih modern dan responsif
export const enhancedAnimations = {
  // Animasi halaman
  page: {
    initial: { opacity: 0, y: 5 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -5 },
    transition: { duration: 0.3, ease: [0.25, 0.1, 0.25, 1.0] },
  },
  
  // Animasi untuk elemen yang muncul
  fadeIn: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    transition: { duration: 0.4, ease: 'easeOut' },
  },
  
  // Animasi untuk elemen yang masuk dari bawah
  slideUp: {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5, ease: [0.25, 0.1, 0.25, 1.0] },
  },
  
  // Animasi untuk elemen yang masuk dari kiri
  slideRight: {
    initial: { opacity: 0, x: -20 },
    animate: { opacity: 1, x: 0 },
    transition: { duration: 0.5, ease: [0.25, 0.1, 0.25, 1.0] },
  },
  
  // Animasi untuk elemen yang masuk dari kanan
  slideLeft: {
    initial: { opacity: 0, x: 20 },
    animate: { opacity: 1, x: 0 },
    transition: { duration: 0.5, ease: [0.25, 0.1, 0.25, 1.0] },
  },
  
  // Animasi untuk elemen yang masuk dari atas
  slideDown: {
    initial: { opacity: 0, y: -20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5, ease: [0.25, 0.1, 0.25, 1.0] },
  },
  
  // Animasi untuk elemen hover
  hover: {
    scale: 1.02,
    transition: { duration: 0.2, ease: 'easeOut' },
  },
  
  // Animasi untuk elemen tap
  tap: {
    scale: 0.98,
    transition: { duration: 0.1 },
  },
  
  // Animasi untuk elemen yang berulang
  pulse: {
    animate: { 
      scale: [1, 1.03, 1],
      opacity: [0.9, 1, 0.9],
    },
    transition: { 
      duration: 2, 
      ease: 'easeInOut', 
      repeat: Infinity,
      repeatType: 'mirror',
    },
  },
  
  // Animasi untuk staggered children
  staggerContainer: {
    animate: { transition: { staggerChildren: 0.1 } }
  },
  
  // Animasi untuk transisi tema gelap/terang
  themeTransition: {
    type: 'tween',
    duration: 0.3,
    ease: [0.25, 0.1, 0.25, 1.0],
  },
};

// Breakpoint untuk responsive design
export const breakpoints = {
  xs: '480px',
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px',
};

// Spasi konsisten
export const spacing = {
  px: '1px',
  0: '0',
  0.5: '0.125rem',
  1: '0.25rem',
  1.5: '0.375rem',
  2: '0.5rem',
  2.5: '0.625rem',
  3: '0.75rem',
  3.5: '0.875rem',
  4: '1rem',
  5: '1.25rem',
  6: '1.5rem',
  7: '1.75rem',
  8: '2rem',
  9: '2.25rem',
  10: '2.5rem',
  11: '2.75rem',
  12: '3rem',
  14: '3.5rem',
  16: '4rem',
  20: '5rem',
  24: '6rem',
  28: '7rem',
  32: '8rem',
  36: '9rem',
  40: '10rem',
  44: '11rem',
  48: '12rem',
  52: '13rem',
  56: '14rem',
  60: '15rem',
  64: '16rem',
  72: '18rem',
  80: '20rem',
  96: '24rem',
};

// Konfigurasi untuk animasi Lottie
export const lottieConfig = {
  defaultOptions: {
    loop: true,
    autoplay: true,
    rendererSettings: {
      preserveAspectRatio: 'xMidYMid slice'
    }
  },
  // Beberapa ID animasi Lottie yang bisa digunakan
  animations: {
    eyeScan: 'https://assets3.lottiefiles.com/packages/lf20_xgdtj2yh.json', // Animasi pemindaian mata
    medicalScan: 'https://assets10.lottiefiles.com/packages/lf20_tutvdkg0.json', // Animasi scan medis
    loading: 'https://assets9.lottiefiles.com/packages/lf20_x62chJ.json', // Loading spinner
    success: 'https://assets10.lottiefiles.com/packages/lf20_atippmse.json', // Animasi sukses
    error: 'https://assets2.lottiefiles.com/packages/lf20_qpwbiyxf.json', // Animasi error
    wave: 'https://assets7.lottiefiles.com/packages/lf20_jtbfg2nb.json', // Animasi gelombang
    login: 'https://assets2.lottiefiles.com/packages/lf20_k9wsvzgd.json', // Animasi login
    register: 'https://assets10.lottiefiles.com/packages/lf20_q5qvqtnr.json', // Animasi register
    forgotPassword: 'https://assets7.lottiefiles.com/packages/lf20_uu0x8lqv.json', // Animasi lupa password
    resetPassword: 'https://assets10.lottiefiles.com/private_files/lf30_GjhcdM.json', // Animasi reset password
    eye: 'https://assets3.lottiefiles.com/packages/lf20_ydo1amjm.json', // Animasi mata
    medicalData: 'https://assets7.lottiefiles.com/packages/lf20_5njp3vgg.json', // Animasi data medis
    security: 'https://assets10.lottiefiles.com/packages/lf20_vvnvemp9.json' // Animasi keamanan
  }
};

// Export untuk penggunaan
export default {
  theme: newTheme,
  animations: enhancedAnimations,
  lottie: lottieConfig
}; 