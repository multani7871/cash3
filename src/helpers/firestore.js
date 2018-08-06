import {db} from '../config/constants';

export function createNewUser(uid, email, OAuthToken) {
  db.collection('users').doc(uid).set({
    email: email,
    OAuthToken: OAuthToken
  })
  .then(console.log('user created'))
  .catch(error => console.log(error));
}

export function updateOAuthToken(uid, OAuthToken) {
  db.collection('users').doc(uid).update({
    OAuthToken: OAuthToken
  })
    .then(console.log('Oauth token updated'))
    .catch(error => console.log(error));
}

export function doesUserExist(uid) {
  return db.collection('users').doc(uid).get()
  .then(function(user){
      if (user.exists) {
        return true;
      } else {
        return false;
      }
    })
    .catch(error => console.log(error));
}

export function deleteUserFromDB(uid) {
  db.collection('users').doc(uid)
  .delete()
    .then(console.log('user deleted'))
    .catch(error => console.log(error));
}

// export async function getUserOAuthToken(uid) {
//   let OAuthToken;
//   db.collection('users').doc(uid).get()
//   .then(doc => OAuthToken = doc.data().OAuthToken)
//   .catch(error => console.log(error));
//   // console.log(OAuthToken);
// }