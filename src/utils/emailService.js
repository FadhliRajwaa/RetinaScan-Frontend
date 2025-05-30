import emailjs from '@emailjs/browser';

// Konfigurasi EmailJS
const SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID || 'default_service';
const TEMPLATE_ID_RESET = import.meta.env.VITE_EMAILJS_RESET_TEMPLATE_ID || 'template_reset';
const PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY || '';

let isInitialized = false;

// Inisialisasi EmailJS
export const initEmailJS = () => {
  if (isInitialized) {
    return;
  }
  
  try {
    console.log('Menginisialisasi EmailJS dengan konfigurasi:');
    console.log('- Service ID:', SERVICE_ID);
    console.log('- Template Reset ID:', TEMPLATE_ID_RESET);
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

    console.log('Mengirim email reset password dengan template ID:', TEMPLATE_ID_RESET);
    
    const response = await emailjs.send(
      SERVICE_ID,
      TEMPLATE_ID_RESET,
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
      errorMessage += ': Parameter tidak valid';
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

export default {
  initEmailJS,
  sendResetPasswordEmail,
  generateResetToken,
  createResetPasswordLink,
}; 