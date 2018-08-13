const { db } = require('./firebaseClient');

exports.createNewUser = async (uid, email, OAuthToken) => {
  await db
    .collection('users')
    .doc(uid)
    .set({
      email,
      OAuthToken,
    })
    .catch(error => console.log(error));
};

exports.updateOAuthToken = async (uid, OAuthToken) => {
  await db.collection('users')
    .doc(uid)
    .update({
      OAuthToken,
    })
    .catch(error => console.log(error));
};

exports.doesUserExist = async (uid) => {
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
};

exports.deleteUserFromDB = async (uid) => {
  db.collection('users')
    .doc(uid)
    .delete()
    .catch(error => console.log(error));
};

exports.getUserOAuthToken = async uid => db
  .collection('users')
  .doc(uid)
  .get()
  .then(doc => doc.data().OAuthToken)
  .catch(error => console.log(error));

exports.addNewCalendarToUser = (uid, calendarID) => {
  db.collection('users')
    .doc(uid)
    .update({
      calendarID,
    })
    .catch(error => console.log(error));
};

exports.getUserCalID = async uid => db
  .collection('users')
  .doc(uid)
  .get()
  .then(doc => doc.data().calendarID)
  .catch(error => console.log(error));

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

exports.getAllItemsClient = async (uid) => {
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
};

exports.deleteItemFromDB = async (uid, itemId) => {
  try {
    await db
      .collection('users')
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

// exports.saveRefreshToken = async (uid, refreshToken) => {
//   await db.collection('users')
//     .doc(uid)
//     .set({
//       refreshToken,
//     })
//     .catch(error => console.log(error));
// };