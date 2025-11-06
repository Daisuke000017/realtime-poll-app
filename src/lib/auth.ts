import { signInAnonymously, onAuthStateChanged, User } from 'firebase/auth';
import { auth } from './firebase';

// Ensure user is authenticated anonymously
export async function ensureAnonymousAuth(): Promise<User> {
  return new Promise((resolve, reject) => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      unsubscribe();

      if (user) {
        resolve(user);
      } else {
        try {
          const result = await signInAnonymously(auth);
          resolve(result.user);
        } catch (error) {
          reject(error);
        }
      }
    });
  });
}

// Get current user or sign in anonymously
export async function getCurrentUser(): Promise<User> {
  if (auth.currentUser) {
    return auth.currentUser;
  }
  return ensureAnonymousAuth();
}

// Subscribe to auth state changes
export function subscribeToAuthState(callback: (user: User | null) => void): () => void {
  return onAuthStateChanged(auth, callback);
}
