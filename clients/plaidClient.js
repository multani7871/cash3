const plaid = require('plaid');

const plaidClient = new plaid.Client(
  process.env.PLAID_CLIENT_ID,
  process.env.PLAID_SECRET,
  process.env.REACT_APP_PLAID_PUBLIC_KEY,
  process.env.PLAID_ENV,
  {
    version: '2018-05-22',
  },
);
module.exports = plaidClient;
