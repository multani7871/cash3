import React, { Component } from 'react';
import PlaidLink from 'react-plaid-link';
import { logout } from '../helpers/auth';
import {
  deleteItemFromApp,
  handleDeleteUser,
  exchangePublicToken,
  deleteAllItems,
  populateUserItems,
  handleExistingAndNewUsers,
} from './api';

const appTokenKey = 'appToken';
export default class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      uid: localStorage.getItem(appTokenKey),
      userItems: [],
    };
    this.handleLogout = this.handleLogout.bind(this);
    this.handleOnSuccess = this.handleOnSuccess.bind(this);
    this.populateUserItems = populateUserItems.bind(this);
    this.deleteAllItems = deleteAllItems.bind(this);
    this.handleExistingAndNewUsers = handleExistingAndNewUsers.bind(this);
  }

  async componentDidMount() {
    try {
      await this.handleExistingAndNewUsers();
      await this.populateUserItems();
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

  async handleOnSuccess(token, metadata) {
    const uid = this.state.uid;
    const institution = metadata.institution;
    await exchangePublicToken(uid, token, institution);
    await this.populateUserItems();
  }

  render() {
    const uid = this.state.uid;

    return (
      <div>
        Logged in
        <button type="submit" onClick={this.handleLogout}>
          Logout
        </button>
        <button
          type="submit"
          onClick={async () => {
            try {
              await handleDeleteUser(uid);
              await this.handleLogout();
            } catch (error) {
              console.log(error);
            }
          }}
        >
          Delete User
        </button>
        <button
          type="submit"
          onClick={async () => {
            try {
              await deleteAllItems(uid);
              await this.populateUserItems();
            } catch (error) {
              console.log(error);
            }
          }}
        >
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
              <button
                type="submit"
                onClick={async () => {
                  try {
                    await deleteItemFromApp(uid, item.itemId);
                    await this.populateUserItems();
                  } catch (error) {
                    console.log(error);
                  }
                }}
              >
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
