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
  
  // Clear session storage
  sessionStorage.clear();
  console.log('Session storage cleared');
  
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