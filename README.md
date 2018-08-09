1. Install EnvKey from https://www.envkey.com/ on dev machine
1. Get provisioned in EnvKey by HM
1. Get developer key fron EnvKey
1. Initialize .env file and Add developer key to .env as per .env.example
1. Get the Firebase container token from EnvKey and save to the .env file
1. run `docker-compose up` from repo root directory


Todos:
1. setup CI/CD via google flow - just from master
1. Wipe repo and start over using readme directions to verify another user can set it up
1. Implement plaid transaction backend using webhooks 
1. ci/cd flow from staging
1. Move db methods to backend?
1. fix eslint warnings on npm i for client and functions
1. refactor backend to express app so can use CORS middleware
1. make firebase tools a dev dependency for backend