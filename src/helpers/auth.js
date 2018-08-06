import { firebaseAuth, googleProvider } from './firebaseClient';

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

export function onAuthStateChanged(callback) {
  return firebaseAuth().onAuthStateChanged(callback)
}