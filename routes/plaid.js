const { addItemsToUser } = require('../clients/firestore');
const { plaidClient } = require('../clients/plaidClient');
const { getAllItems, deleteItemFromDB, getAccessToken } = require('../clients/firestore');

exports.exchangePublicToken = async (req, res) => {
  const publicToken = req.body.publicToken;
  const uid = req.body.uid;
  const institutionName = req.body.institution.name;
  const institutionId = req.body.institution.institution_id;
  const webhook = req.body.webhook;
  try {
    const payload = await plaidClient.exchangePublicToken(publicToken);
    const itemId = payload.item_id;
    const accessToken = payload.access_token;
    const requestId = payload.request_id;
    await addItemsToUser(
      uid,
      itemId,
      institutionName,
      institutionId,
      accessToken,
      requestId,
      webhook,
    );
    res.status(200).send(institutionName);
  } catch (error) {
    console.log(error);
  }
};

exports.plaidWebHook = (req, res) => {
  const error = req.body.error;
  const itemId = req.body.item_id;
  const newTransactions = req.body.new_transactions;
  const webHookCode = req.body.webhook_code;
  const webHookType = req.body.webhook_type;


  console.log(req.body);
  res.status(200).send(`webhook hit w/ ${req.body}`);
};

const deleteIndividualItem = async (itemId, uid) => {
  try {
    const accessToken = await getAccessToken(uid, itemId);
    const plaidDeletionStatus = await plaidClient.deleteItem(accessToken);
    const nonExistentToken = plaidDeletionStatus.error_code === 'INVALID_ACCESS_TOKEN';
    if (plaidDeletionStatus.deleted || nonExistentToken) {
      await deleteItemFromDB(uid, itemId);
    }
  } catch (error) {
    console.log(error);
  }
};

exports.deleteAllItems = async (req, res) => {
  const uid = req.body.uid;
  let allItems;
  try {
    allItems = await getAllItems(uid);
  } catch (error) {
    console.log(error);
  }
  allItems.forEach(item => deleteIndividualItem(item.itemId, uid));
  const message1 = `deleted ${JSON.stringify(allItems)}`;
  const message2 = 'no items to delete';
  let messageToSend;
  if (allItems.length === 0) {
    messageToSend = message2;
  } else {
    messageToSend = message1;
  }

  res.status(200).send(messageToSend);
};

exports.deleteItem = async (req, res) => {
  const uid = req.body.uid;
  const itemId = req.body.itemId;
  try {
    await deleteIndividualItem(itemId, uid);
  } catch (error) {
    console.log(error);
  }
  res.status(200).send(`${itemId} deleted`);
};
