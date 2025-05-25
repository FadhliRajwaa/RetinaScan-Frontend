import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';
import { 
  ArrowRightIcon, 
  ShieldCheckIcon, 
  CogIcon, 
  ChartBarIcon, 
  UserGroupIcon,
  BoltIcon,
  ArrowDownIcon
} from '@heroicons/react/24/outline';

function LandingPage() {
  const { theme, animations } = useTheme();
  
  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: (custom) => ({
      opacity: 1,
      y: 0,
      transition: { 
        type: 'spring',
        damping: 15,
        stiffness: 100,
        delay: custom * 0.2,
        duration: 0.8
      }
    })
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

  return (
    <div className="pt-16">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        {/* Background gradient with animated pattern */}
        <div className="absolute inset-0 opacity-90 z-0" style={{
          background: `linear-gradient(to right, ${theme.primary}, ${theme.accent})`,
        }}>
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAwIiBoZWlnaHQ9IjYwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cGF0aCBzdHJva2U9IiNmZmYiIHN0cm9rZS13aWR0aD0iMiIgZD0iTTAgMGw2MDAgNjAwTTYwMCAwTDAgNjAwIiBmaWxsPSJub25lIiBvcGFjaXR5PSIuMSIvPjwvc3ZnPg==')] animate-[spin_90s_linear_infinite] opacity-10" />
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28 relative z-10">
          <div className="text-center">
            <motion.h1 
              className="text-4xl md:text-6xl font-bold mb-6 text-white text-shadow"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              Deteksi Dini 
              <span className="block md:inline md:ml-2" style={{
                background: 'linear-gradient(90deg, white, rgba(255,255,255,0.8))',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}>Retinopati Diabetik</span>
            </motion.h1>
            
            <motion.p 
              className="text-lg md:text-xl mb-10 text-blue-100 max-w-3xl mx-auto"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              Gunakan RetinaScan untuk menganalisis citra fundus retina dengan teknologi 
              AI canggih dan deteksi dini untuk pencegahan kebutaan.
            </motion.p>
            
            <motion.div
              className="flex flex-col sm:flex-row justify-center gap-4 mb-12"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.8 }}
            >
              <Link to="/register">
                <motion.button
                  className="px-8 py-4 rounded-full text-white font-bold shadow-lg hover:shadow-xl transition duration-300 flex items-center justify-center w-full sm:w-auto ripple"
                  style={{
                    background: `linear-gradient(to right, ${theme.accent}, ${theme.primary})`,
                    boxShadow: '0 10px 25px -5px rgba(59, 130, 246, 0.5)'
                  }}
                  whileHover={{ scale: 1.05, boxShadow: "0 15px 30px -5px rgba(59, 130, 246, 0.7)" }}
                  whileTap={{ scale: 0.95 }}
          >
            Mulai Sekarang
                  <ArrowRightIcon className="w-5 h-5 ml-2" />
                </motion.button>
              </Link>
              <Link to="/login">
                <motion.button
                  className="px-8 py-4 rounded-full text-white font-bold transition duration-300 flex items-center justify-center w-full sm:w-auto"
                  style={{ ...theme.glassEffect }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Login
                </motion.button>
          </Link>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.2, duration: 0.5 }}
              className="flex justify-center"
            >
              <motion.div 
                className="animate-bounce cursor-pointer"
                whileHover={{ scale: 1.2 }}
              >
                <ArrowDownIcon className="h-8 w-8 text-white opacity-80" />
              </motion.div>
            </motion.div>
          </div>
        </div>
        
        {/* Wave separator */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320" className="w-full">
            <path fill="#ffffff" fillOpacity="1" d="M0,256L48,234.7C96,213,192,171,288,154.7C384,139,480,149,576,165.3C672,181,768,203,864,197.3C960,192,1056,160,1152,154.7C1248,149,1344,171,1392,181.3L1440,192L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
          </svg>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center mb-16"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={fadeInUp}
            custom={0}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Fitur Utama</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              RetinaScan menyediakan solusi komprehensif untuk deteksi retinopati diabetik
              dengan fitur-fitur canggih.
            </p>
          </motion.div>

          <motion.div 
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
          >
            <motion.div 
              className="bg-white p-8 rounded-2xl hover-scale"
              style={{ boxShadow: theme.mediumShadow }}
              variants={fadeInUp}
              whileHover={{ y: -10, boxShadow: theme.largeShadow }}
            >
              <div className="w-14 h-14 rounded-xl flex items-center justify-center mb-6"
                   style={{ background: `${theme.primary}20`, color: theme.primary }}>
                <BoltIcon className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-semibold mb-4 text-gray-900">Unggah Citra</h3>
              <p className="text-gray-600">Unggah citra fundus retina dengan mudah dan aman melalui sistem canggih kami.</p>
            </motion.div>

            <motion.div 
              className="bg-white p-8 rounded-2xl hover-scale"
              style={{ boxShadow: theme.mediumShadow }}
              variants={fadeInUp}
              whileHover={{ y: -10, boxShadow: theme.largeShadow }}
            >
              <div className="w-14 h-14 rounded-xl flex items-center justify-center mb-6"
                   style={{ background: `${theme.accent}20`, color: theme.accent }}>
                <CogIcon className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-semibold mb-4 text-gray-900">Analisis AI</h3>
              <p className="text-gray-600">Dapatkan prediksi tingkat keparahan retinopati diabetik secara instan dan akurat.</p>
            </motion.div>

            <motion.div 
              className="bg-white p-8 rounded-2xl hover-scale"
              style={{ boxShadow: theme.mediumShadow }}
              variants={fadeInUp}
              whileHover={{ y: -10, boxShadow: theme.largeShadow }}
            >
              <div className="w-14 h-14 rounded-xl flex items-center justify-center mb-6"
                   style={{ background: `${theme.secondary}20`, color: theme.secondary }}>
                <ChartBarIcon className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-semibold mb-4 text-gray-900">Laporan Hasil</h3>
              <p className="text-gray-600">Lihat laporan deteksi dalam antarmuka yang jelas dan mudah dipahami.</p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-gradient-to-r from-gray-50 to-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center mb-16"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
            custom={0}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Keunggulan RetinaScan</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Platform kami telah membantu ribuan pasien untuk mendeteksi retinopati diabetik lebih awal
            </p>
          </motion.div>

          <motion.div 
            className="grid grid-cols-1 md:grid-cols-4 gap-8"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <motion.div 
              className="text-center p-6 bg-white rounded-2xl shadow-sm"
              variants={fadeInUp}
              whileHover={{ y: -5 }}
            >
              <div className="text-4xl font-bold mb-2" style={{ color: theme.primary }}>98%</div>
              <p className="text-gray-600">Akurasi Deteksi</p>
            </motion.div>
            
            <motion.div 
              className="text-center p-6 bg-white rounded-2xl shadow-sm"
              variants={fadeInUp}
              whileHover={{ y: -5 }}
            >
              <div className="text-4xl font-bold mb-2" style={{ color: theme.primary }}>3 detik</div>
              <p className="text-gray-600">Waktu Analisis</p>
            </motion.div>
            
            <motion.div 
              className="text-center p-6 bg-white rounded-2xl shadow-sm"
              variants={fadeInUp}
              whileHover={{ y: -5 }}
            >
              <div className="text-4xl font-bold mb-2" style={{ color: theme.primary }}>10K+</div>
              <p className="text-gray-600">Pengguna Aktif</p>
            </motion.div>
            
            <motion.div 
              className="text-center p-6 bg-white rounded-2xl shadow-sm"
              variants={fadeInUp}
              whileHover={{ y: -5 }}
            >
              <div className="text-4xl font-bold mb-2" style={{ color: theme.primary }}>5</div>
              <p className="text-gray-600">Tingkat Klasifikasi</p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="rounded-3xl overflow-hidden shadow-2xl"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            style={{ 
              background: `linear-gradient(to right, ${theme.primary}, ${theme.accent})`,
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
            }}
          >
            <div className="relative px-6 py-16 md:p-16 text-center">
              <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAwIiBoZWlnaHQ9IjYwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cGF0aCBzdHJva2U9IiNmZmYiIHN0cm9rZS13aWR0aD0iMiIgZD0iTTAgMGw2MDAgNjAwTTYwMCAwTDAgNjAwIiBmaWxsPSJub25lIiBvcGFjaXR5PSIuMSIvPjwvc3ZnPg==')] opacity-10" />
              
              <motion.h2 
                className="text-3xl md:text-4xl font-bold text-white mb-4"
                initial={{ opacity: 0, y: -10 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.5 }}
                viewport={{ once: true }}
              >
                Mulai Deteksi Retinopati Diabetik Sekarang
              </motion.h2>
              
              <motion.p 
                className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ delay: 0.4, duration: 0.5 }}
                viewport={{ once: true }}
              >
                Daftar sekarang dan dapatkan akses ke platform deteksi retinopati diabetik berbasis AI
              </motion.p>
              
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.5 }}
                viewport={{ once: true }}
              >
                <Link to="/register">
                  <motion.button
                    className="px-8 py-4 bg-white text-blue-600 rounded-full font-bold shadow-lg hover:shadow-xl transition duration-300 text-lg"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Daftar Gratis
                  </motion.button>
                </Link>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Testimonial Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center mb-16"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
            custom={0}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Apa Kata Pengguna Kami</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              RetinaScan telah membantu banyak dokter dan pasien dalam mendeteksi retinopati diabetik
            </p>
          </motion.div>

          <motion.div 
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
          >
            <motion.div 
              className="bg-white p-8 rounded-2xl"
              style={{ boxShadow: theme.mediumShadow }}
              variants={fadeInUp}
              whileHover={{ 
                scale: 1.03, 
                boxShadow: theme.largeShadow
              }}
            >
              <div className="flex items-center mb-6">
                <div className="h-12 w-12 rounded-full flex items-center justify-center text-xl font-bold"
                     style={{ background: `${theme.primary}20`, color: theme.primary }}>
                  DR
                </div>
                <div className="ml-4">
                  <h4 className="font-semibold">Dr. Rini Pratiwi</h4>
                  <p className="text-gray-500 text-sm">Dokter Spesialis Mata</p>
                </div>
              </div>
              <p className="text-gray-600">
                "RetinaScan membantu saya mengidentifikasi kasus retinopati diabetik dengan cepat dan akurat. 
                Sangat membantu untuk screening pasien diabetes."
              </p>
            </motion.div>

            <motion.div 
              className="bg-white p-8 rounded-2xl"
              style={{ boxShadow: theme.mediumShadow }}
              variants={fadeInUp}
              whileHover={{ 
                scale: 1.03, 
                boxShadow: theme.largeShadow
              }}
            >
              <div className="flex items-center mb-6">
                <div className="h-12 w-12 rounded-full flex items-center justify-center text-xl font-bold"
                     style={{ background: `${theme.accent}20`, color: theme.accent }}>
                  BS
                </div>
                <div className="ml-4">
                  <h4 className="font-semibold">Budi Santoso</h4>
                  <p className="text-gray-500 text-sm">Pasien Diabetes</p>
                </div>
              </div>
              <p className="text-gray-600">
                "Berkat pemeriksaan rutin dengan RetinaScan, saya bisa mendeteksi masalah retina 
                sejak dini dan mendapatkan perawatan tepat waktu."
              </p>
            </motion.div>

            <motion.div 
              className="bg-white p-8 rounded-2xl"
              style={{ boxShadow: theme.mediumShadow }}
              variants={fadeInUp}
              whileHover={{ 
                scale: 1.03, 
                boxShadow: theme.largeShadow
              }}
            >
              <div className="flex items-center mb-6">
                <div className="h-12 w-12 rounded-full flex items-center justify-center text-xl font-bold"
                     style={{ background: `${theme.secondary}20`, color: theme.secondary }}>
                  SK
            </div>
                <div className="ml-4">
                  <h4 className="font-semibold">Siti Kurniawati</h4>
                  <p className="text-gray-500 text-sm">Perawat RS Medika</p>
            </div>
          </div>
              <p className="text-gray-600">
                "Sangat mudah digunakan dan memberikan hasil yang akurat. Kami menggunakan 
                RetinaScan untuk screening pasien diabetes di rumah sakit kami."
              </p>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}

export default LandingPage;