const { google } = require('googleapis');
const { promisify } = require('util');
const creds = require('../helpers/credentials.json');

const oauth2Client = new google.auth.OAuth2(
  creds.client_id,
  creds.client_secret,
  creds.redirect_uris,
);

const calendar = google.calendar({ version: "v3", auth: oauth2Client });

const listEvents = async (oauthToken) => {
  oauth2Client.credentials = { access_token: oauthToken };
  const config = { calendarId: "primary", timeMin: new Date().toISOString(), maxResults: 10, singleEvents: true, orderBy: "startTime" };
  const listAsync = promisify(calendar.events.list).bind(calendar);
  try {
    const result = await listAsync(config);
    const events = result.data.items;
    if (events.length) {
      events.map((event, i) => {
        const start = event.start.dateTime || event.start.date;
        console.log(`${start} - ${event.summary}`);
      });
    }
  } catch (error) {
    console.log(error);
  }
}

const createCalendar = async (oauthToken) => {
  oauth2Client.credentials = { access_token: oauthToken };
  const insertAsync = promisify(calendar.calendars.insert).bind(calendar);
  const calConfig = {
    resource: { summary: 'Cashendar' },
  };
  try {
    const newCal = await insertAsync(calConfig);
    const calData = newCal.data;
    console.log(calData);
  } catch (error) {
    console.log(error.errors);
  }
}

 const deleteCalendar = async (oauthToken, calID) => {
  oauth2Client.credentials = { access_token: oauthToken };
  const deleteAsync = promisify(calendar.calendars.delete).bind(calendar);
  const calConfig = {
    calendarId: calID,
  };
  try {
    const newCal = await deleteAsync(calConfig);
    console.log(`${calID} deleted`);
  } catch (error) {
    console.log(error.errors[0]);
  }
}

module.exports = {
  listEvents,
  createCalendar,
  deleteCalendar,
};

