import {db} from '../config/constants';

export function createNewUser(uid, email, OAuthToken) {
  db.collection('users').doc(uid).set({
    email: email,
    OAuthToken: OAuthToken
  })
  .then(console.log('user created'))
  .catch(error => console.log(error));
}

export function deleteUserFromDB(uid) {
  db.collection('users').doc(uid)
  .delete()
    .then(console.log('user deleted'))
    .catch(error => console.log(error));
}