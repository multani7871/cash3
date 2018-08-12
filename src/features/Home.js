import React, { Component } from 'react';
import axios from 'axios';
import PlaidLink from 'react-plaid-link';
import {
  logout, deleteUserFromAuth, getRedirectResult, reloadUser,
} from '../helpers/auth';
import {
  createNewUser,
  deleteUserFromDB,
  doesUserExist,
  updateOAuthToken,
  getUserOAuthToken,
  getUserCalID,
  getAllItems,
} from '../helpers/firestore';

const appTokenKey = 'appToken';
export default class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      uid: localStorage.getItem(appTokenKey),
      userItems: [],
    };
    this.handleLogout = this.handleLogout.bind(this);
    this.handleDeleteUser = this.handleDeleteUser.bind(this);
    this.handleOAuthToken = this.handleOAuthToken.bind(this);
    this.handleOnSuccess = this.handleOnSuccess.bind(this);
    this.exchangePublicToken = this.exchangePublicToken.bind(this);
    this.deleteAllItems = this.deleteAllItems.bind(this);
    this.deleteItem = this.deleteItem.bind(this);
    this.populateUserItems = this.populateUserItems.bind(this);
  }

  async componentDidMount() {
    this.handleOAuthToken();
    this.populateUserItems();
  }

  async populateUserItems() {
    const uid = this.state.uid;
    // todo: make getAllItems a call to server
    const allItems = await getAllItems(uid);
    this.setState({ userItems: allItems });
  }

  async handleOAuthToken() {
    try {
      const result = await getRedirectResult();
      if (result.credential) {
        // This gives you a Google Access` Token. You can use it to access the Google API.
        const email = result.user.email;
        const uid = localStorage.getItem(appTokenKey);
        const OAuthToken = result.credential.accessToken;
        const exists = await doesUserExist(uid);
        if (exists) {
          await updateOAuthToken(uid, OAuthToken);
        } else {
          await createNewUser(uid, email, OAuthToken);
          await axios.post('/api/createCalendar', {
            OAuthToken,
            uid,
          });
        }
      }
    } catch (error) {
      console.log(error);
    }
  }

  async handleLogout() {
    try {
      await logout();
      await localStorage.removeItem(appTokenKey);
      await this.props.history.push('/login');
    } catch (error) {
      console.log(error);
    }
  }

  async handleDeleteUser() {
    try {
      await reloadUser();
      const uid = localStorage.getItem(appTokenKey);
      const OAuthToken = await getUserOAuthToken(uid);
      const calID = await getUserCalID(uid);
      await axios.post('/api/deleteCalendar', {
        OAuthToken,
        calID,
      });
      await deleteUserFromDB(localStorage.getItem(appTokenKey));
      await deleteUserFromAuth();
      this.handleLogout();
    } catch (error) {
      console.log(error);
    }
  }

  async handleOnSuccess(token, metadata) {
    const institution = metadata.institution;
    await this.exchangePublicToken(token, institution);
    await this.populateUserItems();
  }

  async exchangePublicToken(publicToken, institution) {
    const uid = this.state.uid;
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

  async deleteAllItems(itemId) {
    const uid = this.state.uid;
    try {
      const deleteResult = await axios.post('/api/deleteAllItems', {
        uid,
        itemId,
      });
      console.log(deleteResult.data);
      await this.populateUserItems();
    } catch (error) {
      console.log(error);
    }
  }

  async deleteItem(itemId) {
    const uid = this.state.uid;
    try {
      const deleteResult = await axios.post('/api/deleteItem', {
        uid,
        itemId,
      });
      console.log(deleteResult.data);
    } catch (error) {
      console.log(error);
    }
    await this.populateUserItems();
  }

  render() {
    return (
      <div>
        Logged in
        <button type="submit" onClick={this.handleLogout}>
          Logout
        </button>
        <button type="submit" onClick={this.handleDeleteUser}>
          Delete User
        </button>
        <button type="submit" onClick={this.deleteAllItems}>
          Delete all items
        </button>
        <PlaidLink
          clientName="cashendar"
          env={process.env.REACT_APP_PLAID_ENVIRONMENT}
          publicKey={process.env.REACT_APP_PLAID_PUBLIC_KEY}
          product={['transactions']}
          onSuccess={this.handleOnSuccess}
          webhook={process.env.REACT_APP_WEBHOOK}
        >
          Connect bank
        </PlaidLink>
        <div>
          <br />
          environment:
          {' '}
          {process.env.REACT_APP_ENV}
          <br />
          webhook:
          {' '}
          {process.env.REACT_APP_WEBHOOK}
        </div>
        <ul>
          {this.state.userItems.map(item => (
            <li key={item.itemId}>
              <button type="submit" onClick={() => this.deleteItem(item.itemId)}>
                Delete
                {' '}
                {item.institutionName}
              </button>
            </li>
          ))}
        </ul>
      </div>
    );
  }
}
