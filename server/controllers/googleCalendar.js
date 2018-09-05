const { promisify } = require('util');
const { oauth2Client, calendar } = require('../apiClients/googleClient');

exports.createCalendar = async (oauthToken) => {
  oauth2Client.credentials = { access_token: oauthToken };
  const insertAsync = promisify(calendar.calendars.insert).bind(calendar);
  const calConfig = {
    resource: { summary: 'Cashendar' },
  };
  let calData;
  try {
    const newCal = await insertAsync(calConfig);
    calData = newCal.data;
  } catch (error) {
    console.log(error.errors);
  }
  return calData;
};

const getAllCashendarCalendars = async (oauthToken) => {
  oauth2Client.credentials = { access_token: oauthToken };
  const getAllCalendarsList = promisify(calendar.calendarList.list).bind(calendar);
  let cashendarCalendars;
  try {
    let allCalendars = await getAllCalendarsList();
    allCalendars = allCalendars.data.items;
    const isCalendarNameCashendar = cal => cal.summary === 'Cashendar';
    cashendarCalendars = allCalendars.filter(isCalendarNameCashendar);
  } catch (error) {
    console.log(error);
  }
  return cashendarCalendars;
};

const deleteCalendar = async (oauthToken, calID) => {
  oauth2Client.credentials = { access_token: oauthToken };
  const deleteAsync = promisify(calendar.calendars.delete).bind(calendar);
  const calConfig = {
    calendarId: calID,
  };
  try {
    await deleteAsync(calConfig);
  } catch (error) {
    console.log(error);
  }
};

const deleteOrphanCalendars = async (oauthToken) => {
  let orphanCalendars;
  try {
    orphanCalendars = await getAllCashendarCalendars(oauthToken);
  } catch (error) {
    console.log(error);
  }
  if (orphanCalendars.length > 0) {
    try {
      const asyncCalendarDeletionRequests = orphanCalendars.map(async (cal) => {
        try {
          await deleteCalendar(oauthToken, cal.id);
        } catch (error) {
          console.log(error);
        }
      });
      await Promise.all(asyncCalendarDeletionRequests);
    } catch (error) {
      console.log(error);
    }
  }
};

exports.deleteAllCalendars = async (oauthToken, calID) => {
  oauth2Client.credentials = { access_token: oauthToken };
  try {
    await deleteCalendar(oauthToken, calID);
    await deleteOrphanCalendars(oauthToken);
  } catch (error) {
    console.log(error);
  }
  return `${calID} deleted`;
};
