import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import PropTypes from 'prop-types';
import { useTheme } from '../context/ThemeContext';

/**
 * AnimatedInput Component
 *
 * Komponen input yang dianimasikan dengan focus states dan error handling
 * @returns {JSX.Element} - Komponen React
 */
const AnimatedInput = ({
  id,
  name,
  type = 'text',
  value,
  onChange,
  onBlur,
  onFocus,
  label,
  placeholder,
  icon,
  endIcon,
  error,
  required = false,
  disabled = false,
  className = '',
  ...restProps
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [hasValue, setHasValue] = useState(!!value);
  const inputRef = useRef(null);
  const { theme } = useTheme();

  useEffect(() => {
    setHasValue(!!value);
  }, [value]);

  const handleFocus = (e) => {
    setIsFocused(true);
    if (onFocus) onFocus(e);
  };

  const handleBlur = (e) => {
    setIsFocused(false);
    if (onBlur) onBlur(e);
  };

  // Konfigurasi animasi
  const labelVariants = {
    focused: {
      y: -20,
      x: 0,
      scale: 0.8,
      color: theme === 'dark' ? 'rgb(99, 102, 241)' : 'rgb(37, 99, 235)',
      transition: { duration: 0.2, ease: 'easeInOut' },
    },
    blurred: {
      y: 0,
      x: 0,
      scale: 1,
      color: hasValue 
        ? (theme === 'dark' ? 'rgb(107, 114, 128)' : 'rgb(75, 85, 99)') 
        : (theme === 'dark' ? 'rgb(156, 163, 175)' : 'rgb(107, 114, 128)'),
      transition: { duration: 0.2, ease: 'easeInOut' },
    },
    error: {
      color: 'rgb(239, 68, 68)',
      transition: { duration: 0.2, ease: 'easeInOut' },
    },
  };

  // Style tambahan berdasarkan tema
  const getInputBorderColor = () => {
    if (error) return 'border-red-500';
    if (isFocused) return theme === 'dark' ? 'border-indigo-500' : 'border-blue-500';
    return theme === 'dark' 
      ? 'border-gray-700/50 hover:border-gray-600/50' 
      : 'border-gray-300 hover:border-gray-400';
  };
  
  const getInputBgColor = () => {
    return theme === 'dark' 
      ? 'bg-gray-900/50 backdrop-blur-sm' 
      : 'bg-white backdrop-blur-sm';
  };
  
  const getInputTextColor = () => {
    return theme === 'dark' ? 'text-white' : 'text-gray-900';
  };

  const showLabel = isFocused || hasValue;

  return (
    <div className={`relative ${className}`}>
      <div
        className={`relative group transition-all duration-200 ${
          disabled ? 'opacity-60' : ''
        }`}
      >
        {/* Label */}
        <motion.label
          htmlFor={id}
          initial={hasValue ? 'focused' : 'blurred'}
          animate={
            error ? 'error' : showLabel ? 'focused' : 'blurred'
          }
          variants={labelVariants}
          className={`absolute left-3 px-1 pointer-events-none origin-left ${
            theme === 'dark' ? 'bg-transparent' : 'bg-white'
          } ${
            showLabel
              ? 'text-xs font-medium'
              : 'text-base text-gray-400'
          }`}
        >
          {label}
          {required && <span className="ml-1 text-red-500">*</span>}
        </motion.label>

        {/* Input Field */}
        <div className={`flex items-center overflow-hidden rounded-lg border ${getInputBorderColor()} 
          focus-within:border-indigo-500 focus-within:ring-1 focus-within:ring-indigo-500 
          ${getInputBgColor()} transition-all`}
        >
          {/* Icon (if provided) */}
          {icon && (
            <div className={`pl-3 text-gray-400 ${isFocused ? (theme === 'dark' ? 'text-indigo-500' : 'text-blue-500') : ''}`}>
              {icon}
            </div>
          )}

          <input
            ref={inputRef}
            id={id}
            name={name}
            type={type}
            value={value}
            onChange={onChange}
            onFocus={handleFocus}
            onBlur={handleBlur}
            placeholder={showLabel ? placeholder : ''}
            disabled={disabled}
            className={`w-full py-3 px-3 bg-transparent ${getInputTextColor()} placeholder-gray-500 focus:outline-none disabled:cursor-not-allowed`}
            {...restProps}
          />

          {/* End Icon (if provided) */}
          {endIcon && (
            <div className="pr-3 text-gray-400">{endIcon}</div>
          )}
        </div>
      </div>

      {/* Error Message */}
      {error && typeof error === 'string' && (
        <p className="mt-1 text-xs text-red-500">{error}</p>
      )}
    </div>
  );
};

AnimatedInput.propTypes = {
  id: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  type: PropTypes.string,
  value: PropTypes.any,
  onChange: PropTypes.func.isRequired,
  onBlur: PropTypes.func,
  onFocus: PropTypes.func,
  label: PropTypes.string.isRequired,
  placeholder: PropTypes.string,
  icon: PropTypes.node,
  endIcon: PropTypes.node,
  error: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
  required: PropTypes.bool,
  disabled: PropTypes.bool,
  className: PropTypes.string,
};

export default AnimatedInput; 