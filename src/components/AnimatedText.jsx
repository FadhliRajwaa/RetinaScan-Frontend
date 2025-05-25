import { motion } from 'framer-motion';
import PropTypes from 'prop-types';

/**
 * Komponen AnimatedText untuk animasi teks dengan efek gradient yang menarik
 * 
 * @param {Object} props - Props komponen
 * @param {string} props.text - Teks yang akan dianimasi
 * @param {string} props.className - Kelas CSS tambahan
 * @param {boolean} props.highlightWords - Apakah akan menyoroti kata-kata secara terpisah
 * @param {string} props.gradientFrom - Warna awal gradient
 * @param {string} props.gradientTo - Warna akhir gradient
 * @param {string} props.gradientVia - Warna tengah gradient (opsional)
 * @param {number} props.delay - Delay animasi dalam detik
 * @returns {JSX.Element} Komponen AnimatedText
 */
function AnimatedText({
  text,
  className = '',
  highlightWords = false,
  gradientFrom = 'from-blue-500',
  gradientTo = 'to-purple-600',
  gradientVia = '',
  delay = 0,
}) {
  // Split teks menjadi kata-kata untuk animasi
  const words = text.split(' ');

  // Variasi animasi
  const container = {
    hidden: { opacity: 0 },
    visible: (i = 1) => ({
      opacity: 1,
      transition: { staggerChildren: 0.12, delayChildren: delay * i },
    }),
  };

  const child = {
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: 'spring',
        damping: 12,
        stiffness: 100,
      },
    },
    hidden: {
      opacity: 0,
      y: 20,
      transition: {
        type: 'spring',
        damping: 12,
        stiffness: 100,
      },
    },
  };

  // Tambahkan kelas gradient
  const gradientClass = `bg-gradient-to-r ${gradientFrom} ${gradientVia} ${gradientTo} bg-clip-text text-transparent`;

  if (highlightWords) {
    // Animasi per kata
    return (
      <motion.div
        className={`inline-block ${className}`}
        variants={container}
        initial="hidden"
        animate="visible"
      >
        {words.map((word, index) => (
          <motion.span
            key={index}
            className={`inline-block ${gradientClass}`}
            variants={child}
          >
            {word}{' '}
          </motion.span>
        ))}
      </motion.div>
    );
  }

  // Animasi teks keseluruhan
  return (
    <motion.div
      className={`inline-block ${className}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        delay,
        duration: 0.5,
        ease: 'easeOut',
      }}
    >
      <span className={gradientClass}>{text}</span>
    </motion.div>
  );
}

AnimatedText.propTypes = {
  text: PropTypes.string.isRequired,
  className: PropTypes.string,
  highlightWords: PropTypes.bool,
  gradientFrom: PropTypes.string,
  gradientTo: PropTypes.string,
  gradientVia: PropTypes.string,
  delay: PropTypes.number,
};

export default AnimatedText; 