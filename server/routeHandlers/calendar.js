const { createCalendar, deleteAllCalendars } = require('../controllers/googleCalendar');
const { addNewCalendarToUser } = require('../controllers/firestore');

exports.createCalendar = async (req, res) => {
  const oauthToken = req.body.OAuthToken;
  const uid = req.body.uid;
  try {
    const result = await createCalendar(oauthToken);
    const calendarID = result.id;
    const result2 = await addNewCalendarToUser(uid, calendarID);
    res.status(200).send(result2);
  } catch (error) {
    console.log(error);
  }
};

exports.deleteCalendar = async (req, res) => {
  const oauthToken = req.body.OAuthToken;
  const calID = req.body.calID;
  if (!calID) {
    res.status(200).send(`${calID} not found`);
  }
  let result;
  try {
    result = await deleteAllCalendars(oauthToken, calID);
    res.status(200).send(`${result} and ${calID} deleted`);
  } catch (error) {
    console.log(error);
  }
};
