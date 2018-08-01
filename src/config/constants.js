import firebase from 'firebase/app';
import 'firebase/auth'; 
import 'firebase/firestore';


const config = {
  apiKey: process.env.REACT_APP_APIKEY,
  authDomain: process.env.REACT_APP_AUTHDOMAIN, 
  databaseURL: process.env.REACT_APP_DATABASEURL,
  projectId: process.env.REACT_APP_PROJECTID
};
firebase.initializeApp(config);
export const googleProvider = new firebase.auth.GoogleAuthProvider();
googleProvider.addScope('https://www.googleapis.com/auth/calendar');
const firestore = firebase.firestore();
firestore.settings({ timestampsInSnapshots: true });
export const firebaseAuth = firebase.auth;
export const db = firestore