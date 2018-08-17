const { firebaseAuth } = require('./firebaseClient');

exports.verifyIdTokenAndReturnUid = async (idToken) => {
  let decodedToken;
  let uid;
  try {
    decodedToken = await firebaseAuth.verifyIdToken(idToken);
    uid = decodedToken.uid;
  } catch (error) {
    console.log(error);
  }
  return uid;
};
