import React, { Component } from 'react';
import { loginWithGoogle, onAuthStateChanged } from '../controllers/auth';
// import { saveRefreshToken } from './api';

const firebaseAuthKey = 'firebaseAuthInProgress';
const idToken = 'idToken';

export default class Login extends Component {
  constructor(props) {
    super(props);
    // this.state = { splashScreen: false };
    this.handleGoogleLogin = this.handleGoogleLogin.bind(this);
  }

  componentWillMount() {
    // checks if we are logged in, if we are go to the home route
    if (localStorage.getItem(idToken)) {
      this.props.history.push('/app/home');
      return;
    }
    onAuthStateChanged(async (user) => {
      if (user) {
        // const refreshToken = user.refreshToken;
        const idToken1 = await user.getIdToken();
        // await saveRefreshToken(uid, refreshToken);
        localStorage.removeItem(firebaseAuthKey);
        localStorage.setItem(idToken, idToken1);
        this.props.history.push('/app/home');
      }
    });
  }

  handleGoogleLogin() {
    loginWithGoogle().catch((err) => {
      console.log(err);
      localStorage.removeItem(firebaseAuthKey);
    });
    // this will set the splashscreen until its overridden by the real firebaseAuthKey
    localStorage.setItem(firebaseAuthKey, '1');
  }

  render() {
    if (localStorage.getItem(firebaseAuthKey) === '1') {
      return <Splashscreen />;
    }
    return <LoginPage handleGoogleLogin={this.handleGoogleLogin} />;
  }
}
const LoginPage = ({ handleGoogleLogin }) => (
  <div className="login-container">
    <button type="submit" onClick={handleGoogleLogin}>
Login
    </button>
  </div>
);
const Splashscreen = () => (
  <p>
Please Wait Loading...
  </p>
);
