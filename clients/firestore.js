const { db } = require('./firebaseClient');

// exports.createNewUser = (uid, email, OAuthToken) => {
//   db.collection("users")
//     .doc(uid)
//     .set({
//       email: email,
//       OAuthToken: OAuthToken
//     })
//     .then(console.log("user created"))
//     .catch(error => console.log(error));
// };

// exports.updateOAuthToken = (uid, OAuthToken) => {
//   db.collection("users")
//     .doc(uid)
//     .update({
//       OAuthToken: OAuthToken
//     })
//     .catch(error => console.log(error));
// };

// exports.doesUserExist = uid => {
//   return db
//     .collection("users")
//     .doc(uid)
//     .get()
//     .then(function(user) {
//       if (user.exists) {
//         return true;
//       } else {
//         return false;
//       }
//     })
//     .catch(error => console.log(error));
// };

// exports.deleteUserFromDB = uid => {
//   db.collection("users")
//     .doc(uid)
//     .delete()
//     .then(console.log("user deleted"))
//     .catch(error => console.log(error));
// };

// exports.getUserOAuthToken = uid => {
//   return db
//     .collection("users")
//     .doc(uid)
//     .get()
//     .then(function(doc) {
//       return doc.data().OAuthToken;
//     })
//     .catch(error => console.log(error));
// };

exports.addNewCalendarToUser = (uid, calendarID) => {
  db.collection('users')
    .doc(uid)
    .update({
      calendarID,
    })
    .catch(error => console.log(error));
};

// exports.getUserCalID = uid => {
//   return db
//     .collection("users")
//     .doc(uid)
//     .get()
//     .then(function(doc) {
//       return doc.data().calendarID;
//     })
//     .catch(error => console.log(error));
// };

exports.addItemsToUser = async (
  uid,
  itemId,
  institutionName,
  institutionId,
  accesstoken,
  requestId,
  webhook,
) => db
  .collection('users')
  .doc(uid)
  .collection('items')
  .doc(itemId)
  .set({
    institutionName,
    institutionId,
    accessToken: accesstoken,
    requestId,
    webhook,
  })
  .catch(error => console.log(error));

exports.getAllItems = async (uid) => {
  const itemIDs = [];
  try {
    const querySnapshot = await db
      .collection('users')
      .doc(uid)
      .collection('items')
      .get();
    querySnapshot.forEach((doc) => {
      const id = doc.id;
      const itemData = doc.data();
      itemData.itemId = id;
      itemIDs.push(itemData);
    });
  } catch (error) {
    console.log(error);
  }
  return itemIDs;
};

exports.deleteItemFromDB = async (uid, itemId) => {
  try {
    await db.collection('users')
      .doc(uid)
      .collection('items')
      .doc(itemId)
      .delete();
  } catch (error) {
    console.log(error);
  }
};

exports.getAccessToken = async (uid, itemId) => db
  .collection('users')
  .doc(uid)
  .collection('items')
  .doc(itemId)
  .get()
  .then(doc => doc.data().accessToken)
  .catch(error => console.log(error));
