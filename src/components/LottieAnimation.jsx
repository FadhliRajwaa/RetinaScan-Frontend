import { useEffect, useRef } from 'react';
import lottie from 'lottie-web';
import PropTypes from 'prop-types';

/**
 * Komponen untuk menampilkan animasi Lottie
 * 
 * @param {Object} props - Props komponen
 * @param {string|Object} props.animationData - URL JSON atau objek data animasi
 * @param {boolean} props.loop - Apakah animasi diputar berulang
 * @param {boolean} props.autoplay - Apakah animasi diputar otomatis
 * @param {Object} props.style - Style untuk container animasi
 * @param {string} props.className - Class untuk container animasi
 * @param {Function} props.onComplete - Callback saat animasi selesai
 * @returns {JSX.Element} Komponen LottieAnimation
 */
const LottieAnimation = ({
  animationData,
  loop = true,
  autoplay = true,
  style = {},
  className = '',
  onComplete,
  ...props
}) => {
  const animationContainer = useRef(null);
  const animationInstance = useRef(null);

  useEffect(() => {
    if (!animationContainer.current) return;

    // Cleanup previous animation if exists
    if (animationInstance.current) {
      animationInstance.current.destroy();
    }

    // Determine if animationData is a URL or direct data object
    const animationOptions = {
      container: animationContainer.current,
      renderer: 'svg',
      loop,
      autoplay,
      ...props,
    };

    if (typeof animationData === 'string') {
      // If it's a URL, load from path
      animationOptions.path = animationData;
    } else {
      // If it's an object, use it directly
      animationOptions.animationData = animationData;
    }

    // Initialize lottie animation
    animationInstance.current = lottie.loadAnimation(animationOptions);

    // Add event listeners
    if (onComplete) {
      animationInstance.current.addEventListener('complete', onComplete);
    }

    // Cleanup function
    return () => {
      if (animationInstance.current) {
        if (onComplete) {
          animationInstance.current.removeEventListener('complete', onComplete);
        }
        animationInstance.current.destroy();
      }
    };
  }, [animationData, loop, autoplay, onComplete, props]);

  return (
    <div 
      ref={animationContainer} 
      style={{
        width: '100%',
        height: '100%',
        overflow: 'hidden',
        ...style
      }}
      className={className}
      aria-hidden="true"
    />
  );
};

LottieAnimation.propTypes = {
  animationData: PropTypes.oneOfType([PropTypes.string, PropTypes.object]).isRequired,
  loop: PropTypes.bool,
  autoplay: PropTypes.bool,
  style: PropTypes.object,
  className: PropTypes.string,
  onComplete: PropTypes.func,
};

export default LottieAnimation; 