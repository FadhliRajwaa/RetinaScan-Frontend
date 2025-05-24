import { useState } from 'react';
import { motion } from 'framer-motion';
import PropTypes from 'prop-types';
import { newTheme } from '../utils/newTheme';

/**
 * Komponen input dengan animasi
 * 
 * @param {Object} props - Props komponen
 * @param {string} props.type - Tipe input (text, password, email, dll)
 * @param {string} props.name - Nama input
 * @param {string} props.id - ID input
 * @param {string} props.label - Label input
 * @param {string} props.placeholder - Placeholder input
 * @param {string} props.value - Nilai input
 * @param {Function} props.onChange - Handler untuk event onChange
 * @param {Function} props.onBlur - Handler untuk event onBlur
 * @param {boolean} props.required - Apakah input wajib diisi
 * @param {boolean} props.disabled - Apakah input dinonaktifkan
 * @param {string} props.error - Pesan error
 * @param {React.ReactNode} props.icon - Icon untuk input
 * @param {string} props.className - Class tambahan
 * @returns {JSX.Element} Komponen AnimatedInput
 */
const AnimatedInput = ({
  type = 'text',
  name,
  id,
  label,
  placeholder = '',
  value,
  onChange,
  onBlur,
  required = false,
  disabled = false,
  error,
  icon,
  className = '',
  ...props
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const handleFocus = () => {
    setIsFocused(true);
  };

  const handleBlur = (e) => {
    setIsFocused(false);
    if (onBlur) onBlur(e);
  };

  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  // Container style
  const containerStyle = {
    position: 'relative',
    marginBottom: '1.5rem',
    width: '100%',
  };

  // Label animation variants
  const labelVariants = {
    focused: {
      top: '-0.75rem',
      left: '0.75rem',
      scale: 0.85,
      color: error ? newTheme.danger : isFocused ? newTheme.primary : newTheme.text.secondary,
      backgroundColor: 'white',
      padding: '0 0.5rem',
    },
    blurred: {
      top: value ? '-0.75rem' : '0.75rem',
      left: '0.75rem',
      scale: value ? 0.85 : 1,
      color: error ? newTheme.danger : value ? newTheme.text.secondary : newTheme.text.muted,
      backgroundColor: value ? 'white' : 'transparent',
      padding: value ? '0 0.5rem' : '0',
    },
  };

  // Input style
  const inputStyle = {
    width: '100%',
    padding: '0.75rem 1rem',
    paddingRight: (type === 'password' || icon) ? '2.5rem' : '1rem',
    fontSize: '1rem',
    lineHeight: '1.5',
    color: disabled ? newTheme.text.muted : newTheme.text.primary,
    backgroundColor: disabled ? '#F9FAFB' : 'white',
    borderRadius: '0.5rem',
    border: `2px solid ${error ? newTheme.danger : isFocused ? newTheme.primary : '#E5E7EB'}`,
    outline: 'none',
    transition: 'all 0.2s ease',
  };

  // Icon container style
  const iconContainerStyle = {
    position: 'absolute',
    top: '50%',
    right: '1rem',
    transform: 'translateY(-50%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: type === 'password' ? 'pointer' : 'default',
    color: isFocused ? newTheme.primary : newTheme.text.muted,
  };

  // Error message style
  const errorStyle = {
    fontSize: '0.875rem',
    color: newTheme.danger,
    marginTop: '0.25rem',
    marginLeft: '0.75rem',
  };

  return (
    <div style={containerStyle} className={className}>
      {label && (
        <motion.label
          htmlFor={id || name}
          initial="blurred"
          animate={isFocused || value ? 'focused' : 'blurred'}
          variants={labelVariants}
          transition={{ duration: 0.2 }}
          style={{
            position: 'absolute',
            zIndex: 1,
            pointerEvents: 'none',
            transformOrigin: 'left',
            borderRadius: '0.25rem',
          }}
        >
          {label}
          {required && <span style={{ color: newTheme.danger, marginLeft: '0.25rem' }}>*</span>}
        </motion.label>
      )}

      <motion.input
        type={type === 'password' ? (isPasswordVisible ? 'text' : 'password') : type}
        id={id || name}
        name={name}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        onFocus={handleFocus}
        onBlur={handleBlur}
        required={required}
        disabled={disabled}
        style={inputStyle}
        initial={{ opacity: 0, y: 5 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        {...props}
      />

      {(type === 'password' || icon) && (
        <div 
          style={iconContainerStyle} 
          onClick={type === 'password' ? togglePasswordVisibility : undefined}
          role={type === 'password' ? 'button' : undefined}
          tabIndex={type === 'password' ? 0 : undefined}
          aria-label={type === 'password' ? 'Toggle password visibility' : undefined}
        >
          {type === 'password' ? (
            isPasswordVisible ? (
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                <circle cx="12" cy="12" r="3"></circle>
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                <line x1="1" y1="1" x2="23" y2="23"></line>
              </svg>
            )
          ) : (
            icon
          )}
        </div>
      )}

      {error && (
        <motion.div
          style={errorStyle}
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
        >
          {error}
        </motion.div>
      )}
    </div>
  );
};

AnimatedInput.propTypes = {
  type: PropTypes.string,
  name: PropTypes.string.isRequired,
  id: PropTypes.string,
  label: PropTypes.string,
  placeholder: PropTypes.string,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  onChange: PropTypes.func.isRequired,
  onBlur: PropTypes.func,
  required: PropTypes.bool,
  disabled: PropTypes.bool,
  error: PropTypes.string,
  icon: PropTypes.node,
  className: PropTypes.string,
};

export default AnimatedInput; 