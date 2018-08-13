import { firebaseAuth, googleProvider } from './firebaseClient';

export function loginWithGoogle() {
  return firebaseAuth().signInWithRedirect(googleProvider);
}
export function logout() {
  return firebaseAuth().signOut();
}

export function deleteUserFromAuth() {
  return firebaseAuth().currentUser.delete();
}
export function getRedirectResult() {
  return firebaseAuth().getRedirectResult();
}

export function onAuthStateChanged(callback) {
  return firebaseAuth().onAuthStateChanged(callback);
}

export function reloadUser() {
  return firebaseAuth().currentUser.reload();
}

export async function getIdToken() {
  return firebaseAuth().currentUser.getIdToken(true);
}
