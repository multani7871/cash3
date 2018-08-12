import { db } from './firebaseClient';

export function createNewUser(uid, email, OAuthToken) {
  db.collection('users')
    .doc(uid)
    .set({
      email,
      OAuthToken,
    })
    .then(console.log('user created'))
    .catch(error => console.log(error));
}

export function updateOAuthToken(uid, OAuthToken) {
  db.collection('users')
    .doc(uid)
    .update({
      OAuthToken,
    })
    .catch(error => console.log(error));
}

export async function doesUserExist(uid) {
  let userExists = false;
  try {
    const user = await db
      .collection('users')
      .doc(uid)
      .get();
    if (user.exists) {
      userExists = true;
    }
  } catch (error) {
    console.log(error);
  }
  return userExists;
}

export function deleteUserFromDB(uid) {
  db.collection('users')
    .doc(uid)
    .delete()
    .then(console.log('user deleted'))
    .catch(error => console.log(error));
}

export function getUserOAuthToken(uid) {
  return db
    .collection('users')
    .doc(uid)
    .get()
    .then(doc => doc.data().OAuthToken)
    .catch(error => console.log(error));
}

export function addNewCalendarToUser(uid, calendarID) {
  db.collection('users')
    .doc(uid)
    .update({
      calendarID,
    })
    .catch(error => console.log(error));
}

export function getUserCalID(uid) {
  return db
    .collection('users')
    .doc(uid)
    .get()
    .then(doc => doc.data().calendarID)
    .catch(error => console.log(error));
}

export async function getAllItems(uid) {
  const itemIDs = [];
  try {
    const querySnapshot = await db
      .collection('users')
      .doc(uid)
      .collection('items')
      .get();
    querySnapshot.forEach((doc) => {
      const id = doc.id;
      const itemRaw = doc.data();
      const itemData = {};
      itemData.itemId = id;
      itemData.institutionName = itemRaw.institutionName;
      itemIDs.push(itemData);
    });
  } catch (error) {
    console.log(error);
  }
  return itemIDs;
}
// export async function getUserDataRealTime(uid) {
//   let userData;
//   await db.collection('users').doc(uid)
//     .onSnapshot(async (doc) => {
//       console.log('Current data: ', doc.data());
//       userData = await doc.data();
//     });
//   return userData;
// }
// userData = await db.collection('users').doc(uid);
// userData.onSnapshot(async (user) => {
//   stuff = await user.data().rnado;
//   console.log(stuff);
//   return stuff;
// });
// console.log(stuff);
