const { verifyIdTokenAndReturnUid } = require('../clients/auth');

exports.getUidFromFirebaseToken = async (req, res, next) => {
  if (req.body.idToken) {
    const idToken = req.body.idToken;
    const uid = await verifyIdTokenAndReturnUid(idToken);
    req.body.uid = uid;
    return next();
  }
  return next();
};
