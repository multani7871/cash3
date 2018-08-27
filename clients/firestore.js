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
    await db
      .collection('users')
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
  .then(doc => doc.data().institutionName)
  .catch(error => console.log(error));

const getQuerySnapshot = async uid => db
  .collection('users')
  .doc(uid)
  .collection('items')
  .get()
  .catch(error => console.log(error));

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

exports.addAccountToItem = async (itemId, account) => {
  await db
    .collection('items')
    .doc(itemId)
    .collection('accounts')
    .doc(account.account_id)
    .set({
      account,
    })
    .catch(error => console.log(error));
};

exports.updateItemAccounts = async (itemId, account) => {
  await db
    .collection('items')
    .doc(itemId)
    .collection('accounts')
    .doc(account.account_id)
    .update({
      account,
    })
    .catch(error => console.log(error));
};

const deleteItemAccount = async (itemId, accountId) => {
  await db
    .collection('items')
    .doc(itemId)
    .collection('accounts')
    .doc(accountId)
    .delete()
    .catch(error => console.log(error));
};

const getAllItemAccountsById = async (itemId) => {
  const accountIds = [];
  try {
    const querySnapshot = await db
      .collection('items')
      .doc(itemId)
      .collection('accounts')
      .get();
    querySnapshot.forEach((doc) => {
      const accountId = doc.data().account.account_id;
      accountIds.push(accountId);
    });
  } catch (error) {
    console.log(error);
  }
  return accountIds;
};

exports.deleteAllAccountsForAnItem = async (itemId) => {
  try {
    const accountIdsToDelete = await getAllItemAccountsById(itemId);
    const deletionRequests = await accountIdsToDelete.map(async (accountId) => {
      await deleteItemAccount(itemId, accountId);
    });
    await Promise.all(deletionRequests);
  } catch (error) {
    console.log(error);
  }
};

exports.addATransactionToItem = async (itemId, transaction) => {
  await db
    .collection('items')
    .doc(itemId)
    .collection('transactions')
    .doc(transaction.transaction_id)
    .set({
      transaction,
    })
    .catch(error => console.log(error));
};

const getAllItemTransactionsById = async (itemId) => {
  const transactionIds = [];
  try {
    const querySnapshot = await db
      .collection('items')
      .doc(itemId)
      .collection('transactions')
      .get();
    querySnapshot.forEach((doc) => {
      const transactionId = doc.data().transaction.transaction_id;
      transactionIds.push(transactionId);
    });
  } catch (error) {
    console.log(error);
  }
  return transactionIds;
};

const deleteItemTransaction = async (itemId, transactionId) => {
  await db
    .collection('items')
    .doc(itemId)
    .collection('transactions')
    .doc(transactionId)
    .delete()
    .catch(error => console.log(error));
};

exports.deleteAllTransactionsForAnItem = async (itemId) => {
  try {
    const transactionIdsToDelete = await getAllItemTransactionsById(itemId);
    const deletionRequests = await transactionIdsToDelete.map(async (transactionId) => {
      await deleteItemTransaction(itemId, transactionId);
    });
    await Promise.all(deletionRequests);
  } catch (error) {
    console.log(error);
  }
};
