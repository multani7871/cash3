const firebase = require("firebase/app");
require("firebase/auth");
require("firebase/firestore");
const creds = require("./credentials.json");

const config = {
  apiKey: creds.APIKEY,
  authDomain: creds.AUTHDOMAIN, 
  databaseURL: creds.DATABASEURL,
  projectId: creds.PROJECTID
};
firebase.initializeApp(config);
const googleProvider = new firebase.auth.GoogleAuthProvider();
googleProvider.addScope('https://www.googleapis.com/auth/calendar');
const firestore = firebase.firestore();
firestore.settings({ timestampsInSnapshots: true });
const firebaseAuth = firebase.auth;
const db = firestore

module.exports = {
  googleProvider,
  firebaseAuth,
  db
}