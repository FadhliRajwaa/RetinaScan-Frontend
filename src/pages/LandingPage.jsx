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
  ArrowDownIcon,
  DocumentTextIcon,
  ClockIcon,
  CheckCircleIcon,
  AcademicCapIcon,
  LightBulbIcon
} from '@heroicons/react/24/outline';

// Import komponen animasi
import TextReveal from '../components/animations/TextReveal';
import GlassCard from '../components/animations/GlassCard';
import AnimatedGradientButton from '../components/animations/AnimatedGradientButton';
import AnimatedCounter from '../components/animations/AnimatedCounter';
import ParallaxSection from '../components/animations/ParallaxSection';
import AnimatedBackground from '../components/animations/AnimatedBackground';
import AnimatedFAQ from '../components/animations/AnimatedFAQ';
import { TestimonialGrid } from '../components/animations/TestimonialCard';
import { AnimatedSection } from '../context/ThemeContext';

// Data untuk FAQ
const faqItems = [
  {
    question: "Apa itu retinopati diabetik?",
    answer: "Retinopati diabetik adalah komplikasi diabetes yang mempengaruhi mata. Ini terjadi ketika kadar gula darah tinggi merusak pembuluh darah di retina, yang dapat menyebabkan kebutaan jika tidak dideteksi dan diobati sejak dini."
  },
  {
    question: "Bagaimana cara kerja RetinaScan?",
    answer: "RetinaScan menggunakan teknologi AI untuk menganalisis citra fundus retina. Algoritma kami yang canggih dapat mendeteksi tanda-tanda retinopati diabetik dengan akurasi tinggi, membantu diagnosis dini dan pencegahan kebutaan."
  },
  {
    question: "Apakah hasil analisis RetinaScan akurat?",
    answer: "Ya, RetinaScan telah dilatih dengan ribuan citra retina dan memiliki tingkat akurasi hingga 98%. Namun, hasil analisis tetap harus dikonfirmasi oleh dokter spesialis mata untuk diagnosis final."
  },
  {
    question: "Berapa lama waktu yang dibutuhkan untuk mendapatkan hasil analisis?",
    answer: "Proses analisis RetinaScan sangat cepat, hanya membutuhkan waktu sekitar 3 detik untuk menganalisis citra fundus retina dan memberikan hasil prediksi tingkat keparahan retinopati diabetik."
  },
  {
    question: "Apakah data saya aman dengan RetinaScan?",
    answer: "Keamanan data adalah prioritas utama kami. Semua data pasien dienkripsi dan disimpan dengan aman sesuai dengan standar keamanan data medis. Kami tidak akan membagikan data Anda tanpa izin."
  }
];

// Data untuk testimonial
const testimonials = [
  {
    quote: "RetinaScan membantu kami mendeteksi kasus retinopati diabetik lebih awal, sehingga kami dapat memberikan perawatan yang tepat waktu kepada pasien.",
    author: "dr. Budi Santoso",
    role: "Dokter Spesialis Mata",
    rating: 5,
    avatar: "https://randomuser.me/api/portraits/men/32.jpg"
  },
  {
    quote: "Sebagai penderita diabetes selama 10 tahun, saya sangat terbantu dengan adanya RetinaScan untuk pemeriksaan rutin kondisi retina saya.",
    author: "Siti Aminah",
    role: "Pasien",
    rating: 5,
    avatar: "https://randomuser.me/api/portraits/women/44.jpg"
  },
  {
    quote: "Teknologi AI yang digunakan RetinaScan sangat membantu klinik kami dalam melayani lebih banyak pasien dengan lebih efisien.",
    author: "dr. Rini Wijaya",
    role: "Direktur Klinik Mata Sehat",
    rating: 4,
    avatar: "https://randomuser.me/api/portraits/women/68.jpg"
  }
];

