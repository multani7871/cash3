require("envkey");
const functions = require("firebase-functions");
const googleCalendar = require("./googleCalendar");
const { addNewCalendarToUser, addItemsToUser } = require("./firestore");
const plaidClient = require("./plaidClient");

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });

// const cors = require("cors")({
//   origin: true
// });

exports.createCalendar = functions.https.onRequest(async (req, res) => {
  const token = req.body.OAuthToken;
  const uid = req.body.uid;
  try {
    const result = await googleCalendar.createCalendar(token);
    const calendarID = result.id;
    const result2 = await addNewCalendarToUser(uid, calendarID);
    res.status(200).send(result2);
  } catch (error) {
    console.log(error);
  }
});

exports.deleteCalendar = functions.https.onRequest(async (req, res) => {
  const token = req.body.OAuthToken;
  const calID = req.body.calID;
  let result;
  try {
    result = await googleCalendar.deleteCalendar(token, calID);
    res.status(200).send(`${result} and ${calID} deleted`);
  } catch (error) {
    console.log(error);
  }
});

exports.exchangePublicToken = functions.https.onRequest(async (req, res) => {
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
exports.nonsense = functions.https.onRequest(async (req, res) => {
  const nonsense = () => {
    res.status(200).send("hey ya");
  };
  cors(req, res, nonsense);
});
