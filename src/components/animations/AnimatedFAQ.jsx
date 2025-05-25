import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../../context/ThemeContext';
import { ChevronDownIcon } from '@heroicons/react/24/outline';

const FAQItem = ({ question, answer, isOpen, onClick }) => {
  const { theme, animations, animationsEnabled, reducedMotion } = useTheme();
  const shouldAnimate = animationsEnabled && !reducedMotion;
  
  return (
    <div className="border-b border-gray-200 last:border-b-0">
      <button
        className="w-full py-5 flex justify-between items-center focus:outline-none"
        onClick={onClick}
      >
        <h3 className="text-lg font-medium text-gray-900">{question}</h3>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: shouldAnimate ? 0.3 : 0 }}
        >
          <ChevronDownIcon className="w-5 h-5 text-gray-500" />
        </motion.div>
      </button>
      
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={shouldAnimate ? { height: 0, opacity: 0 } : false}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: shouldAnimate ? 0.3 : 0 }}
            className="overflow-hidden"
          >
            <div className="pb-5 text-gray-600">
              {answer}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const AnimatedFAQ = ({ 
  items, 
  title = 'Pertanyaan Umum',
  subtitle = 'Jawaban untuk pertanyaan yang sering diajukan',
  className = '',
  ...props 
}) => {
  const [openIndex, setOpenIndex] = useState(null);
  const { theme, animations } = useTheme();
  
  const handleToggle = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };
  
  return (
    <div className={`max-w-3xl mx-auto ${className}`} {...props}>
      <motion.div
        className="text-center mb-10"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={animations.fadeInUp}
        custom={0}
      >
        <h2 className="text-3xl font-bold mb-4">{title}</h2>
        <p className="text-xl text-gray-600">{subtitle}</p>
      </motion.div>
      
      <motion.div
        className="bg-white rounded-xl shadow-lg overflow-hidden"
        variants={animations.container}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-50px" }}
      >
        {items.map((item, index) => (
          <motion.div
            key={index}
            variants={animations.item}
            custom={index}
          >
            <FAQItem
              question={item.question}
              answer={item.answer}
              isOpen={openIndex === index}
              onClick={() => handleToggle(index)}
            />
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
};

export default AnimatedFAQ; 