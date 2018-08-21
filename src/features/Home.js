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

const idToken = 'idToken';
export default class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userItems: [],
      idToken: localStorage.getItem(idToken),
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
      await localStorage.removeItem(idToken);
      await this.props.history.push('/login');
    } catch (error) {
      console.log(error);
    }
  }

  async handleOnSuccess(token, metadata) {
    const idToken = this.state.idToken;
    const institution = metadata.institution;
    try {
      await exchangePublicToken(idToken, token, institution);
      await this.populateUserItems();
    } catch (error) {
      console.log(error);
    }
  }

  render() {
    const idToken = this.state.idToken;
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
              await handleDeleteUser(idToken);
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
              await deleteAllItems(idToken);
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
                    await deleteItemFromApp(idToken, item.itemId);
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
