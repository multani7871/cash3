const { google } = require("googleapis");
const { promisify } = require("util");

const oauth2Client = new google.auth.OAuth2(
  process.env.CLIENT_ID,
  process.env.CLIENT_SECRET,
  process.env.REDIRECT_URIS
);

const calendar = google.calendar({ version: "v3", auth: oauth2Client });

// exports.listEvents = async (oauthToken) => {
//   oauth2Client.credentials = { access_token: oauthToken };
//   const config = { calendarId: "primary", timeMin: new Date().toISOString(), maxResults: 10, singleEvents: true, orderBy: "startTime" };
//   const listAsync = promisify(calendar.events.list).bind(calendar);
//   try {
//     const result = await listAsync(config);
//     const events = result.data.items;
//     if (events.length) {
//       events.map((event, i) => {
//         const start = event.start.dateTime || event.start.date;
//         console.log(`${start} - ${event.summary}`);
//       });
//     }
//   } catch (error) {
//     console.log(error);
//   }
// }

exports.createCalendar = async oauthToken => {
  oauth2Client.credentials = { access_token: oauthToken };
  const insertAsync = promisify(calendar.calendars.insert).bind(calendar);
  const calConfig = {
    resource: { summary: "Cashendar" }
  };
  try {
    const newCal = await insertAsync(calConfig);
    const calData = newCal.data;
    return calData;
  } catch (error) {
    console.log(error.errors);
  }
};

exports.deleteCalendar = async (oauthToken, calID) => {
  oauth2Client.credentials = { access_token: oauthToken };
  const deleteAsync = promisify(calendar.calendars.delete).bind(calendar);
  const calConfig = {
    calendarId: calID
  };
  try {
    const newCal = await deleteAsync(calConfig);
    const calData = newCal.data;
    return `${calID} + ${calData} deleted`;
  } catch (error) {
    console.log(error);
  }
};

// export {
//   createCalendar,
//   deleteCalendar,
//   listEvents
// }

// exports.listEvents = listEvents;
