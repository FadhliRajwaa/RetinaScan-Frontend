import { motion } from 'framer-motion';
import { useTheme } from '../../context/ThemeContext';

const TestimonialCard = ({
  quote,
  author,
  role,
  avatar,
  rating = 5,
  className = '',
  ...props
}) => {
  const { theme, animations, animationsEnabled, reducedMotion } = useTheme();
  const shouldAnimate = animationsEnabled && !reducedMotion;
  
  // Render stars berdasarkan rating
  const renderStars = () => {
    const stars = [];
    for (let i = 0; i < 5; i++) {
      stars.push(
        <svg
          key={i}
          className={`w-5 h-5 ${i < rating ? 'text-yellow-400' : 'text-gray-300'}`}
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path
            d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
          />
        </svg>
      );
    }
    return stars;
  };
  
  // Animasi untuk card
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0, 
      transition: { 
        type: 'spring',
        damping: 15,
        stiffness: 100,
        duration: 0.5
      } 
    },
    hover: shouldAnimate ? { 
      y: -10, 
      boxShadow: theme.largeShadow,
      transition: { duration: 0.3 }
    } : {}
  };
  
  // Animasi untuk quote mark
  const quoteMarkVariants = {
    hidden: { opacity: 0, scale: 0 },
    visible: { 
      opacity: 0.1, 
      scale: 1,
      transition: { 
        delay: 0.2,
        duration: 0.5
      }
    }
  };
  
  return (
    <motion.div
      className={`bg-white rounded-xl p-6 relative overflow-hidden ${className}`}
      style={{ boxShadow: theme.mediumShadow }}
      variants={cardVariants}
      initial="hidden"
      whileInView="visible"
      whileHover="hover"
      viewport={{ once: true, margin: "-50px" }}
      {...props}
    >
      {/* Quote mark */}
      <motion.div
        className="absolute top-4 right-4 text-8xl leading-none text-primary opacity-10 pointer-events-none"
        variants={quoteMarkVariants}
        style={{ color: theme.primary }}
      >
        "
      </motion.div>
      
      {/* Rating */}
      <div className="flex mb-4">
        {renderStars()}
      </div>
      
      {/* Quote */}
      <blockquote className="text-gray-700 mb-6">
        "{quote}"
      </blockquote>
      
      {/* Author */}
      <div className="flex items-center">
        {avatar && (
          <div className="mr-4">
            <img
              src={avatar}
              alt={author}
              className="w-12 h-12 rounded-full object-cover"
            />
          </div>
        )}
        <div>
          <div className="font-semibold text-gray-900">{author}</div>
          {role && <div className="text-sm text-gray-500">{role}</div>}
        </div>
      </div>
    </motion.div>
  );
};

// Komponen untuk menampilkan beberapa testimonial
export const TestimonialGrid = ({
  testimonials,
  columns = 3,
  className = '',
  ...props
}) => {
  const { animations } = useTheme();
  
  // Tentukan class grid berdasarkan jumlah kolom
  const getGridClass = () => {
    switch (columns) {
      case 1: return 'grid-cols-1';
      case 2: return 'grid-cols-1 md:grid-cols-2';
      case 3: return 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3';
      case 4: return 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4';
      default: return 'grid-cols-1 md:grid-cols-3';
    }
  };
  
  return (
    <motion.div
      className={`grid ${getGridClass()} gap-6 ${className}`}
      variants={animations.staggerContainer}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-50px" }}
      {...props}
    >
      {testimonials.map((testimonial, index) => (
        <motion.div
          key={index}
          variants={animations.staggerItem}
          custom={index}
        >
          <TestimonialCard {...testimonial} />
        </motion.div>
      ))}
    </motion.div>
  );
};

export default TestimonialCard; 