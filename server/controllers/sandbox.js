const { promisify } = require("util");
const { calendar } = require("../apiClients/googleClient");

const createAllDayEvent = async (oauthToken, calID) => {
  const allDayEventInsertAsync = promisify(
    calendar(oauthToken).events.insert
  ).bind(calendar(oauthToken));

  const event = {
    summary: `test`,
    description: `desc`,
    colorId: "4",
    start: {
      dateTime: "2018-08-18",
      timeZone: "America/Los_Angeles"
    },
    end: {
      dateTime: "2018-08-18",
      timeZone: "America/Los_Angeles"
    }
  };

  const config = {
    calendarId: calID,
    resource: event
  };

  try {
    await allDayEventInsertAsync(config);
  } catch (error) {
    console.log(error);
  }
};


// createAllDayEvent(token, calID);