// Data untuk fitur
const features = [
  {
    icon: <BoltIcon className="w-8 h-8" />,
    title: "Unggah Citra",
    description: "Unggah citra fundus retina dengan mudah dan aman melalui sistem canggih kami.",
    color: "#3B82F6"
  },
  {
    icon: <CogIcon className="w-8 h-8" />,
    title: "Analisis AI",
    description: "Dapatkan prediksi tingkat keparahan retinopati diabetik secara instan dan akurat.",
    color: "#8B5CF6"
  },
  {
    icon: <ChartBarIcon className="w-8 h-8" />,
    title: "Laporan Hasil",
    description: "Lihat laporan deteksi dalam antarmuka yang jelas dan mudah dipahami.",
    color: "#10B981"
  },
  {
    icon: <DocumentTextIcon className="w-8 h-8" />,
    title: "Riwayat Pemeriksaan",
    description: "Akses riwayat pemeriksaan sebelumnya untuk memantau perubahan kondisi retina.",
    color: "#F59E0B"
  },
  {
    icon: <ShieldCheckIcon className="w-8 h-8" />,
    title: "Keamanan Data",
    description: "Data pasien dienkripsi dan disimpan dengan aman sesuai standar keamanan data medis.",
    color: "#EF4444"
  },
  {
    icon: <UserGroupIcon className="w-8 h-8" />,
    title: "Konsultasi Dokter",
    description: "Terhubung dengan dokter spesialis mata untuk konsultasi lanjutan jika diperlukan.",
    color: "#6366F1"
  }
];

// Data untuk proses
const processes = [
  {
    icon: <ClockIcon className="w-8 h-8" />,
    title: "Cepat",
    description: "Hasil analisis dalam hitungan detik, menghemat waktu berharga Anda."
  },
  {
    icon: <CheckCircleIcon className="w-8 h-8" />,
    title: "Akurat",
    description: "Tingkat akurasi hingga 98% dalam mendeteksi retinopati diabetik."
  },
  {
    icon: <AcademicCapIcon className="w-8 h-8" />,
    title: "Terpercaya",
    description: "Dikembangkan bersama dokter spesialis mata terkemuka."
  },
  {
    icon: <LightBulbIcon className="w-8 h-8" />,
    title: "Inovatif",
    description: "Menggunakan teknologi AI terkini untuk analisis citra medis."
  }
];

