import { useHistory } from "react-router-dom";
import { useState } from "react";

import ApiClient from '../api.client.js';
import Page from './page.js';


const Widget = () => {

  const client = ApiClient();
  const history = useHistory();

  const LogIn = async (event) => {
    event.preventDefault();

    const username = event.target.username.value;
    const password = event.target.password.value;
    const response = await client.login(username, password);
    if (response.ok) {
    	history.push("/dashboard");
    }
  };

  if (client.isAuthenticated()) {
  	history.push("/dashboard");
  }

	return (
		<div className="card" id="login-widget">
      <div className="card-block">
          <h4 className="card-title">Log in</h4>
          <div className="card-text">
            <form method="post" id="login-form" onSubmit={LogIn}>
              <div className="form-group">
                <label for="username">Username</label>
                <input type="text" className="form-control" id="username" name="username" placeholder="Username" />
              </div>
              <div class="form-group">
                <label for="password">Password</label>
                <input type="password" className="form-control" id="password" name="password" placeholder="Password" />
              </div>
              <button id="login-button" type="submit" className="btn btn-primary">Submit</button>
            </form>
          </div>
      </div>
    </div>
  )

}

const LoginWidget = () => {

  return Page(Widget, 1);

}

export default LoginWidget;
