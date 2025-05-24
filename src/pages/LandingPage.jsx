import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import WavesBackground from '../components/WavesBackground';
import AnimatedText from '../components/AnimatedText';
import AnimatedButton from '../components/AnimatedButton';

const LandingPage = () => {
  const [isMounted, setIsMounted] = useState(false);
  
  // Intersection observer hooks untuk animasi scroll
  const [heroRef, heroInView] = useInView({ threshold: 0.1, triggerOnce: true });
  const [featuresRef, featuresInView] = useInView({ threshold: 0.1, triggerOnce: true });
  const [processRef, processInView] = useInView({ threshold: 0.1, triggerOnce: true });
  const [ctaRef, ctaInView] = useInView({ threshold: 0.1, triggerOnce: true });
  
  useEffect(() => {
    setIsMounted(true);
    return () => setIsMounted(false);
  }, []);
  
  // Animasi
  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.8, ease: "easeOut" }
    }
  };
  
  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3
      }
    }
  };
  
  const features = [
    {
      title: "Deteksi Retina Akurat",
      description: "Analisis retina dengan akurasi tinggi menggunakan algoritma AI terbaru",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
        </svg>
      )
    },
    {
      title: "Diagnosa Cepat",
      description: "Dapatkan hasil diagnosa dalam hitungan detik dengan teknologi pemrosesan real-time",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      )
    },
    {
      title: "Keamanan Data",
      description: "Data pasien terenkripsi dan terlindungi dengan standar keamanan tertinggi",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
        </svg>
      )
    }
  ];
  
  const process = [
    {
      step: "1",
      title: "Unggah Gambar Retina",
      description: "Cukup unggah gambar retina melalui aplikasi kami"
    },
    {
      step: "2",
      title: "Analisis AI",
      description: "Sistem AI kami akan menganalisis gambar retina secara otomatis"
    },
    {
      step: "3",
      title: "Dapatkan Hasil",
      description: "Hasil analisis dan rekomendasi tersedia dalam hitungan detik"
    }
  ];

  return (
    <div className="relative min-h-screen overflow-hidden bg-gray-950">
      {/* Background Pattern */}
      {isMounted && <WavesBackground />}
      
      {/* Hero Section */}
      <section ref={heroRef} className="relative min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 z-10 pt-20">
        <div className="container mx-auto text-center">
          <motion.div
            initial="hidden"
            animate={heroInView ? "visible" : "hidden"}
            variants={staggerContainer}
            className="max-w-3xl mx-auto"
          >
            <motion.div variants={fadeIn} className="mb-6">
              <span className="inline-block py-1 px-3 rounded-full bg-blue-500/20 text-blue-400 text-sm font-medium mb-4">
                Teknologi AI Terdepan
              </span>
              
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-6 leading-tight">
                Deteksi Masalah Retina dengan{' '}
                <AnimatedText
                  text="Kecerdasan Buatan"
                  highlightWords={false}
                  gradientFrom="from-blue-400"
                  gradientTo="to-indigo-500"
                  className="font-bold"
                />
              </h1>
              
              <p className="text-xl text-gray-300 mb-8">
                Analisis kesehatan retina Anda dengan teknologi AI canggih untuk deteksi dini dan pencegahan masalah penglihatan.
              </p>
            </motion.div>
            
            <motion.div variants={fadeIn} className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/register">
                <AnimatedButton
                  primary={true}
                  gradientFrom="from-blue-600"
                  gradientTo="to-indigo-600"
                >
                  Mulai Sekarang
                </AnimatedButton>
              </Link>
              <Link to="/login">
                <AnimatedButton primary={false}>
                  Login
                </AnimatedButton>
              </Link>
            </motion.div>
          </motion.div>
          
          {/* Scroll down indicator */}
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: [0, 10, 0], transition: { duration: 2, repeat: Infinity, repeatType: "loop" } }}
            className="absolute bottom-10 left-1/2 transform -translate-x-1/2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white/70" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </motion.div>
        </div>
      </section>
      
      {/* Features Section */}
      <section ref={featuresRef} className="relative py-24 px-4 sm:px-6 lg:px-8 z-10 bg-gray-900/50">
        <div className="container mx-auto">
          <motion.div
            initial="hidden"
            animate={featuresInView ? "visible" : "hidden"}
            variants={staggerContainer}
            className="max-w-4xl mx-auto"
          >
            <motion.div variants={fadeIn} className="text-center mb-16">
              <AnimatedText
                text="Fitur Unggulan"
                highlightWords={false}
                gradientFrom="from-blue-400"
                gradientTo="to-indigo-500"
                className="text-3xl sm:text-4xl font-bold mb-4"
              />
              <p className="text-gray-300">
                Teknologi terdepan untuk analisis retina yang akurat dan cepat
              </p>
            </motion.div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  variants={fadeIn}
                  className="bg-gray-800/50 backdrop-blur-md rounded-2xl p-6 border border-gray-700/50 hover:border-blue-500/30 transition-all"
                >
                  <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl p-3 inline-block mb-4">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">{feature.title}</h3>
                  <p className="text-gray-400">{feature.description}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>
      
      {/* Process Section */}
      <section ref={processRef} className="relative py-24 px-4 sm:px-6 lg:px-8 z-10">
        <div className="container mx-auto">
          <motion.div
            initial="hidden"
            animate={processInView ? "visible" : "hidden"}
            variants={staggerContainer}
            className="max-w-4xl mx-auto"
          >
            <motion.div variants={fadeIn} className="text-center mb-16">
              <AnimatedText
                text="Proses Sederhana"
                highlightWords={false}
                gradientFrom="from-indigo-400"
                gradientTo="to-purple-500"
                className="text-3xl sm:text-4xl font-bold mb-4"
              />
              <p className="text-gray-300">
                Tiga langkah mudah untuk menganalisis kesehatan retina Anda
              </p>
            </motion.div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {process.map((item, index) => (
                <motion.div
                  key={index}
                  variants={fadeIn}
                  className="relative"
                >
                  <div className="bg-gray-800/30 backdrop-blur-md rounded-2xl p-8 border border-gray-700/50 hover:border-indigo-500/30 transition-all h-full">
                    <div className="absolute -top-5 -left-5 w-12 h-12 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 flex items-center justify-center text-white font-bold text-xl shadow-lg">
                      {item.step}
                    </div>
                    <h3 className="text-xl font-bold text-white mb-4 mt-4">{item.title}</h3>
                    <p className="text-gray-400">{item.description}</p>
                  </div>
                  
                  {index < process.length - 1 && (
                    <div className="hidden md:block absolute top-1/2 right-0 transform translate-x-1/2 -translate-y-1/2 z-10">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                      </svg>
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section ref={ctaRef} className="relative py-20 px-4 sm:px-6 lg:px-8 z-10 mb-10">
        <div className="container mx-auto">
          <motion.div
            initial="hidden"
            animate={ctaInView ? "visible" : "hidden"}
            variants={fadeIn}
            className="max-w-4xl mx-auto bg-gradient-to-r from-blue-900/40 to-indigo-900/40 rounded-3xl p-8 sm:p-12 border border-blue-500/20 backdrop-blur-sm"
          >
            <div className="text-center">
              <AnimatedText
                text="Siap untuk Memulai?"
                highlightWords={false}
                gradientFrom="from-blue-400"
                gradientTo="to-indigo-500"
                className="text-3xl sm:text-4xl font-bold mb-4"
              />
              <p className="text-xl text-gray-300 mb-8">
                Daftar sekarang dan jaga kesehatan mata Anda dengan teknologi AI terdepan
              </p>
              
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link to="/register">
                  <AnimatedButton
                    primary={true}
                    gradientFrom="from-blue-600"
                    gradientTo="to-indigo-600"
                  >
                    Daftar Sekarang
                  </AnimatedButton>
                </Link>
                <Link to="/login">
                  <AnimatedButton primary={false}>
                    Login
                  </AnimatedButton>
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
