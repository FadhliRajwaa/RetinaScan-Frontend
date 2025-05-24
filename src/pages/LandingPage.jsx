import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import VantaBackground from '../components/VantaBackground';
import ScrollReveal from '../components/ScrollReveal';
import { 
  ArrowRightIcon, 
  BoltIcon, 
  ShieldCheckIcon, 
  ClockIcon,
  DocumentChartBarIcon,
  UserGroupIcon,
  ArrowDownIcon
} from '@heroicons/react/24/outline';

const LandingPage = () => {
  const [isMounted, setIsMounted] = useState(false);
  
  // Intersection observer hooks untuk animasi scroll
  const [heroRef, heroInView] = useInView({ threshold: 0.1, triggerOnce: true });
  const [featuresRef, featuresInView] = useInView({ threshold: 0.1, triggerOnce: true });
  const [statsRef, statsInView] = useInView({ threshold: 0.1, triggerOnce: true });
  const [testimonialRef, testimonialInView] = useInView({ threshold: 0.1, triggerOnce: true });
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

  // Statistik untuk bagian statistik
  const stats = [
    { value: '95%', label: 'Akurasi Deteksi' },
    { value: '10x', label: 'Lebih Cepat' },
    { value: '24/7', label: 'Dukungan' },
  ];
  
  // Data untuk testimonial
  const testimonials = [
    {
      quote: "RetinaScan membantu klinik kami mendeteksi retinopati diabetik dengan akurasi tinggi. Teknologi yang revolusioner!",
      author: "dr. Surya Wijaya",
      title: "Spesialis Mata, RS Premier Jakarta"
    },
    {
      quote: "Dengan RetinaScan, kami bisa mendiagnosa pasien lebih cepat dan memulai pengobatan lebih awal. Sangat direkomendasikan!",
      author: "dr. Anita Purnama",
      title: "Dokter Spesialis Endokrin, RSUD Surabaya"
    },
    {
      quote: "Interface yang mudah digunakan dan hasil analisis yang komprehensif. RetinaScan telah menjadi bagian penting dalam praktik medis kami.",
      author: "dr. Budi Santoso",
      title: "Direktur Medis, Klinik Kesehatan Mata Semarang"
    }
  ];
  
  // Data fitur-fitur
  const features = [
    {
      title: "Deteksi Akurat",
      description: "Analisis retina dengan akurasi hingga 95% menggunakan algoritma AI mutakhir",
      icon: <BoltIcon className="h-10 w-10 text-[#03DAC6]" />,
      gradient: "from-[#03DAC6]/20 to-[#03DAC6]/5"
    },
    {
      title: "Diagnosa Cepat",
      description: "Dapatkan hasil analisis dalam hitungan detik dengan pemrosesan real-time",
      icon: <ClockIcon className="h-10 w-10 text-[#BB86FC]" />,
      gradient: "from-[#BB86FC]/20 to-[#BB86FC]/5"
    },
    {
      title: "Keamanan Data",
      description: "Data pasien terenkripsi dan terlindungi dengan standar keamanan tertinggi",
      icon: <ShieldCheckIcon className="h-10 w-10 text-[#FFD700]" />,
      gradient: "from-[#FFD700]/20 to-[#FFD700]/5"
    },
    {
      title: "Laporan Lengkap",
      description: "Laporan komprehensif yang mudah dibaca dengan rekomendasi tindak lanjut",
      icon: <DocumentChartBarIcon className="h-10 w-10 text-[#03DAC6]" />,
      gradient: "from-[#03DAC6]/20 to-[#03DAC6]/5"
    },
    {
      title: "Terintegrasi",
      description: "Integrasi mudah dengan sistem rekam medis elektronik yang sudah ada",
      icon: <UserGroupIcon className="h-10 w-10 text-[#BB86FC]" />,
      gradient: "from-[#BB86FC]/20 to-[#BB86FC]/5"
    },
  ];

  // Testimoni aktif
  const [activeTestimonial, setActiveTestimonial] = useState(0);

  // Fungsi untuk mengganti testimoni
  const nextTestimonial = () => {
    setActiveTestimonial((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setActiveTestimonial((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Background animasi Vanta.js dengan Net effect */}
      {isMounted && (
        <VantaBackground 
          points={17} 
          maxDistance={25} 
          spacing={20}
          mouseControls={true}
        />
      )}
      
      {/* Overlay gradient untuk meningkatkan kontras teks */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/40 z-0"></div>
      
      {/* Hero Section */}
      <section ref={heroRef} className="relative min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 z-10 pt-16">
        <div className="container mx-auto text-center">
          <motion.div
            initial="hidden"
            animate={heroInView ? "visible" : "hidden"}
            variants={staggerContainer}
            className="max-w-4xl mx-auto"
          >
            <motion.div variants={fadeIn} className="mb-6">
              <span className="inline-block py-1 px-3 rounded-full bg-[#03DAC6]/20 text-[#03DAC6] text-sm font-medium mb-4 border border-[#03DAC6]/20 backdrop-blur-sm">
                Teknologi AI Terdepan
              </span>
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-6 leading-tight">
                Deteksi Masalah Retina dengan <span className="bg-gradient-to-r from-[#03DAC6] to-[#BB86FC] bg-clip-text text-transparent">Kecerdasan Buatan</span>
              </h1>
              <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
                Analisis kesehatan retina Anda dengan teknologi AI canggih untuk deteksi dini dan pencegahan masalah penglihatan akibat diabetes.
              </p>
            </motion.div>
            
            <motion.div variants={fadeIn} className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/register">
                <motion.button
                  whileHover={{ scale: 1.05, boxShadow: "0 10px 25px -5px rgba(3, 218, 198, 0.4)" }}
                  whileTap={{ scale: 0.95 }}
                  className="px-8 py-3 rounded-xl text-white font-medium shadow-lg transition-all flex items-center"
                  style={{
                    background: 'linear-gradient(to right, #03DAC6, #BB86FC)'
                  }}
                >
                  <span>Mulai Sekarang</span>
                  <ArrowRightIcon className="h-5 w-5 ml-2" />
                </motion.button>
              </Link>
              <Link to="/login">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-8 py-3 rounded-xl backdrop-blur-sm border border-white/20 text-white font-medium hover:bg-white/10 transition-all"
                >
                  Login
                </motion.button>
              </Link>
            </motion.div>
          </motion.div>
          
          {/* Scroll down indicator */}
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: [0, 10, 0], transition: { duration: 2, repeat: Infinity, repeatType: "loop" } }}
            className="absolute bottom-10 left-1/2 transform -translate-x-1/2"
          >
            <ArrowDownIcon className="h-6 w-6 text-white/70" />
          </motion.div>
        </div>
      </section>
      
      {/* Stats Section */}
      <section ref={statsRef} className="relative py-20 px-4 sm:px-6 lg:px-8 z-10 overflow-hidden">
        <div 
          className="absolute inset-0 opacity-20 z-0" 
          style={{ 
            backgroundImage: 'radial-gradient(circle at 25px 25px, rgba(3, 218, 198, 0.2) 2%, transparent 0%), radial-gradient(circle at 75px 75px, rgba(187, 134, 252, 0.2) 2%, transparent 0%)',
            backgroundSize: '100px 100px'
          }}
        ></div>
        
        <div className="container mx-auto max-w-5xl relative">
          <motion.div 
            initial="hidden"
            animate={statsInView ? "visible" : "hidden"}
            variants={staggerContainer}
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            {stats.map((stat, index) => (
              <ScrollReveal key={index} delay={index * 0.1}>
                <motion.div
                  variants={fadeIn}
                  className="rounded-2xl p-8 backdrop-blur-md border border-white/10"
                  style={{
                    background: 'rgba(255, 255, 255, 0.05)'
                  }}
                >
                  <h3 className="text-4xl font-bold text-white mb-2 bg-gradient-to-r from-[#03DAC6] to-[#BB86FC] bg-clip-text text-transparent">
                    {stat.value}
                  </h3>
                  <p className="text-gray-400">{stat.label}</p>
                </motion.div>
              </ScrollReveal>
            ))}
          </motion.div>
        </div>
      </section>
      
      {/* Features Section */}
      <section ref={featuresRef} className="relative py-20 px-4 sm:px-6 lg:px-8 z-10">
        <div className="container mx-auto">
          <motion.div
            initial="hidden"
            animate={featuresInView ? "visible" : "hidden"}
            variants={staggerContainer}
            className="max-w-5xl mx-auto"
          >
            <ScrollReveal>
              <motion.div variants={fadeIn} className="text-center mb-16">
                <span className="inline-block py-1 px-3 rounded-full bg-[#BB86FC]/20 text-[#BB86FC] text-sm font-medium mb-4 border border-[#BB86FC]/20 backdrop-blur-sm">
                  Fitur Unggulan
                </span>
                <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
                  Teknologi Canggih untuk Deteksi Retinopati
                </h2>
                <p className="text-gray-300 max-w-3xl mx-auto">
                  RetinaScan menawarkan solusi terdepan untuk analisis retina yang akurat, cepat, dan mudah digunakan
                </p>
              </motion.div>
            </ScrollReveal>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {features.map((feature, index) => (
                <ScrollReveal key={index} delay={index * 0.1}>
                  <motion.div
                    variants={fadeIn}
                    className="backdrop-blur-md rounded-2xl p-6 border border-white/10 hover:border-[#03DAC6]/30 transition-all h-full"
                    style={{
                      background: 'rgba(255, 255, 255, 0.05)'
                    }}
                  >
                    <div className={`bg-gradient-to-br ${feature.gradient} rounded-xl p-3 inline-block mb-4`}>
                      {feature.icon}
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2">{feature.title}</h3>
                    <p className="text-gray-400">{feature.description}</p>
                  </motion.div>
                </ScrollReveal>
              ))}
            </div>
          </motion.div>
        </div>
      </section>
      
      {/* Testimonials Section */}
      <section ref={testimonialRef} className="relative py-20 px-4 sm:px-6 lg:px-8 z-10">
        <div className="container mx-auto">
          <motion.div
            initial="hidden"
            animate={testimonialInView ? "visible" : "hidden"}
            variants={fadeIn}
            className="max-w-4xl mx-auto"
          >
            <ScrollReveal>
              <div className="text-center mb-12">
                <span className="inline-block py-1 px-3 rounded-full bg-[#FFD700]/20 text-[#FFD700] text-sm font-medium mb-4 border border-[#FFD700]/20 backdrop-blur-sm">
                  Testimoni
                </span>
                <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
                  Apa Kata Mereka
                </h2>
                <p className="text-gray-300 max-w-3xl mx-auto">
                  Pengalaman para profesional medis menggunakan RetinaScan
                </p>
              </div>
            </ScrollReveal>
            
            <div className="relative overflow-hidden">
              <div 
                className="backdrop-blur-md rounded-2xl p-8 border border-white/10"
                style={{
                  background: 'rgba(255, 255, 255, 0.05)'
                }}
              >
                <motion.div 
                  key={activeTestimonial}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.5 }}
                  className="text-center"
                >
                  <p className="text-xl text-gray-200 mb-6 italic">
                    "{testimonials[activeTestimonial].quote}"
                  </p>
                  <div>
                    <p className="font-semibold text-white">{testimonials[activeTestimonial].author}</p>
                    <p className="text-sm text-gray-400">{testimonials[activeTestimonial].title}</p>
                  </div>
                </motion.div>
                
                <div className="flex justify-center mt-8 space-x-2">
                  {testimonials.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setActiveTestimonial(index)}
                      className={`w-3 h-3 rounded-full transition-all ${
                        index === activeTestimonial ? 'bg-[#03DAC6]' : 'bg-gray-600'
                      }`}
                      aria-label={`Go to testimonial ${index + 1}`}
                    />
                  ))}
                </div>
              </div>
              
              <button
                onClick={prevTestimonial}
                className="absolute left-0 top-1/2 transform -translate-y-1/2 p-2 rounded-full bg-black/30 backdrop-blur-sm border border-white/10 text-white"
                aria-label="Previous testimonial"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              
              <button
                onClick={nextTestimonial}
                className="absolute right-0 top-1/2 transform -translate-y-1/2 p-2 rounded-full bg-black/30 backdrop-blur-sm border border-white/10 text-white"
                aria-label="Next testimonial"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </motion.div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section ref={ctaRef} className="relative py-20 px-4 sm:px-6 lg:px-8 z-10">
        <div className="container mx-auto">
          <motion.div
            initial="hidden"
            animate={ctaInView ? "visible" : "hidden"}
            variants={fadeIn}
            className="max-w-4xl mx-auto backdrop-blur-md rounded-3xl p-8 sm:p-12 border border-[#03DAC6]/20"
            style={{
              background: 'linear-gradient(135deg, rgba(3, 218, 198, 0.1), rgba(187, 134, 252, 0.1))'
            }}
          >
            <ScrollReveal>
              <div className="text-center">
                <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
                  Siap untuk Memulai?
                </h2>
                <p className="text-xl text-gray-300 mb-8">
                  Daftar sekarang dan jaga kesehatan mata Anda dengan teknologi AI terdepan
                </p>
                
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                  <Link to="/register">
                    <motion.button
                      whileHover={{ scale: 1.05, boxShadow: "0 10px 25px -5px rgba(3, 218, 198, 0.4)" }}
                      whileTap={{ scale: 0.95 }}
                      className="px-8 py-3 rounded-xl text-white font-medium shadow-lg transition-all flex items-center"
                      style={{
                        background: 'linear-gradient(to right, #03DAC6, #BB86FC)'
                      }}
                    >
                      <span>Daftar Sekarang</span>
                      <ArrowRightIcon className="h-5 w-5 ml-2" />
                    </motion.button>
                  </Link>
                  <Link to="/login">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="px-8 py-3 rounded-xl backdrop-blur-sm border border-white/20 text-white font-medium hover:bg-white/10 transition-all"
                    >
                      Login
                    </motion.button>
                  </Link>
                </div>
              </div>
            </ScrollReveal>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
