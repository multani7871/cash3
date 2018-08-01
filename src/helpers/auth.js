import { firebaseAuth, googleProvider } from '../config/constants';

export function loginWithGoogle() {
  return firebaseAuth().signInWithRedirect(googleProvider);
}
export function logout() {
  return firebaseAuth().signOut();
}

export function deleteUser() {
  return firebaseAuth().currentUser.delete();
}
export function getRedirectResult() {
  return firebaseAuth().getRedirectResult();
}