import { firebaseAuth, googleProvider, firebase } from './firebaseClient';

export async function loginWithGoogle() {
  await firebaseAuth().setPersistence(firebase.auth.Auth.Persistence.LOCAL)
  await firebaseAuth().signInWithRedirect(googleProvider);
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

// export async function reauthenticateUser() {
//   let credential;
//   return firebaseAuth().currentUser.reauthenticateAndRetrieveDataWithCredential(credential)
// }

