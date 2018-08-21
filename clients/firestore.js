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
  await db
    .collection('users')
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
  try {
    await db.collection('users')
      .doc(uid)
      .delete();
  } catch (error) {
    console.log(error);
  }
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
) => {
  await Promise.all([
    db
      .collection('users')
      .doc(uid)
      .collection('items')
      .doc(itemId)
      .set({
        itemId,
      }),
    db
      .collection('items')
      .doc(itemId)
      .set({
        institutionName,
        institutionId,
        accessToken: accesstoken,
        requestId,
        webhook,
      }),
  ]).catch(error => console.log(error));
};

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

const getInstitutionName = async itemId => db
  .collection('items')
  .doc(itemId)
  .get()
  .then(doc => doc.data().institutionName);

const getQuerySnapshot = async uid => db
  .collection('users')
  .doc(uid)
  .collection('items')
  .get();

const buildClientPayloadItem = async (itemId) => {
  const itemData = {};
  itemData.itemId = itemId;
  try {
    const institutionName = await getInstitutionName(itemId);
    itemData.institutionName = institutionName;
  } catch (error) {
    console.log(error);
  }
  return itemData;
};

exports.getAllItemsClient = async (uid) => {
  // todo: refactor this into a reduce
  const itemIDs = [];
  let querySnapshot;
  let itemPayload;
  try {
    querySnapshot = await getQuerySnapshot(uid);
    querySnapshot.forEach((doc) => {
      itemIDs.push(doc.id);
    });
    const getItemObj = async itemId => buildClientPayloadItem(itemId);
    const getAllItemObjs = itemIDs.map(getItemObj);
    itemPayload = await Promise.all(getAllItemObjs);
  } catch (error) {
    console.log(error);
  }
  return itemPayload;
};

exports.deleteItemFromDB = async (uid, itemId) => {
  try {
    await Promise.all([
      db
        .collection('users')
        .doc(uid)
        .collection('items')
        .doc(itemId)
        .delete(),
      db
        .collection('items')
        .doc(itemId)
        .delete(),
    ]);
  } catch (error) {
    console.log(error);
  }
};

exports.getAccessToken = async itemId => db
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
