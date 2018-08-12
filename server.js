require('envkey');
const express = require('express');
const cors = require('cors')({
  origin: true,
});
const path = require('path');
const morgan = require('morgan');
const { createCalendar, deleteCalendar } = require('./routes/calendar');
const {
  exchangePublicToken, plaidWebHook, deleteAllItems, deleteItem,
} = require('./routes/plaid');

const app = express();

app.use(morgan('tiny'));
app.use(express.static(path.join(__dirname, 'build')));
app.use(cors);
app.use(express.json());

app.post('/api/deleteCalendar', deleteCalendar);
app.post('/api/createCalendar', createCalendar);
app.post('/api/exchangePublicToken', exchangePublicToken);
app.post('/api/plaidWebHook', plaidWebHook);
app.post('/api/deleteAllItems', deleteAllItems);
app.post('/api/deleteItem', deleteItem);

app.get('*', (req, res) => {
  res.sendFile(path.join(`${__dirname}/build/index.html`));
});

const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Example app listening on ${port}!`));
