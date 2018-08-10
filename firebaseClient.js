const firebase = require('firebase/app');
require('firebase/auth');
require('firebase/firestore');

const config = {
  apiKey: process.env.REACT_APP_APIKEY,
  authDomain: process.env.REACT_APP_AUTHDOMAIN,
  databaseURL: process.env.REACT_APP_DATABASEURL,
  projectId: process.env.REACT_APP_PROJECTID,
};

firebase.initializeApp(config);
const googleProvider = new firebase.auth.GoogleAuthProvider();
googleProvider.addScope('https://www.googleapis.com/auth/calendar');
const firestore = firebase.firestore();
firestore.settings({ timestampsInSnapshots: true });
const firebaseAuth = firebase.auth;
const db = firestore;

module.exports = {
  googleProvider,
  firebaseAuth,
  db,
};
