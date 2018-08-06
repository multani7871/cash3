import React, { Component } from "react";
import { logout, deleteUser, getRedirectResult } from "../helpers/auth";
import {
  createNewUser,
  deleteUserFromDB,
  doesUserExist,
  updateOAuthToken,
  getUserOAuthToken,
  getUserCalID
} from "../helpers/firestore";
import axios from "axios";
import PlaidLink from "react-plaid-link";
import { PLAID_PUBLIC_KEY, PLAID_ENVIRONMENT, WEBHOOK_HOST } from "../helpers/credentials.json";

const appTokenKey = "appToken";
export default class Home extends Component {
  constructor(props) {
    super(props);
    this.state = { uid: localStorage.getItem(appTokenKey) };
    this.handleLogout = this.handleLogout.bind(this);
    this.handleDeleteUser = this.handleDeleteUser.bind(this);
    this.handleOAuthToken = this.handleOAuthToken.bind(this);
    this.handleOnSuccess = this.handleOnSuccess.bind(this);
    this.exchangePublicToken = this.exchangePublicToken.bind(this);
  }

  componentDidMount() {
    this.handleOAuthToken();
  }

  async handleOAuthToken() {
    try {
      let result = await getRedirectResult();
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
          await axios.post("/createCalendar", {
            OAuthToken: OAuthToken,
            uid: uid
          });
        }
      }
    } catch (error) {
      console.log(error);
    }
  }

  async handleLogout() {
    await logout();
    await localStorage.removeItem(appTokenKey);
    await this.props.history.push("/login");
  }

  async handleDeleteUser() {
    try {
      const uid = localStorage.getItem(appTokenKey);
      const OAuthToken = await getUserOAuthToken(uid);
      const calID = await getUserCalID(uid);
      await axios.post("/deleteCalendar", {
        OAuthToken: OAuthToken,
        calID: calID
      });
      await Promise.all([
        deleteUserFromDB(localStorage.getItem(appTokenKey)),
        deleteUser()
      ]);
      localStorage.removeItem(appTokenKey);
      this.props.history.push("/login");
      console.log("user deleted from firebase");
    } catch (error) {
      console.log(error);
    }
  }

  async handleOnSuccess(token, metadata) {
    const institution = metadata.institution;
    this.exchangePublicToken(token, institution);
  }

  async exchangePublicToken(publicToken, institution) {
    const uid = localStorage.getItem(appTokenKey);
    const config = {
      url: `/exchangePublicToken`,
      payload: {
        publicToken,
        uid: uid,
        institution,
        webhook: `${WEBHOOK_HOST}plaidWebHook`
      },
    };
    axios.post(config.url, config.payload)
      .then(response => console.log(response.data))
      .catch((error) => { console.log(error); });
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
        <PlaidLink
          clientName="cashendar"
          env={PLAID_ENVIRONMENT}
          publicKey={PLAID_PUBLIC_KEY}
          product={["auth", "transactions"]}
          onSuccess={this.handleOnSuccess}
        >
          Connect bank
        </PlaidLink>
      </div>
    );
  }
}
