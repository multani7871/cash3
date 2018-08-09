1. Install EnvKey from https://www.envkey.com/ on dev machine
1. Get provisioned in EnvKey by HM
1. run from root 'npm getEnvKey'
1. run from root 'npm install'
1. run from functions 'npm install'
1. run from root 'npm run start'
1. run from functions 'npm run serve'


Todos:
1. setup CI/CD via google flow - just from master
1. Wipe repo and start over using readme directions to verify another user can set it up
1. Implement plaid transaction backend using webhooks 
1. ci/cd flow from staging
1. Move db methods to backend?
1. fix eslint warnings on npm i for client and functions
1. Implement docker compose
  1. for client:  docker run -it \
  -v ${PWD}:/usr/src/app \  -v /usr/src/app/node_modules \
  -p 3000:3000 \
  --rm \
  cashendar/frontend
  1. for server: docker run-it \  -v ${PWD}:/usr/src/app \
  -v /usr/src/app/node_modules \
  -p 5000:5000 \
  --rm \
  cashendar/functions
1. stash cloudbuild.yml for next pr.
1. refactor backend to express app so can use CORS middleware
1. make firebase tools a dev dependency for backend
1. 