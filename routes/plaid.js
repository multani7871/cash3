const { addItemsToUser } = require('../clients/firestore');
const plaidClient = require('../clients/plaidClient');
const { getAllItems, deleteItemFromDB } = require('../clients/firestore');

const exchangePublicToken = async (req, res) => {
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

const plaidWebHookDev = (req, res) => {
  const payload = req.body;
  res.status(200).send(`webhook hit w/ ${payload}`);
};

const deleteAllItems = async (req, res) => {
  const uid = req.body.uid;
  // const uid = '5ImydqEWAlY3fSXNbh18GxVAdxl2';
  let allItems;
  try {
    allItems = await getAllItems(uid);
  } catch (error) {
    console.log(error);
  }

  const deleteIndividualItem = async (item) => {
    const itemId = item.itemId;
    try {
      const plaidDeletionStatus = await plaidClient.deleteItem(item.accessToken);
      if (plaidDeletionStatus.deleted) {
        console.log(plaidDeletionStatus);
        await deleteItemFromDB(uid, itemId);
      }
    } catch (error) {
      console.log(error);
    }
  };
  allItems.forEach(deleteIndividualItem);
  const message1 = `delete items for ${JSON.stringify(allItems)}`;
  const message2 = 'no items to delete';
  let messageToSend;
  if (allItems.length === 0) {
    messageToSend = message2;
  } else {
    messageToSend = message1;
  }

  res.status(200).send(messageToSend);
};

module.exports = {
  exchangePublicToken,
  plaidWebHookDev,
  deleteAllItems,
};
