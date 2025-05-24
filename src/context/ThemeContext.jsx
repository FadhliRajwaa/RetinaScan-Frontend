import React, { createContext, useContext, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { globalTheme, animations as sharedAnimations } from '../utils/theme';
import { useLocation } from 'react-router-dom';

// Theme Context
const ThemeContext = createContext();

// Theme Provider Component
export const ThemeProvider = ({ children }) => {
  // Cek preferensi theme dari localStorage atau preferensi sistem
  const getInitialTheme = () => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      return savedTheme;
    }
    
    // Cek preferensi sistem
    return window.matchMedia('(prefers-color-scheme: dark)').matches
      ? 'dark'
      : 'light';
  };

  const [theme, setTheme] = useState(getInitialTheme);
  const [pageTransitionEnabled, setPageTransitionEnabled] = useState(true);

  // Efek untuk menyimpan theme ke localStorage dan mengaplikasikan ke html element
  useEffect(() => {
    // Simpan ke localStorage
    localStorage.setItem('theme', theme);
    
    // Aplikasikan class ke html element
    const htmlElement = document.documentElement;
    
    if (theme === 'dark') {
      htmlElement.classList.add('dark');
    } else {
      htmlElement.classList.remove('dark');
    }
    
    // Update meta theme-color untuk mobile browser
    const metaThemeColor = document.querySelector('meta[name="theme-color"]');
    if (metaThemeColor) {
      metaThemeColor.setAttribute(
        'content',
        theme === 'dark' ? '#111827' : '#f9fafb'
      );
    }
  }, [theme]);

  // Toggle theme function
  const toggleTheme = () => {
    setTheme(prevTheme => (prevTheme === 'dark' ? 'light' : 'dark'));
  };

  // Reset theme to system preference
  const resetTheme = () => {
    const systemPreference = window.matchMedia('(prefers-color-scheme: dark)').matches
      ? 'dark'
      : 'light';
    setTheme(systemPreference);
  };

  // Toggle page transitions
  const togglePageTransitions = () => {
    setPageTransitionEnabled(prev => !prev);
  };

  return (
    <ThemeContext.Provider
      value={{
        theme,
        setTheme,
        toggleTheme,
        resetTheme,
        pageTransitionEnabled,
        togglePageTransitions
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

// Custom hook untuk menggunakan theme context
export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

// HOC untuk menambahkan transisi halaman
export const withPageTransition = (Component) => {
  return (props) => {
    const location = useLocation();
    const { pageTransitionEnabled } = useTheme();

    // Variasi untuk animasi transisi halaman
    const variants = {
      initial: { opacity: 0, y: 20 },
      animate: { opacity: 1, y: 0 },
      exit: { opacity: 0, y: -20 }
    };

    return (
      <div className="page-transition-container">
        {pageTransitionEnabled ? (
          <motion.div
            key={location.pathname}
            initial="initial"
            animate="animate"
            exit="exit"
            variants={variants}
            transition={{ duration: 0.3 }}
          >
            <Component {...props} />
          </motion.div>
        ) : (
          <Component {...props} />
        )}
      </div>
    );
  };
};

// Export animations dari tema bersama
export const animations = sharedAnimations; 

export default ThemeProvider; 