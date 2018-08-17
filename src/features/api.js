import axios from 'axios';
import { deleteUserFromAuth, getIdToken, getRedirectResult } from '../helpers/auth';

export async function createNewUserAndCalendar(idToken, email, OAuthToken) {
  try {
    await axios.post('/api/createNewUser', {
      idToken,
      email,
      OAuthToken,
    });
    await axios.post('/api/createCalendar', {
      OAuthToken,
      idToken,
    });
  } catch (error) {
    console.log(error);
  }
}

export async function handleExistingAndNewUsers() {
  const idToken = this.state.idToken;
  const result = await getRedirectResult();
  if (result.credential) {
    // This gives you a Google Access` Token. You can use it to access the Google API.
    // const idToken = result.credential.idToken;
    const email = result.user.email;
    const OAuthToken = result.credential.accessToken;
    const response = await axios.post('/api/doesUserExist', {
      idToken,
    });
    const exists = response.data;
    if (exists) {
      await axios.post('/api/updateOAuthToken', {
        idToken,
        OAuthToken,
      });
    } else {
      await createNewUserAndCalendar(idToken, email, OAuthToken);
    }
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

export async function deleteItemFromApp(idToken, itemId) {
  try {
    await axios.post('/api/deleteItem', {
      idToken,
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

export async function exchangePublicToken(idToken, publicToken, institution) {
  const config = {
    url: '/api/exchangePublicToken',
    payload: {
      publicToken,
      idToken,
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
  const idToken = this.state.idToken;
  let request;
  try {
    request = await axios.post('/api/getAllItemsClient', {
      idToken,
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
