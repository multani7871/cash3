const { google } = require('googleapis');

const oauth2Client = new google.auth.OAuth2(
  process.env.CLIENT_ID,
  process.env.CLIENT_SECRET,
  process.env.REDIRECT_URIS,
);

const calendar = google.calendar({ version: 'v3', auth: oauth2Client });

module.exports = {
  oauth2Client,
  calendar,
};

// todo: find way to eliminate need to export oauth2Client
// ideally controllers would not be aware of the oAuth2 client, might be able to do a wrapper function of some kind
