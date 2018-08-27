const { firebaseAuth } = require('../apiClients/firebaseClient');

exports.verifyIdTokenAndReturnUid = async (idToken) => {
  let uid;
  try {
    const decodedToken = await firebaseAuth.verifyIdToken(idToken);
    uid = decodedToken.uid;
  } catch (error) {
    console.log(error);
  }
  return uid;
};
