export const getAuthToken = (): string | null => {
  return localStorage.getItem('auth_token');
};

export const setAuthToken = (token: string): void => {
  localStorage.setItem('auth_token', token);
};

export const removeAuthToken = (): void => {
  localStorage.removeItem('auth_token');
};

export const getAuthHeaders = (): Record<string, string> => {
  const token = getAuthToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export const isAuthenticated = (): boolean => {
  return !!getAuthToken();
};

export const logout = (navigateCallback?: () => void): void => {
  removeAuthToken();
  if (navigateCallback) {
    // Use React Router navigation when callback provided
    navigateCallback();
  } else {
    // Fallback to window.location for contexts without router
    window.location.href = '/';
  }
};

export const getUserInfo = () => {
  const token = getAuthToken();
  if (!token) return null;
  
  try {
    // Decode JWT payload (simple base64 decode)
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload;
  } catch {
    return null;
  }
};
