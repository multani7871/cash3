const plaid = require("plaid");

const {
  PLAID_CLIENT_ID,
  PLAID_SECRET,
  PLAID_PUBLIC_KEY,
  PLAID_ENV
} = require("./credentials.json");

const plaidClient = new plaid.Client(
  PLAID_CLIENT_ID,
  PLAID_SECRET,
  PLAID_PUBLIC_KEY,
  PLAID_ENV,
  {
    version: "2018-05-22"
  }
);
module.exports = plaidClient;
