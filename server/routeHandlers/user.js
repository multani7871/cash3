const {
  createNewUser,
  doesUserExist,
  updateOAuthToken,
  getUserOAuthToken,
  getUserCalID,
  deleteUserFromDB
  // saveRefreshToken,
} = require("../controllers/firestore");

exports.createNewUser = async (req, res) => {
  const { uid, email, OAuthToken } = req.body;
  try {
    await createNewUser(uid, email, OAuthToken);
  } catch (error) {
    console.log(error);
  }
  res.status(200).send(`${email} created`);
};

exports.doesUserExist = async (req, res) => {
  const { uid } = req.body;
  let exists;
  try {
    exists = await doesUserExist(uid);
  } catch (error) {
    console.log(error);
  }
  res.status(200).send(`${exists}`);
};

exports.updateOAuthToken = async (req, res) => {
  const { uid, OAuthToken } = req.body;
  try {
    await updateOAuthToken(uid, OAuthToken);
  } catch (error) {
    console.log(error);
  }
  res.status(200).send();
};

exports.getUserOAuthToken = async (req, res) => {
  const { uid } = req.body;
  let OAuthToken;
  try {
    OAuthToken = await getUserOAuthToken(uid);
  } catch (error) {
    console.log(error);
  }
  res.status(200).send(OAuthToken);
};

exports.getUserCalID = async (req, res) => {
  const { uid } = req.body;
  let calID;
  try {
    calID = await getUserCalID(uid);
  } catch (error) {
    console.log(error);
  }
  res.status(200).send(calID);
};

exports.deleteUserFromDB = async (req, res) => {
  const { uid } = req.body;
  try {
    await deleteUserFromDB(uid);
  } catch (error) {
    console.log(error);
  }
  res.status(200).send();
};

// exports.saveRefreshToken = async (req, res) => {
//   const uid = req.body.uid;
//   const refreshToken = req.body.refreshToken;
//   try {
//     await saveRefreshToken(uid, refreshToken);
//   } catch (error) {
//     console.log(error);
//   }
//   res.status(200).send();
// };
