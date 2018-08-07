import { db } from "./firebaseClient";

export function createNewUser(uid, email, OAuthToken) {
  db.collection("users")
    .doc(uid)
    .set({
      email: email,
      OAuthToken: OAuthToken
    })
    .then(console.log("user created"))
    .catch(error => console.log(error));
}

export function updateOAuthToken(uid, OAuthToken) {
  db.collection("users")
    .doc(uid)
    .update({
      OAuthToken: OAuthToken
    })
    .catch(error => console.log(error));
}

export async function doesUserExist(uid) {
  try {
    let user = await db.collection("users").doc(uid).get();
    if (user.exists) {
      return true;
    } else {
      return false;
    }
  } catch (error) {
    console.log(error);
  }
}

export function deleteUserFromDB(uid) {
  db.collection("users")
    .doc(uid)
    .delete()
    .then(console.log("user deleted"))
    .catch(error => console.log(error));
}

export function getUserOAuthToken(uid) {
  return db
    .collection("users")
    .doc(uid)
    .get()
    .then(function(doc) {
      return doc.data().OAuthToken;
    })
    .catch(error => console.log(error));
}

export function addNewCalendarToUser(uid, calendarID) {
  db.collection("users")
    .doc(uid)
    .update({
      calendarID: calendarID
    })
    .catch(error => console.log(error));
}

export function getUserCalID(uid) {
  return db
    .collection("users")
    .doc(uid)
    .get()
    .then(function(doc) {
      return doc.data().calendarID;
    })
    .catch(error => console.log(error));
}