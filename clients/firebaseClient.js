const admin = require('firebase-admin');

const config = {
  apiKey: process.env.REACT_APP_APIKEY,
  authDomain: process.env.REACT_APP_AUTHDOMAIN,
  databaseURL: process.env.REACT_APP_DATABASEURL,
  projectId: process.env.REACT_APP_PROJECTID,
};
admin.initializeApp(config);
const firebaseAuth = admin.auth();
const firestore = admin.firestore();
firestore.settings({ timestampsInSnapshots: true });
const db = firestore;
module.exports = {
  firebaseAuth,
  db,
};
