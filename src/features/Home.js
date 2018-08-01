import React, { Component } from 'react';
import { logout , deleteUser, getRedirectResult } from '../helpers/auth';
import { createNewUser, deleteUserFromDB } from '../helpers/firestore';
const appTokenKey = "appToken";
export default class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {uid: localStorage.getItem(appTokenKey)};
    this.handleLogout = this.handleLogout.bind(this);
    this.handleDeleteUser = this.handleDeleteUser.bind(this);
    this.handleOAuthToken = this.handleOAuthToken.bind(this);
  }
  componentDidMount() {
    this.handleOAuthToken();
  }
  handleOAuthToken() {
    getRedirectResult()
     .then(function(result){
       if (result.credential) {
         // This gives you a Google Access Token. You can use it to access the Google API.
         const email = result.user.email;
         let uid = localStorage.getItem(appTokenKey)
         let OAuthToken = result.credential.accessToken;
         createNewUser(uid, email, OAuthToken);
       }
    })
  }
  handleLogout() {
    logout()
      .then(() => {
        localStorage.removeItem(appTokenKey);
        this.props.history.push("/login");
        console.log("user signed out from firebase");
      });
  }
  handleDeleteUser() {
    Promise.all([deleteUserFromDB(localStorage.getItem(appTokenKey)), deleteUser()])
      .then(() => {
        localStorage.removeItem(appTokenKey);
        this.props.history.push("/login");
        console.log("user deleted from firebase");
      });
  }
  render() {
    return (
      <div>
        Logged in 
            <button onClick={this.handleLogout}>Logout</button>
        <button onClick={this.handleDeleteUser}>Delete User</button>
      </div>
    );
  }
}