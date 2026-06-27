// Auth utility helpers

export const login = (email, password) => {
  localStorage.setItem("isLoggedIn", "true");
  localStorage.setItem("ownerEmail", email);
};

export const logout = () => {
  localStorage.removeItem("isLoggedIn");
  localStorage.removeItem("ownerEmail");
};

export const isAuthenticated = () => {
  return localStorage.getItem("isLoggedIn") === "true";
};

export const getOwnerEmail = () => {
  return localStorage.getItem("ownerEmail") || "";
};
