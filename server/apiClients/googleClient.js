const { google } = require("googleapis");
const oauth2Client = new google.auth.OAuth2(
  process.env.CLIENT_ID,
  process.env.CLIENT_SECRET,
  process.env.REDIRECT_URIS
);

const calendar = oauthToken => {
  oauth2Client.credentials = { access_token: oauthToken };
  return google.calendar({ version: "v3", auth: oauth2Client });
};

module.exports = {
  calendar
};
