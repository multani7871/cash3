const express = require('express');
const path = require('path');
const cors = require('cors')({
  origin: true,
});

const router = express.Router();
const morgan = require('morgan');
const { getUidFromFirebaseToken } = require('./middleware/getUidFromFirebaseToken');

const { createCalendar, deleteCalendar } = require('./routes/calendar');
const {
  exchangePublicToken,
  plaidWebHook,
  deleteAllItems,
  deleteItem,
  getAllItemsClient,
} = require('./routes/plaid');
const {
  createNewUser,
  doesUserExist,
  updateOAuthToken,
  getUserOAuthToken,
  getUserCalID,
  deleteUserFromDB,
  // saveRefreshToken,
} = require('./routes/user');

router.use(cors);
router.use(express.static(path.join(__dirname, 'client/build')));
router.use(express.json());
router.use(morgan(':url :status'));
router.use(getUidFromFirebaseToken);
router.post('/api/getAllItemsClient', getAllItemsClient);

router.post('/api/deleteCalendar', deleteCalendar);
router.post('/api/createCalendar', createCalendar);
router.post('/api/exchangePublicToken', exchangePublicToken);
router.post('/api/plaidWebHook', plaidWebHook);
router.post('/api/deleteAllItems', deleteAllItems);
router.post('/api/deleteItem', deleteItem);
router.post('/api/createNewUser', createNewUser);
router.post('/api/doesUserExist', doesUserExist);
router.post('/api/getAllItemsClient', getAllItemsClient);
router.post('/api/updateOAuthToken', updateOAuthToken);
router.post('/api/getUserOAuthToken', getUserOAuthToken);
router.post('/api/getUserCalID', getUserCalID);
router.post('/api/deleteUserFromDB', deleteUserFromDB);
// router.post('/api/saveRefreshToken', saveRefreshToken);

router.get('*', (req, res) => {
  res.sendFile(path.join(`${__dirname}/client/build/index.html`));
});

module.exports = router;
