Getting started

1. Install EnvKey from https://www.envkey.com/ on dev machine
1. Get provisioned in EnvKey by HM
1. Get developer key fron EnvKey
1. Initialize .env file and Add developer key to .env as per .env.example in both root and client folders.
1. run `gem install ultrahook` from terminal in any directory

For development:

1. run `docker-compose up` from repo root directory
1. run `npm run webhook` from repo root directory in separate terminal window.


Resources
1. https://plaid.com/docs/api/
1. https://firebase.google.com/docs/firestore/
1. http://www.ultrahook.com/

Todo
create a single all day event for fixed day -TDD
Move user admin panel to own component
deploy container to heroku
create single all day event when an item is linked
Show the accounts in the event
handle account updates
show the balances in the event
handle balance updates
show transactions in the event
Handle initial update transactions
handle historical transactions
handle transaction updates
transactions sorted from largest to smallest