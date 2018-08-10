const { db } = require("./firebaseClient");

// exports.createNewUser = (uid, email, OAuthToken) => {
//   db.collection("users")
//     .doc(uid)
//     .set({
//       email: email,
//       OAuthToken: OAuthToken
//     })
//     .then(console.log("user created"))
//     .catch(error => console.log(error));
// };

// exports.updateOAuthToken = (uid, OAuthToken) => {
//   db.collection("users")
//     .doc(uid)
//     .update({
//       OAuthToken: OAuthToken
//     })
//     .catch(error => console.log(error));
// };

// exports.doesUserExist = uid => {
//   return db
//     .collection("users")
//     .doc(uid)
//     .get()
//     .then(function(user) {
//       if (user.exists) {
//         return true;
//       } else {
//         return false;
//       }
//     })
//     .catch(error => console.log(error));
// };

// exports.deleteUserFromDB = uid => {
//   db.collection("users")
//     .doc(uid)
//     .delete()
//     .then(console.log("user deleted"))
//     .catch(error => console.log(error));
// };

// exports.getUserOAuthToken = uid => {
//   return db
//     .collection("users")
//     .doc(uid)
//     .get()
//     .then(function(doc) {
//       return doc.data().OAuthToken;
//     })
//     .catch(error => console.log(error));
// };

exports.addNewCalendarToUser = (uid, calendarID) => {
  db.collection("users")
    .doc(uid)
    .update({
      calendarID: calendarID
    })
    .catch(error => console.log(error));
};

// exports.getUserCalID = uid => {
//   return db
//     .collection("users")
//     .doc(uid)
//     .get()
//     .then(function(doc) {
//       return doc.data().calendarID;
//     })
//     .catch(error => console.log(error));
// };

exports.addItemsToUser = (
  uid,
  itemId,
  institutionName,
  institutionId,
  accesstoken,
  requestId,
  webhook
) => {
  return db
    .collection("users")
    .doc(uid)
    .collection("items")
    .doc(itemId)
    .set({
      institutionName: institutionName,
      institutionId: institutionId,
      accessToken: accesstoken,
      requestId: requestId,
      webhook: webhook
    });
};
