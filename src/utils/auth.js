// Auth utility helpers

/** Save JWT token and user data returned by backend */
export const saveAuthData = (token, user) => {
  localStorage.setItem('inventory_token', token);
  localStorage.setItem('inventory_user', JSON.stringify(user));
  // Legacy key kept for any old checks
  localStorage.setItem('isLoggedIn', 'true');
};

/** Mock login for dev/fallback when Google Client ID is not configured */
export const login = (email, _password) => {
  localStorage.setItem('isLoggedIn', 'true');
  localStorage.setItem('ownerEmail', email);
  // Set a pseudo token so isAuthenticated() still works
  localStorage.setItem('inventory_token', 'dev-mock-token');
  localStorage.setItem('inventory_user', JSON.stringify({ name: 'Owner', email }));
};

export const logout = () => {
  localStorage.removeItem('inventory_token');
  localStorage.removeItem('inventory_user');
  localStorage.removeItem('isLoggedIn');
  localStorage.removeItem('ownerEmail');
};

export const isAuthenticated = () => {
  // Primary check: real JWT token
  const token = localStorage.getItem('inventory_token');
  if (token) return true;
  // Fallback: legacy mock login
  return localStorage.getItem('isLoggedIn') === 'true';
};

export const getUser = () => {
  try {
    const raw = localStorage.getItem('inventory_user');
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

export const getOwnerEmail = () => {
  return localStorage.getItem('ownerEmail') || '';
};
