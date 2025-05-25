import emailjs from '@emailjs/browser';

// Konfigurasi EmailJS
const SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID || 'default_service';
const TEMPLATE_ID_RESET = import.meta.env.VITE_EMAILJS_RESET_TEMPLATE_ID || 'template_reset';
const PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY || '';

// Inisialisasi EmailJS
export const initEmailJS = () => {
  emailjs.init({
    publicKey: PUBLIC_KEY,
    blockHeadless: false, // Diaktifkan agar bisa digunakan di lingkungan development
    limitRate: {
      throttle: 3000, // 3 detik antara permintaan untuk mencegah spam
    },
  });
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
  try {
    const templateParams = {
      to_email: data.email,
      to_name: data.name || 'Pengguna',
      reset_link: data.resetLink,
      reset_token: data.resetToken,
      app_name: 'RetinaScan',
    };

    const response = await emailjs.send(
      SERVICE_ID,
      TEMPLATE_ID_RESET,
      templateParams
    );

    return {
      success: true,
      message: 'Email reset password berhasil dikirim',
      response,
    };
  } catch (error) {
    console.error('Error sending reset password email:', error);
    return {
      success: false,
      message: 'Gagal mengirim email reset password',
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
  return `${baseUrl}/reset-password?token=${token}`;
};

export default {
  initEmailJS,
  sendResetPasswordEmail,
  generateResetToken,
  createResetPasswordLink,
}; 