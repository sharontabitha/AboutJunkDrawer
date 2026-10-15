const sessionKey = "jd_admin";

export const authService = {
  isSignedIn() {
    return sessionStorage.getItem(sessionKey) === "1";
  },
  signIn(email, password) {
    if (email.trim().toLowerCase() !== "niishimurra@gmail.com" || password !== "drawer123") return false;
    sessionStorage.setItem(sessionKey, "1");
    return true;
  },
  signOut() {
    sessionStorage.removeItem(sessionKey);
  }
};