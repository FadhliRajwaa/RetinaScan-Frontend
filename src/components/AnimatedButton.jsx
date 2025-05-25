import { motion } from 'framer-motion';
import PropTypes from 'prop-types';
import { useState, useMemo } from 'react';
import { useTheme } from '../context/ThemeContext';

/**
 * Komponen tombol dengan animasi modern
 * 
 * @param {Object} props - Props komponen
 * @param {string} props.children - Konten tombol
 * @param {string} props.className - Kelas CSS tambahan
 * @param {function} props.onClick - Fungsi callback untuk klik
 * @param {boolean} props.primary - Apakah menggunakan style primary
 * @param {boolean} props.disabled - Apakah tombol dinonaktifkan
 * @param {boolean} props.isLoading - Apakah tombol sedang loading
 * @param {string} props.type - Tipe tombol HTML
 * @param {string} props.gradientFrom - Warna awal gradient (jika primary)
 * @param {string} props.gradientTo - Warna akhir gradient (jika primary)
 * @returns {JSX.Element} Komponen AnimatedButton
 */
function AnimatedButton({
  children,
  className = '',
  onClick,
  primary = true,
  disabled = false,
  isLoading = false,
  type = 'button',
  gradientFrom,
  gradientTo,
}) {
  const [isHovered, setIsHovered] = useState(false);
  const { theme } = useTheme();

  // Tentukan warna gradient berdasarkan tema jika tidak ditentukan melalui props
  const gradientColors = useMemo(() => {
    const defaultFrom = theme === 'dark' ? 'from-blue-600' : 'from-blue-700';
    const defaultTo = theme === 'dark' ? 'to-purple-600' : 'to-indigo-700';
    
    return {
      from: gradientFrom || defaultFrom,
      to: gradientTo || defaultTo
    };
  }, [theme, gradientFrom, gradientTo]);

  // Base style untuk semua tombol
  const baseStyle = 'relative overflow-hidden rounded-xl px-6 py-3 font-medium transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-opacity-50';

  // Style untuk tombol primary (dengan gradient)
  const primaryStyle = useMemo(() => {
    const gradientClass = `bg-gradient-to-r ${gradientColors.from} ${gradientColors.to}`;
    return `${gradientClass} text-white focus:ring-blue-500 hover:shadow-lg ${theme === 'dark' ? 'hover:shadow-blue-500/25' : 'hover:shadow-blue-700/25'}`;
  }, [gradientColors, theme]);

  // Style untuk tombol secondary (dengan border)
  const secondaryStyle = useMemo(() => {
    return theme === 'dark' 
      ? 'bg-white/10 backdrop-blur-sm border border-white/20 text-white hover:bg-white/20 focus:ring-white' 
      : 'bg-gray-100 border border-gray-300 text-gray-800 hover:bg-gray-200 focus:ring-gray-300';
  }, [theme]);

  // Style untuk tombol disabled
  const disabledStyle = 'opacity-60 cursor-not-allowed';

  // Gabungkan style berdasarkan props
  const buttonStyle = `${baseStyle} ${primary ? primaryStyle : secondaryStyle} ${disabled ? disabledStyle : ''} ${className}`;

  return (
    <motion.button
      type={type}
      className={buttonStyle}
      onClick={onClick}
      disabled={disabled || isLoading}
      whileHover={{ scale: disabled ? 1 : 1.05 }}
      whileTap={{ scale: disabled ? 1 : 0.95 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      {/* Loading spinner */}
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-inherit">
          <svg className="h-5 w-5 animate-spin text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        </div>
      )}

      {/* Efek shimmer */}
      {primary && !disabled && isHovered && (
        <motion.div
          className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent"
          animate={{ x: ['0%', '200%'] }}
          transition={{ repeat: Infinity, duration: 1.5, ease: 'linear' }}
        />
      )}

      {/* Konten tombol */}
      <span className={isLoading ? 'invisible' : 'relative z-10'}>{children}</span>
    </motion.button>
  );
}

AnimatedButton.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
  onClick: PropTypes.func,
  primary: PropTypes.bool,
  disabled: PropTypes.bool,
  isLoading: PropTypes.bool,
  type: PropTypes.string,
  gradientFrom: PropTypes.string,
  gradientTo: PropTypes.string,
};

export default AnimatedButton; 