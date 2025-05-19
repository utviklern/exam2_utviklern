// auth state
let authState = {
  isLoggedIn: !!localStorage.getItem("accessToken"),
  listeners: new Set(),
};

// oppdaterer auth state
export function updateAuthState(isLoggedIn) {
  authState.isLoggedIn = isLoggedIn;
  authState.listeners.forEach(listener => listener(isLoggedIn));
}

// listener på auth state endringer
export function subscribeToAuthState(listener) {
  authState.listeners.add(listener);
  return () => authState.listeners.delete(listener);
}

// hente auth state
export function getAuthState() {
  return authState.isLoggedIn;
} 