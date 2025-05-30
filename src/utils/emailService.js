import emailjs from '@emailjs/browser';

// Konfigurasi EmailJS
const SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID || 'Email_Fadhli_ID';
const TEMPLATE_ID_RESET = import.meta.env.VITE_EMAILJS_RESET_TEMPLATE_ID || 'template_j9rj1wu';
const PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY || '';

// Reset flag saat file di-reload untuk mencegah caching
let isInitialized = false;

/**
 * Reset konfigurasi EmailJS untuk mengatasi masalah cache
 */
export const resetEmailJSConfig = () => {
  isInitialized = false;
  console.log('Konfigurasi EmailJS di-reset');
  
  // Re-inisialisasi dengan konfigurasi terbaru
  initEmailJS();
};

// Inisialisasi EmailJS
export const initEmailJS = () => {
  if (isInitialized) {
    console.log('EmailJS sudah diinisialisasi sebelumnya, menggunakan konfigurasi yang ada');
    return;
  }
  
  try {
    console.log('Menginisialisasi EmailJS dengan konfigurasi:');
    console.log('- Service ID:', SERVICE_ID);
    console.log('- Template Reset ID:', TEMPLATE_ID_RESET, '(Versi Terbaru)');
    console.log('- Public Key:', PUBLIC_KEY ? 'Terisi' : 'Tidak terisi');
    
    emailjs.init({
      publicKey: PUBLIC_KEY,
      blockHeadless: false, // Diaktifkan agar bisa digunakan di lingkungan development
      limitRate: {
        throttle: 3000, // 3 detik antara permintaan untuk mencegah spam
      },
    });
    
    isInitialized = true;
    console.log('EmailJS berhasil diinisialisasi');
  } catch (error) {
    console.error('Gagal menginisialisasi EmailJS:', error);
    throw new Error('Gagal menginisialisasi EmailJS: ' + error.message);
  }
};

/**
 * Mengirim email reset password
 * @param {Object} data - Data untuk email reset password
 * @param {string} data.email - Email penerima
 * @param {string} data.name - Nama penerima
 * @param {string} data.resetLink - Link reset password
 * @param {string} data.resetToken - Token reset password
 * @returns {Promise} - Promise hasil pengiriman email
 */
export const sendResetPasswordEmail = async (data) => {
  if (!isInitialized) {
    try {
      initEmailJS();
    } catch (error) {
      console.error('EmailJS tidak dapat diinisialisasi saat pengiriman email:', error);
      return {
        success: false,
        message: 'Sistem email tidak dapat diinisialisasi. Silakan coba lagi nanti.',
        error,
      };
    }
  }
  
  // Validasi parameter
  if (!data.email) {
    console.error('Email tidak diberikan untuk pengiriman reset password');
    return {
      success: false,
      message: 'Email tidak diberikan',
      error: new Error('Email parameter is required'),
    };
  }
  
  if (!data.resetToken) {
    console.error('Token reset tidak diberikan untuk pengiriman reset password');
    return {
      success: false, 
      message: 'Token reset tidak diberikan',
      error: new Error('Reset token parameter is required'),
    };
  }
  
  try {
    console.log('Mempersiapkan pengiriman email reset password ke:', data.email);
    
    const templateParams = {
      to_email: data.email,
      to_name: data.name || 'Pengguna',
      reset_link: data.resetLink,
      reset_token: data.resetToken,
      app_name: 'RetinaScan',
    };

    // Gunakan template ID dari konstanta, bukan hardcoded value
    const templateId = TEMPLATE_ID_RESET;
    console.log('Mengirim email reset password dengan template ID:', templateId);
    
    // Log detail untuk troubleshooting
    console.log('Detail permintaan EmailJS:');
    console.log('- Service:', SERVICE_ID);
    console.log('- Template:', templateId);
    console.log('- Parameters:', JSON.stringify(templateParams, null, 2));
    
    const response = await emailjs.send(
      SERVICE_ID,
      templateId,
      templateParams
    );

    console.log('Email reset password berhasil dikirim:', response);
    return {
      success: true,
      message: 'Email reset password berhasil dikirim',
      response,
    };
  } catch (error) {
    console.error('Error mengirim reset password email:', error);
    console.error('Error status:', error.status);
    console.error('Error text:', error.text);
    
    let errorMessage = 'Gagal mengirim email reset password';
    
    // Menambahkan detail error lebih spesifik
    if (error.status === 400) {
      if (error.text && error.text.includes('template ID not found')) {
        errorMessage = 'Template email tidak ditemukan. Silakan hubungi administrator untuk mengatur template email reset password.';
        console.error('Template ID tidak ditemukan. Pastikan template sudah dibuat di dashboard EmailJS: https://dashboard.emailjs.com/admin/templates');
        // Tampilkan detail template yang dicoba digunakan
        console.error(`Template ID yang dicoba: ${TEMPLATE_ID_RESET}`);
      } else {
        errorMessage += ': Parameter tidak valid';
      }
    } else if (error.status === 401 || error.status === 403) {
      errorMessage += ': Masalah autentikasi dengan layanan email';
    } else if (error.status >= 500) {
      errorMessage += ': Layanan email sedang mengalami masalah';
    }
    
    return {
      success: false,
      message: errorMessage,
      error,
    };
  }
};

/**
 * Membuat token reset password sederhana
 * @returns {string} - Token reset password
 */
export const generateResetToken = () => {
  return Math.random().toString(36).substring(2, 15) + 
         Math.random().toString(36).substring(2, 15) +
         Date.now().toString(36);
};

/**
 * Membuat link reset password dengan token
 * @param {string} token - Token reset password
 * @returns {string} - Link reset password lengkap
 */
export const createResetPasswordLink = (token) => {
  const baseUrl = window.location.origin;
  return `${baseUrl}/#/reset-password?code=${token}`;
};

/**
 * Fungsi alternatif untuk reset password tanpa EmailJS
 * Gunakan hanya untuk fallback jika EmailJS tidak berfungsi
 * @param {Object} data - Data untuk reset password
 * @returns {Object} - Hasil operasi
 */
export const alternativeResetNotification = (data) => {
  console.warn('Menggunakan metode alternatif untuk notifikasi reset password');
  
  if (!data.email || !data.resetToken) {
    return {
      success: false,
      message: 'Data tidak lengkap untuk reset password',
    };
  }
  
  // Dalam situasi nyata, ini bisa diganti dengan metode alternatif seperti SMS atau notifikasi di aplikasi
  
  return {
    success: true,
    message: 'Kode reset password telah dibuat. Gunakan kode berikut untuk reset password: ' + data.resetToken,
  };
};

export default {
  initEmailJS,
  sendResetPasswordEmail,
  generateResetToken,
  createResetPasswordLink,
  alternativeResetNotification,
  resetEmailJSConfig,
}; 