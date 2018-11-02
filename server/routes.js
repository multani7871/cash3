const express = require('express');
const path = require('path');
const cors = require('cors')({
  origin: true,
});

const router = express.Router();
const morgan = require('morgan');
const { getUidFromFirebaseToken } = require('./middleware/getUidFromFirebaseToken');

const { createCalendar, deleteCalendar } = require('./routeHandlers/calendar');
const {
  exchangePublicToken,
  plaidWebHook,
  deleteAllItems,
  deleteItem,
  getAllItemsClient,
} = require('./routeHandlers/plaid');
const {
  createNewUser,
  doesUserExist,
  updateOAuthToken,
  getUserOAuthToken,
  getUserCalID,
  deleteUserFromDB,
  // saveRefreshToken,
} = require('./routeHandlers/user');

router.use(cors);
router.use(express.static(path.join(__dirname, 'client/build')));
router.use(express.json());
router.use(morgan(':url :status'));
router.use(getUidFromFirebaseToken);

router.post('/getAllItemsClient', getAllItemsClient);
router.post('/deleteCalendar', deleteCalendar);
router.post('/createCalendar', createCalendar);
router.post('/exchangePublicToken', exchangePublicToken);
router.post('/plaidWebHook', plaidWebHook);
router.post('/deleteAllItems', deleteAllItems);
router.post('/deleteItem', deleteItem);
router.post('/createNewUser', createNewUser);
router.post('/doesUserExist', doesUserExist);
router.post('/getAllItemsClient', getAllItemsClient);
router.post('/updateOAuthToken', updateOAuthToken);
router.post('/getUserOAuthToken', getUserOAuthToken);
router.post('/getUserCalID', getUserCalID);
router.post('/deleteUserFromDB', deleteUserFromDB);
// router.post('/api/saveRefreshToken', saveRefreshToken);

router.get('*', (req, res) => {
  res.sendFile(path.join(`${__dirname}/client/build/index.html`));
});

module.exports = router;
