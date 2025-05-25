/**
 * Utility functions for authentication
 */

/**
 * Process logout parameters from URL
 * @param {Object} params - URL parameters
 * @returns {Object} - Processed parameters
 */
export const processLogoutParams = (params) => {
  const logoutParam = params.get('logout');
  const fromParam = params.get('from');
  const errorParam = params.get('error');
  const timeParam = params.get('t');
  
  console.group('Logout Parameters');
  console.log('Logout:', logoutParam);
  console.log('From:', fromParam);
  console.log('Error:', errorParam);
  console.log('Timestamp:', timeParam);
  console.groupEnd();
  
  return {
    isLogout: logoutParam === 'true',
    from: fromParam,
    hasError: errorParam === 'true',
    timestamp: timeParam
  };
};

/**
 * Clean up after logout
 * @returns {void}
 */
export const cleanupAfterLogout = () => {
  console.log('Cleaning up after logout');
  
  // Remove token
  if (localStorage.getItem('token')) {
    localStorage.removeItem('token');
    console.log('Token removed from localStorage');
  }
  
  // Remove user data if exists
  if (localStorage.getItem('user')) {
    localStorage.removeItem('user');
    console.log('User data removed from localStorage');
  }
  
  // Clear session storage
  sessionStorage.clear();
  console.log('Session storage cleared');
  
  // Remove any auth cookies if they exist
  document.cookie = 'auth=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
  
  // Could add more cleanup here if needed
};

/**
 * Show appropriate message after logout
 * @param {Object} params - Processed logout parameters
 * @returns {string|null} - Message to show or null
 */
export const getLogoutMessage = (params) => {
  if (!params.isLogout) return null;
  
  if (params.hasError) {
    return 'Terjadi kesalahan saat logout. Silakan coba lagi.';
  }
  
  if (params.from === 'dashboard') {
    return 'Anda telah berhasil logout dari dashboard.';
  }
  
  return 'Anda telah berhasil logout.';
};

/**
 * Handle logout from frontend
 * @param {Function} setIsAuthenticated - Function to update authentication state
 * @param {Function} setUserName - Function to update user name state
 * @param {Function} setToken - Function to update token state
 * @param {Function} navigate - React Router navigate function
 * @returns {void}
 */
export const handleFrontendLogout = (setIsAuthenticated, setUserName, setToken, navigate) => {
  // Clean up all auth data
  cleanupAfterLogout();
  
  // Update state
  if (setIsAuthenticated) setIsAuthenticated(false);
  if (setUserName) setUserName('');
  if (setToken) setToken('');
  
  // Navigate to login page if navigate function is provided
  if (navigate) {
    navigate('/#/?logout=true&from=frontend');
  } else {
    // Fallback to window.location if navigate is not provided
    window.location.href = '/#/?logout=true&from=frontend';
  }
};

/**
 * Parse hash parameters from URL
 * @returns {URLSearchParams} - URL search params from hash
 */
export const getHashParams = () => {
  try {
    // Defensive check untuk window.location
    if (!window || !window.location) {
      console.warn('Window location tidak tersedia');
      return new URLSearchParams('');
    }
    
    // Pastikan window.location.hash tidak undefined dan tidak kosong
    const hash = window.location.hash;
    if (!hash || typeof hash !== 'string') {
      console.warn('Hash tidak ada atau bukan string');
      return new URLSearchParams('');
    }
    
    // Cari posisi '?' pertama dalam string hash
    const questionMarkIndex = hash.indexOf('?');
    
    // Jika tidak ada '?', return URLSearchParams kosong
    if (questionMarkIndex === -1) {
      return new URLSearchParams('');
    }
    
    // Ambil substring setelah '?' dengan cara yang lebih aman
    const hashParams = hash.substring(questionMarkIndex + 1);
    
    // Pastikan hashParams adalah string yang valid
    if (!hashParams || typeof hashParams !== 'string') {
      console.warn('Format hash params tidak valid');
      return new URLSearchParams('');
    }
    
    return new URLSearchParams(hashParams);
  } catch (error) {
    console.error('Error saat parsing hash params:', error);
    return new URLSearchParams('');
  }
};

/**
 * Clean URL by removing hash parameters
 * @returns {void}
 */
export const cleanHashParams = () => {
  try {
    // Defensive check untuk window.location
    if (!window || !window.location) {
      console.warn('Window location tidak tersedia');
      return;
    }
    
    // Pastikan window.location.hash tidak undefined dan tidak kosong
    const hash = window.location.hash;
    if (!hash || typeof hash !== 'string') {
      console.warn('Hash tidak ada atau bukan string saat membersihkan params');
      return;
    }
    
    // Cari posisi '?' pertama dalam string hash
    const questionMarkIndex = hash.indexOf('?');
    
    // Jika tidak ada '?', tidak perlu membersihkan parameter
    if (questionMarkIndex === -1) {
      return;
    }
    
    // Ambil bagian path dengan substring yang lebih aman
    const hashPath = questionMarkIndex > 0 ? hash.substring(0, questionMarkIndex) : '#/';
    
    if (window.history && typeof window.history.replaceState === 'function') {
      window.history.replaceState({}, document.title, hashPath);
      console.log('Parameters removed from URL, new hash:', hashPath);
    } else {
      console.warn('History API tidak didukung browser');
    }
  } catch (error) {
    console.error('Error saat membersihkan hash params:', error);
  }
};