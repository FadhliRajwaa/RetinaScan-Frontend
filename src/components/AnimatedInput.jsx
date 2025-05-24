import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import PropTypes from 'prop-types';
import { useTheme } from '../context/ThemeContext';

/**
 * Komponen input form dengan animasi
 * 
 * @param {Object} props - Props komponen
 * @param {string} props.id - ID untuk input
 * @param {string} props.name - Nama input
 * @param {string} props.type - Tipe input (text, email, password, dll)
 * @param {string} props.value - Nilai input
 * @param {function} props.onChange - Handler untuk perubahan nilai
 * @param {string} props.label - Label untuk input
 * @param {string} props.placeholder - Placeholder untuk input
 * @param {string} props.error - Pesan error (jika ada)
 * @param {boolean} props.required - Apakah input wajib diisi
 * @param {function} props.onBlur - Handler untuk event blur
 * @param {function} props.onFocus - Handler untuk event focus
 * @param {boolean} props.disabled - Apakah input dinonaktifkan
 * @param {string} props.className - Kelas CSS tambahan
 * @param {React.ReactNode} props.icon - Ikon untuk input
 * @param {React.ReactNode} props.endIcon - Ikon di akhir input
 * @returns {JSX.Element} Komponen AnimatedInput
 */
function AnimatedInput({
  id,
  name,
  type = 'text',
  value,
  onChange,
  label,
  placeholder,
  error,
  required = false,
  onBlur,
  onFocus,
  disabled = false,
  className = '',
  icon,
  endIcon,
}) {
  const [isFocused, setIsFocused] = useState(false);
  const { theme } = useTheme();

  // Definisi style berdasarkan state dan tema
  const containerClass = `group relative mb-4 ${className}`;
  
  const inputBaseClass = useMemo(() => {
    return `
      w-full rounded-xl px-4 py-3 transition-all duration-200 ease-in-out
      ${theme === 'dark' 
        ? 'bg-white/10 backdrop-blur-md text-white placeholder-gray-400' 
        : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'}
      border focus:outline-none focus:ring-2
    `;
  }, [theme]);
  
  const inputStateClass = useMemo(() => {
    if (error) {
      return theme === 'dark'
        ? 'border-red-500 focus:border-red-500 focus:ring-red-500/50'
        : 'border-red-500 focus:border-red-500 focus:ring-red-500/50';
    } else if (isFocused) {
      return theme === 'dark'
        ? 'border-blue-500 focus:border-blue-500 focus:ring-blue-500/50'
        : 'border-blue-600 focus:border-blue-600 focus:ring-blue-600/50';
    } else {
      return theme === 'dark'
        ? 'border-gray-700 focus:border-blue-400'
        : 'border-gray-300 focus:border-blue-500';
    }
  }, [error, isFocused, theme]);
    
  const inputClass = `${inputBaseClass} ${inputStateClass} ${icon ? 'pl-10' : ''}`;
  
  const labelBaseClass = useMemo(() => {
    return `
      absolute left-2 px-1 transition-all duration-200 ease-in-out
      ${theme === 'dark'
        ? 'bg-gradient-to-b from-transparent via-gray-900 to-gray-900'
        : 'bg-gradient-to-b from-transparent via-gray-50 to-white'}
    `;
  }, [theme]);
  
  const labelStateClass = isFocused || value
    ? '-top-2 text-xs font-medium'
    : 'top-3 text-base';
    
  const labelColorClass = useMemo(() => {
    if (error) {
      return 'text-red-500';
    } else if (isFocused) {
      return theme === 'dark' ? 'text-blue-400' : 'text-blue-600';
    } else {
      return theme === 'dark' ? 'text-gray-400' : 'text-gray-600';
    }
  }, [error, isFocused, theme]);
    
  const labelClass = `${labelBaseClass} ${labelStateClass} ${labelColorClass}`;

  // Handlers
  const handleFocus = (e) => {
    setIsFocused(true);
    if (onFocus) onFocus(e);
  };

  const handleBlur = (e) => {
    setIsFocused(false);
    if (onBlur) onBlur(e);
  };

  return (
    <div className={containerClass}>
      {/* Label */}
      {label && (
        <motion.label
          htmlFor={id}
          className={labelClass}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.2 }}
        >
          {label}
          {required && <span className="ml-1 text-red-500">*</span>}
        </motion.label>
      )}

      {/* Icon (start) */}
      {icon && (
        <div className="absolute left-3 top-3 text-gray-400">
          {icon}
        </div>
      )}

      {/* Input */}
      <input
        id={id}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        onFocus={handleFocus}
        onBlur={handleBlur}
        placeholder={placeholder}
        disabled={disabled}
        required={required}
        className={inputClass}
        aria-invalid={error ? 'true' : 'false'}
      />

      {/* Icon (end) */}
      {endIcon && (
        <div className="absolute right-3 top-3 text-gray-400">
          {endIcon}
        </div>
      )}

      {/* Error message */}
      {error && (
        <motion.p
          className="mt-1 text-sm text-red-500"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
        >
          {error}
        </motion.p>
      )}
    </div>
  );
}

AnimatedInput.propTypes = {
  id: PropTypes.string,
  name: PropTypes.string,
  type: PropTypes.string,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  onChange: PropTypes.func.isRequired,
  label: PropTypes.string,
  placeholder: PropTypes.string,
  error: PropTypes.string,
  required: PropTypes.bool,
  onBlur: PropTypes.func,
  onFocus: PropTypes.func,
  disabled: PropTypes.bool,
  className: PropTypes.string,
  icon: PropTypes.node,
  endIcon: PropTypes.node,
};

export default AnimatedInput; 