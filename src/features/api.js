import axios from 'axios';
import { deleteUserFromAuth, getIdToken, getRedirectResult } from '../helpers/auth';

export async function createNewUserAndCalendar(uid, email, OAuthToken) {
  try {
    await axios.post('/api/createNewUser', {
      uid,
      email,
      OAuthToken,
    });
    await axios.post('/api/createCalendar', {
      OAuthToken,
      uid,
    });
  } catch (error) {
    console.log(error);
  }
}

export async function deleteUserFromApp(uid) {
  try {
    const [getUserOAuthTokenResult, calIDRequest] = await Promise.all([
      await axios.post('/api/getUserOAuthToken', {
        uid,
      }),
      await axios.post('/api/getUserCalID', {
        uid,
      }),
    ]);
    const OAuthToken = getUserOAuthTokenResult.data;
    const calID = calIDRequest.data;
    await axios.post('/api/deleteCalendar', {
      OAuthToken,
      calID,
    });
    await axios.post('/api/deleteUserFromDB', {
      uid,
    });
  } catch (error) {
    console.log(error);
  }
}

export async function deleteItemFromApp(uid, itemId) {
  try {
    await axios.post('/api/deleteItem', {
      uid,
      itemId,
    });
  } catch (error) {
    console.log(error);
  }
}

export async function handleDeleteUser(uid) {
  try {
    await getIdToken();
    await deleteUserFromApp(uid);
    await deleteUserFromAuth();
  } catch (error) {
    console.log(error);
  }
}

export async function exchangePublicToken(uid, publicToken, institution) {
  const config = {
    url: '/api/exchangePublicToken',
    payload: {
      publicToken,
      uid,
      institution,
      webhook: `${process.env.REACT_APP_WEBHOOK}`,
    },
  };
  try {
    await axios.post(config.url, config.payload);
  } catch (error) {
    console.log(error);
  }
}

export async function deleteAllItems(uid) {
  try {
    await axios.post('/api/deleteAllItems', {
      uid,
    });
  } catch (error) {
    console.log(error);
  }
}

export async function populateUserItems() {
  const uid = this.state.uid;
  let request;
  try {
    request = await axios.post('/api/getAllItemsClient', {
      uid,
    });
  } catch (error) {
    console.log(error);
  }
  const allItems = request.data;
  this.setState({ userItems: allItems });
}

// export async function saveRefreshToken(uid, refreshToken) {
//   await axios.post('/api/saveRefreshToken', {
//     uid,
//     refreshToken,
//   });
// }

export async function handleExistingAndNewUsers() {
  const uid = this.state.uid;
  const result = await getRedirectResult();
  if (result.credential) {
    // This gives you a Google Access` Token. You can use it to access the Google API.
    const email = result.user.email;
    const OAuthToken = result.credential.accessToken;

    const response = await axios.post('/api/doesUserExist', {
      uid,
    });
    const exists = response.data;
    if (exists) {
      await axios.post('/api/updateOAuthToken', {
        uid,
        OAuthToken,
      });
    } else {
      await createNewUserAndCalendar(uid, email, OAuthToken);
    }
  }
}
