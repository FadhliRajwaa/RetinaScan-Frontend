import { motion } from 'framer-motion';
import PropTypes from 'prop-types';
import { enhancedAnimations } from '../utils/newTheme';

/**
 * Komponen tombol dengan animasi
 * 
 * @param {Object} props - Props komponen
 * @param {string} props.type - Tipe tombol (button, submit, reset)
 * @param {string} props.variant - Variant tombol (primary, secondary, accent, success, warning, danger, outline, ghost)
 * @param {string} props.size - Ukuran tombol (sm, md, lg)
 * @param {boolean} props.fullWidth - Apakah tombol full width
 * @param {boolean} props.disabled - Apakah tombol dinonaktifkan
 * @param {Function} props.onClick - Handler untuk event onClick
 * @param {React.ReactNode} props.children - Konten tombol
 * @param {string} props.className - Class tambahan
 * @returns {JSX.Element} Komponen AnimatedButton
 */
const AnimatedButton = ({
  type = 'button',
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  disabled = false,
  onClick,
  children,
  className = '',
  ...props
}) => {
  // Definisi style berdasarkan variant
  const getVariantStyles = () => {
    switch (variant) {
      case 'primary':
        return {
          background: 'linear-gradient(135deg, #4F46E5, #6366F1)',
          color: 'white',
          border: 'none',
          boxShadow: '0 4px 6px -1px rgba(79, 70, 229, 0.2), 0 2px 4px -1px rgba(79, 70, 229, 0.1)',
        };
      case 'secondary':
        return {
          background: 'linear-gradient(135deg, #06B6D4, #22D3EE)',
          color: 'white',
          border: 'none',
          boxShadow: '0 4px 6px -1px rgba(6, 182, 212, 0.2), 0 2px 4px -1px rgba(6, 182, 212, 0.1)',
        };
      case 'accent':
        return {
          background: 'linear-gradient(135deg, #8B5CF6, #A78BFA)',
          color: 'white',
          border: 'none',
          boxShadow: '0 4px 6px -1px rgba(139, 92, 246, 0.2), 0 2px 4px -1px rgba(139, 92, 246, 0.1)',
        };
      case 'success':
        return {
          background: 'linear-gradient(135deg, #10B981, #34D399)',
          color: 'white',
          border: 'none',
          boxShadow: '0 4px 6px -1px rgba(16, 185, 129, 0.2), 0 2px 4px -1px rgba(16, 185, 129, 0.1)',
        };
      case 'warning':
        return {
          background: 'linear-gradient(135deg, #F59E0B, #FBBF24)',
          color: 'white',
          border: 'none',
          boxShadow: '0 4px 6px -1px rgba(245, 158, 11, 0.2), 0 2px 4px -1px rgba(245, 158, 11, 0.1)',
        };
      case 'danger':
        return {
          background: 'linear-gradient(135deg, #EF4444, #F87171)',
          color: 'white',
          border: 'none',
          boxShadow: '0 4px 6px -1px rgba(239, 68, 68, 0.2), 0 2px 4px -1px rgba(239, 68, 68, 0.1)',
        };
      case 'outline':
        return {
          background: 'transparent',
          color: '#4F46E5',
          border: '2px solid #4F46E5',
          boxShadow: 'none',
        };
      case 'ghost':
        return {
          background: 'transparent',
          color: '#4F46E5',
          border: 'none',
          boxShadow: 'none',
        };
      default:
        return {
          background: 'linear-gradient(135deg, #4F46E5, #6366F1)',
          color: 'white',
          border: 'none',
          boxShadow: '0 4px 6px -1px rgba(79, 70, 229, 0.2), 0 2px 4px -1px rgba(79, 70, 229, 0.1)',
        };
    }
  };

  // Definisi style berdasarkan size
  const getSizeStyles = () => {
    switch (size) {
      case 'sm':
        return {
          padding: '0.5rem 1rem',
          fontSize: '0.875rem',
          borderRadius: '0.375rem',
        };
      case 'md':
        return {
          padding: '0.625rem 1.25rem',
          fontSize: '1rem',
          borderRadius: '0.5rem',
        };
      case 'lg':
        return {
          padding: '0.75rem 1.5rem',
          fontSize: '1.125rem',
          borderRadius: '0.625rem',
        };
      default:
        return {
          padding: '0.625rem 1.25rem',
          fontSize: '1rem',
          borderRadius: '0.5rem',
        };
    }
  };

  // Style untuk disabled state
  const getDisabledStyles = () => {
    if (disabled) {
      return {
        opacity: 0.6,
        cursor: 'not-allowed',
        boxShadow: 'none',
      };
    }
    return {};
  };

  // Gabungkan semua style
  const buttonStyles = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: '600',
    transition: 'all 0.2s ease',
    cursor: disabled ? 'not-allowed' : 'pointer',
    width: fullWidth ? '100%' : 'auto',
    ...getVariantStyles(),
    ...getSizeStyles(),
    ...getDisabledStyles(),
  };

  return (
    <motion.button
      type={type}
      className={className}
      style={buttonStyles}
      onClick={disabled ? undefined : onClick}
      disabled={disabled}
      whileHover={disabled ? {} : enhancedAnimations.button.hover}
      whileTap={disabled ? {} : enhancedAnimations.button.tap}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      {...props}
    >
      {children}
    </motion.button>
  );
};

AnimatedButton.propTypes = {
  type: PropTypes.oneOf(['button', 'submit', 'reset']),
  variant: PropTypes.oneOf(['primary', 'secondary', 'accent', 'success', 'warning', 'danger', 'outline', 'ghost']),
  size: PropTypes.oneOf(['sm', 'md', 'lg']),
  fullWidth: PropTypes.bool,
  disabled: PropTypes.bool,
  onClick: PropTypes.func,
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
};

export default AnimatedButton; 