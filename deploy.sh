
if [ "$TRAVIS_BRANCH" == "master" -a $"$TRAVIS_PULL_REQUEST" == "false" ]; 
then
  echo "$TRAVIS_BRANCH"
  ./node_modules/.bin/firebase deploy -P --token $FIREBASE_FUNCTIONS_CONTAINER_TOKEN
  exit 0
else
  echo "Will only deploy if not a pull request and branch is either master or staging"
  exit 0
fi