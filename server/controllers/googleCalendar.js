const { promisify } = require("util");
const { calendar } = require("../apiClients/googleClient");

exports.createCalendar = async oauthToken => {
  const insertAsync = promisify(calendar(oauthToken).calendars.insert).bind(
    calendar(oauthToken)
  );
  const calConfig = {
    resource: { summary: "Cashendar" }
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

const getAllCashendarCalendars = async oauthToken => {
  const getAllCalendarsList = promisify(
    calendar(oauthToken).calendarList.list
  ).bind(calendar(oauthToken));
  let cashendarCalendars;
  try {
    let allCalendars = await getAllCalendarsList();
    allCalendars = allCalendars.data.items;
    const isCalendarNameCashendar = cal => cal.summary === "Cashendar";
    cashendarCalendars = allCalendars.filter(isCalendarNameCashendar);
  } catch (error) {
    console.log(error);
  }
  return cashendarCalendars;
};

const deleteCalendar = async (oauthToken, calID) => {
  const deleteAsync = promisify(calendar(oauthToken).calendars.delete).bind(
    calendar(oauthToken)
  );
  const calConfig = {
    calendarId: calID
  };
  try {
    await deleteAsync(calConfig);
  } catch (error) {
    console.log(error);
  }
};

const deleteOrphanCalendars = async oauthToken => {
  let orphanCalendars;
  try {
    orphanCalendars = await getAllCashendarCalendars(oauthToken);
  } catch (error) {
    console.log(error);
  }
  if (orphanCalendars.length > 0) {
    try {
      const asyncCalendarDeletionRequests = orphanCalendars.map(async cal => {
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
  try {
    await deleteCalendar(oauthToken, calID);
    //is deleteCalendar redundant here?
    await deleteOrphanCalendars(oauthToken);
  } catch (error) {
    console.log(error);
  }
  return `${calID} deleted`;
};

// const createAllDayEvent = async (oauthToken, calID) => {
//   const allDayEventInsertAsync = promisify(
//     calendar(oauthToken).events.insert
//   ).bind(calendar(oauthToken));

//   const event = {
//     summary: `test`,
//     description: `desc`,
//     colorId: "4",
//     start: {
//       dateTime: "2018-09-17T18:25:00.000-00:00",
//       timeZone: "America/Los_Angeles"
//     },
//     end: {
//       dateTime: "2018-09-18T18:25:00.000-00:00",
//       timeZone: "America/Los_Angeles"
//     }
//   };

//   const config = {
//     calendarId: calID,
//     resource: event
//   };

//   try {
//     const result = await allDayEventInsertAsync(config);
//     console.log(result.data);
//   } catch (error) {
//     console.log(error);
//   }
// };
