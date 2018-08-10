require('envkey');
const express = require('express');
const cors = require('cors')({
  origin: true,
});
const path = require('path');
const googleCalendar = require('./googleClient');
const { addNewCalendarToUser, addItemsToUser } = require('./firestore');
const plaidClient = require('./plaidClient');

const app = express();
app.use(express.static(path.join(__dirname, 'build')));
app.use(cors);
app.use(express.json());

const createCalendar = async (req, res) => {
  if (req.body === undefined) {
    res.status(200).send('no stuff');
    return;
  }
  try {
    const token = req.body.OAuthToken;
    const uid = req.body.uid;
    const result = await googleCalendar.createCalendar(token);
    const calendarID = result.id;
    const result2 = await addNewCalendarToUser(uid, calendarID);
    res.status(200).send(result2);
  } catch (error) {
    console.log(error);
  }
};

const deleteCalendar = async (req, res) => {
  const token = req.body.OAuthToken;
  const calID = req.body.calID;
  if (!calID) {
    res.status(200).send(`${calID} not found`);
  }
  let result;
  try {
    result = await googleCalendar.deleteCalendar(token, calID);
    res.status(200).send(`${result} and ${calID} deleted`);
  } catch (error) {
    console.log(error);
  }
};

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

app.post('/api/deleteCalendar', deleteCalendar);
app.post('/api/createCalendar', createCalendar);
app.post('/api/exchangePublicToken', exchangePublicToken);
app.post('/api/plaidWebHookDev', plaidWebHookDev);

app.get('*', (req, res) => {
  res.sendFile(path.join(`${__dirname}/build/index.html`));
});

app.listen(process.env.PORT || 5000, () => console.log(`Example app listening on ${process.env.PORT}!`));
