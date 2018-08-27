1. Install EnvKey from https://www.envkey.com/ on dev machine
1. Get provisioned in EnvKey by HM
1. Get developer key fron EnvKey
1. Initialize .env file and Add developer key to .env as per .env.example
1. run `docker-compose up` from repo root directory


Todos:
1. Update docker config to reflect change from firebase functions to server backend
1. Create staging branch
1. delete all orphan calendars cleanup script
1. Implement batched reads and writes
1. fix firebase token login issue
1. remove itemIDs from frontend

Resources
1. https://plaid.com/docs/api/
1. https://firebase.google.com/docs/firestore/