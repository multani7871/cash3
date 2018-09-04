const moment = require("moment");
const { plaidClient } = require("../apiClients/plaidClient");
const {
  addItemsToUser,
  getAllItems,
  deleteItemFromDB,
  getAccessToken,
  getAllItemsClient,
  addAccountToItem,
  addATransactionToItem,
  // updateItemAccounts,
  deleteAllAccountsForAnItem,
  // deleteItemAccount,
  deleteAllTransactionsForAnItem
} = require("../controllers/firestore");

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
      webhook
    );
    res.status(200).send(institutionName);
  } catch (error) {
    console.log(error);
  }
};

const handleInitialUpdate = async itemId => {
  try {
    const now = moment();
    const today = now.format("YYYY-MM-DD");
    const thirtyDaysAgo = now.subtract(30, "days").format("YYYY-MM-DD");
    const accessToken = await getAccessToken(itemId);
    const plaidResponse = await plaidClient.getTransactions(
      accessToken,
      thirtyDaysAgo,
      today
    );
    const accounts = plaidResponse.accounts;
    const transactions = plaidResponse.transactions;
    const transactionsToAdd = transactions.map(async transaction => {
      try {
        await addATransactionToItem(itemId, transaction);
      } catch (error) {
        console.log(error);
      }
    });

    const accountsToAdd = accounts.map(async account => {
      try {
        await addAccountToItem(itemId, account);
      } catch (error) {
        console.log(error);
      }
    });
    await Promise.all([transactionsToAdd, accountsToAdd]);
  } catch (error) {
    console.log(error);
  }
};

exports.plaidWebHook = async (req, res) => {
  const plaidError = req.body.error;
  const itemId = req.body.item_id;
  const newTransactions = req.body.new_transactions;
  const webHookCode = req.body.webhook_code;
  const webHookType = req.body.webhook_type;

  if (!webHookCode) {
    console.log('no webhook code provided')
  }

  if (webHookCode === "INITIAL_UPDATE") {
    try {
      await handleInitialUpdate(itemId);
    } catch (error) {
      console.log(error);
    }
  }

  if (webHookCode === "HISTORICAL_UPDATE") {
    console.log("historical webhook");
    // todo: update accounts
    // todo: update transactions
  }

  if (webHookCode === "DEFAULT_UPDATE") {
    console.log("default webhook");
  }

  if (webHookCode === "TRANSACTIONS_REMOVED") {
    console.log("txns removed webhook");
  }

  res.status(200).json("req.body");
};

const deleteIndividualItem = async (itemId, uid) => {
  try {
    const accessToken = await getAccessToken(itemId);
    const plaidDeletionStatus = await plaidClient.deleteItem(accessToken);
    const nonExistentToken =
      plaidDeletionStatus.error_code === "INVALID_ACCESS_TOKEN";
    if (plaidDeletionStatus.deleted || nonExistentToken) {
      try {
        await Promise.all([
          deleteAllTransactionsForAnItem(itemId),
          deleteAllAccountsForAnItem(itemId)
        ]);
        await deleteItemFromDB(uid, itemId);
      } catch (error) {
        console.log(error);
      }
    }
  } catch (error) {
    console.log(error);
  }
};

const deleteAllItemsHandler = async uid => {
  let allItems;
  try {
    allItems = await getAllItems(uid);
    const deletionStatus = allItems.map(async item =>
      deleteIndividualItem(item.itemId, uid)
    );
    await Promise.all(deletionStatus);
  } catch (error) {
    console.log(error);
  }
};

exports.deleteAllItems = async (req, res) => {
  const uid = req.body.uid;
  try {
    await deleteAllItemsHandler(uid);
  } catch (error) {
    console.log(error);
  }
  res.status(200).send();
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

exports.getAllItemsClient = async (req, res) => {
  const uid = req.body.uid;
  let itemIDs;
  try {
    itemIDs = await getAllItemsClient(uid);
  } catch (error) {
    console.log(error);
  }
  res.status(200).json(itemIDs);
};