function LandingPage() {
  const { theme, animations } = useTheme();
  
  return (
    <div className="overflow-hidden">
      {/* Hero Section dengan ParallaxSection dan AnimatedBackground */}
      <ParallaxSection
        backgroundGradient={theme.modernGradient1}
        height="100vh"
        className="flex items-center"
        speed={0.3}
      >
        <AnimatedBackground
          type="dots"
          color={theme.primary}
          secondaryColor={theme.accent}
          density="medium"
          speed="slow"
          className="h-full w-full"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28 h-full flex flex-col justify-center">
            <div className="text-center">
              <TextReveal
                text="Deteksi Dini Retinopati Diabetik"
                tag="h1"
                className="text-4xl md:text-6xl font-bold mb-6 text-white text-shadow"
                gradient={true}
                gradientColors="linear-gradient(90deg, white, rgba(255,255,255,0.8))"
                staggerChildren={0.02}
              />
              
              <motion.p 
                className="text-lg md:text-xl mb-10 text-blue-100 max-w-3xl mx-auto"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.8 }}
              >
                Gunakan RetinaScan untuk menganalisis citra fundus retina dengan teknologi 
                AI canggih dan deteksi dini untuk pencegahan kebutaan.
              </motion.p>
              
              <motion.div
                className="flex flex-col sm:flex-row justify-center gap-4 mb-12"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 1.2 }}
              >
                <AnimatedGradientButton
                  to="/register"
                  gradient="modern1"
                  size="lg"
                >
                  Mulai Sekarang
                  <ArrowRightIcon className="w-5 h-5 ml-2" />
                </AnimatedGradientButton>
                
                <AnimatedGradientButton
                  to="/login"
                  gradient="glass"
                  size="lg"
                >
                  Login
                </AnimatedGradientButton>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.6, duration: 0.5 }}
                className="flex justify-center"
              >
                <motion.div 
                  className="animate-bounce cursor-pointer"
                  whileHover={{ scale: 1.2 }}
                  onClick={() => {
                    window.scrollTo({
                      top: window.innerHeight,
                      behavior: 'smooth'
                    });
                  }}
                >
                  <ArrowDownIcon className="h-8 w-8 text-white opacity-80" />
                </motion.div>
              </motion.div>
            </div>
          </div>
        </AnimatedBackground>
      </ParallaxSection>

      {/* Features Section dengan GlassCard */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection direction="up">
            <div className="text-center mb-16">
              <TextReveal
                text="Fitur Utama"
                tag="h2"
                className="text-3xl md:text-4xl font-bold text-gray-900 mb-4"
                delay={0.2}
              />
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                RetinaScan menyediakan solusi komprehensif untuk deteksi retinopati diabetik
                dengan fitur-fitur canggih.
              </p>
            </div>
          </AnimatedSection>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <AnimatedSection key={index} direction="up" delay={index * 0.2}>
                <GlassCard
                  className="h-full"
                  hoverEffect={true}
                >
                  <div className="w-14 h-14 rounded-xl flex items-center justify-center mb-6"
                       style={{ background: `${feature.color}20`, color: feature.color }}>
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-semibold mb-4 text-gray-900">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </GlassCard>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section dengan AnimatedCounter */}
      <ParallaxSection
        backgroundGradient={`linear-gradient(to right, ${theme.primary}10, ${theme.accent}10)`}
        speed={0.2}
        direction="down"
        className="py-20"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection direction="up">
            <div className="text-center mb-16">
              <TextReveal
                text="Keunggulan RetinaScan"
                tag="h2"
                className="text-3xl md:text-4xl font-bold text-gray-900 mb-4"
                delay={0.2}
              />
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Platform kami telah membantu ribuan pasien untuk mendeteksi retinopati diabetik lebih awal
              </p>
            </div>
          </AnimatedSection>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <AnimatedSection direction="up" delay={0.2}>
              <div className="text-center p-6 bg-white rounded-2xl shadow-sm">
                <AnimatedCounter
                  end={98}
                  suffix="%"
                  className="text-4xl font-bold mb-2 block"
                  style={{ color: theme.primary }}
                  gradientText={true}
                />
                <p className="text-gray-600">Akurasi Deteksi</p>
              </div>
            </AnimatedSection>
            
            <AnimatedSection direction="up" delay={0.4}>
              <div className="text-center p-6 bg-white rounded-2xl shadow-sm">
                <AnimatedCounter
                  end={3}
                  suffix=" detik"
                  className="text-4xl font-bold mb-2 block"
                  style={{ color: theme.primary }}
                  gradientText={true}
                />
                <p className="text-gray-600">Waktu Analisis</p>
              </div>
            </AnimatedSection>
            
            <AnimatedSection direction="up" delay={0.6}>
              <div className="text-center p-6 bg-white rounded-2xl shadow-sm">
                <AnimatedCounter
                  end={5000}
                  suffix="+"
                  className="text-4xl font-bold mb-2 block"
                  style={{ color: theme.primary }}
                  gradientText={true}
                />
                <p className="text-gray-600">Pasien Terbantu</p>
              </div>
            </AnimatedSection>
            
            <AnimatedSection direction="up" delay={0.8}>
              <div className="text-center p-6 bg-white rounded-2xl shadow-sm">
                <AnimatedCounter
                  end={50}
                  suffix="+"
                  className="text-4xl font-bold mb-2 block"
                  style={{ color: theme.primary }}
                  gradientText={true}
                />
                <p className="text-gray-600">Klinik Mitra</p>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </ParallaxSection>

      {/* Process Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection direction="up">
            <div className="text-center mb-16">
              <TextReveal
                text="Proses Sederhana"
                tag="h2"
                className="text-3xl md:text-4xl font-bold text-gray-900 mb-4"
                delay={0.2}
              />
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Deteksi retinopati diabetik dengan cepat dan mudah dalam 3 langkah sederhana
              </p>
            </div>
          </AnimatedSection>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            <AnimatedSection direction="left" delay={0.2}>
              <div className="text-center p-8 relative">
                <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center mx-auto mb-6">
                  <span className="text-2xl font-bold text-blue-600">1</span>
                </div>
                <h3 className="text-xl font-semibold mb-4">Unggah Citra Fundus</h3>
                <p className="text-gray-600">
                  Unggah citra fundus retina Anda melalui platform yang aman dan mudah digunakan.
                </p>
                <div className="absolute top-1/2 right-0 hidden md:block w-1/3 h-0.5 bg-blue-200"></div>
              </div>
            </AnimatedSection>
            
            <AnimatedSection direction="up" delay={0.4}>
              <div className="text-center p-8 relative">
                <div className="w-16 h-16 rounded-full bg-purple-100 flex items-center justify-center mx-auto mb-6">
                  <span className="text-2xl font-bold text-purple-600">2</span>
                </div>
                <h3 className="text-xl font-semibold mb-4">Analisis AI</h3>
                <p className="text-gray-600">
                  Algoritma AI kami menganalisis citra dan mendeteksi tanda-tanda retinopati diabetik.
                </p>
                <div className="absolute top-1/2 right-0 hidden md:block w-1/3 h-0.5 bg-purple-200"></div>
              </div>
            </AnimatedSection>
            
            <AnimatedSection direction="right" delay={0.6}>
              <div className="text-center p-8">
                <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-6">
                  <span className="text-2xl font-bold text-green-600">3</span>
                </div>
                <h3 className="text-xl font-semibold mb-4">Dapatkan Hasil</h3>
                <p className="text-gray-600">
                  Terima laporan hasil analisis yang komprehensif dalam hitungan detik.
                </p>
              </div>
            </AnimatedSection>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {processes.map((process, index) => (
              <AnimatedSection key={index} direction="up" delay={index * 0.2 + 0.2}>
                <div className="text-center p-6 bg-white rounded-2xl shadow-sm border border-gray-100">
                  <div className="w-14 h-14 rounded-full bg-blue-50 flex items-center justify-center mx-auto mb-4"
                       style={{ color: theme.primary }}>
                    {process.icon}
                  </div>
                  <h3 className="text-lg font-semibold mb-2">{process.title}</h3>
                  <p className="text-gray-600 text-sm">{process.description}</p>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonial Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection direction="up">
            <div className="text-center mb-16">
              <TextReveal
                text="Apa Kata Mereka"
                tag="h2"
                className="text-3xl md:text-4xl font-bold text-gray-900 mb-4"
                delay={0.2}
              />
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Testimoni dari dokter dan pasien yang telah menggunakan RetinaScan
              </p>
            </div>
          </AnimatedSection>

          <TestimonialGrid testimonials={testimonials} />
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedFAQ 
            items={faqItems} 
            title="Pertanyaan Umum"
            subtitle="Jawaban untuk pertanyaan yang sering diajukan tentang RetinaScan"
          />
        </div>
      </section>

      {/* CTA Section */}
      <ParallaxSection
        backgroundGradient={theme.modernGradient2}
        speed={0.3}
        direction="up"
        className="py-20"
        overlay={true}
        overlayColor="rgba(0, 0, 0, 0.3)"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <GlassCard 
              className="py-12 px-8 text-center"
              dark={true}
              shadow={true}
            >
              <TextReveal
                text="Mulai Deteksi Dini Sekarang"
                tag="h2"
                className="text-3xl md:text-4xl font-bold text-white mb-6"
                delay={0.2}
              />
              <p className="text-xl text-blue-100 mb-8">
                Bergabunglah dengan ribuan pengguna yang telah merasakan manfaat RetinaScan untuk kesehatan mata mereka.
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <AnimatedGradientButton
                  to="/register"
                  gradient="modern4"
                  size="lg"
                >
                  Daftar Gratis
                </AnimatedGradientButton>
                <AnimatedGradientButton
                  to="/login"
                  gradient="glass"
                  size="lg"
                >
                  Login
                </AnimatedGradientButton>
              </div>
            </GlassCard>
          </div>
        </div>
      </ParallaxSection>
    </div>
  );
}

export default LandingPage;