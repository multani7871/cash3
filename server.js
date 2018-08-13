require('envkey');
const express = require('express');
const cors = require('cors')({
  origin: true,
});
const path = require('path');
const morgan = require('morgan');
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

const app = express();

app.use(morgan(':method :url :status'));
app.use(express.static(path.join(__dirname, 'build')));
app.use(cors);
app.use(express.json());

app.post('/api/deleteCalendar', deleteCalendar);
app.post('/api/createCalendar', createCalendar);
app.post('/api/exchangePublicToken', exchangePublicToken);
app.post('/api/plaidWebHook', plaidWebHook);
app.post('/api/deleteAllItems', deleteAllItems);
app.post('/api/deleteItem', deleteItem);
app.post('/api/createNewUser', createNewUser);
app.post('/api/doesUserExist', doesUserExist);
app.post('/api/getAllItemsClient', getAllItemsClient);
app.post('/api/updateOAuthToken', updateOAuthToken);
app.post('/api/getUserOAuthToken', getUserOAuthToken);
app.post('/api/getUserCalID', getUserCalID);
app.post('/api/deleteUserFromDB', deleteUserFromDB);
// app.post('/api/saveRefreshToken', saveRefreshToken);


app.get('*', (req, res) => {
  res.sendFile(path.join(`${__dirname}/build/index.html`));
});

const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Example app listening on ${port}!`));
