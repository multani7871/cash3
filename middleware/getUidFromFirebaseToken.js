const { verifyIdTokenAndReturnUid } = require('../controllers/auth');

exports.getUidFromFirebaseToken = async (req, res, next) => {
  if (req.body.idToken) {
    const idToken = req.body.idToken;
    try {
      req.body.uid = await verifyIdTokenAndReturnUid(idToken);
    } catch (error) {
      console.log(error);
    }
    return next();
  }
  return next();
};
