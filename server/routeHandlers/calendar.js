const {
  createCalendar,
  deleteAllCalendars
} = require("../controllers/googleCalendar");
const { addNewCalendarToUser } = require("../controllers/firestore");

exports.createCalendar = async (req, res) => {
  const { uid, OAuthToken } = req.body;
  try {
    const result = await createCalendar(OAuthToken);
    const calendarID = result.id;
    const result2 = await addNewCalendarToUser(uid, calendarID);
    res.status(200).send(result2);
  } catch (error) {
    console.log(error);
  }
};

exports.deleteCalendar = async (req, res) => {
  const { calID, OAuthToken } = req.body;
  if (!calID) {
    res.status(200).send(`${calID} not found`);
  }
  let result;
  try {
    result = await deleteAllCalendars(OAuthToken, calID);
    res.status(200).send(`${result} and ${calID} deleted`);
  } catch (error) {
    console.log(error);
  }
};
