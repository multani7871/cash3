const googleCalendar = require('../clients/googleClient');
const { addNewCalendarToUser } = require('../clients/firestore');

exports.createCalendar = async (req, res) => {
  if (req.body === undefined) {
    res.status(200).send('no stuff');
    return;
  }
  try {
    const token = req.body.OAuthToken;
    const uid = req.body.uid;
    const result = await googleCalendar.createCalendar(token);
    const calendarID = result.id;
    const result2 = await addNewCalendarToUser(uid, calendarID);
    res.status(200).send(result2);
  } catch (error) {
    console.log(error);
  }
};

exports.deleteCalendar = async (req, res) => {
  const token = req.body.OAuthToken;
  const calID = req.body.calID;
  if (!calID) {
    res.status(200).send(`${calID} not found`);
  }
  let result;
  try {
    result = await googleCalendar.deleteCalendar(token, calID);
    res.status(200).send(`${result} and ${calID} deleted`);
  } catch (error) {
    console.log(error);
  }
};
