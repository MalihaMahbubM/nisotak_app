import React, { Component } from "react";
import APIInterface from "./APIInterface";
import "./login.style.css";

export default class Login extends Component {
  constructor(props) {
    super(props);

    this.onChangeEmail = this.onChangeEmail.bind(this);
    this.onChangePassword = this.onChangePassword.bind(this);
    this.onSubmit = this.onSubmit.bind(this);

    this.state = {
      email: "",
      password: "",
      submitButtonText: "Login",
      errorMessage: "",
    };
  }

  onChangeEmail = (e) => {
    this.setState({ email: e.target.value });
  };

  onChangePassword = (e) => {
    this.setState({
      password: e.target.value,
    });
  };

  onClickRegister = () => {
    window.location = "/register";
  };

  async onSubmit() {
    this.setState({
      submitButtonText: "Please wait...",
      errorMessage: "",
    });

    let loginResult = await APIInterface.login({
      fullElement: this.state,
    });
    console.log(`errorMessage: ${loginResult.errorMessage}`);
    if (loginResult.errorStatus === undefined) {
      if (loginResult.data.user_role === "ReadOnly") {
        this.setState({
          errorMessage:
            "Your account is authorized to read from the API only. If you want to login to the platform, please contact the administrator to change your access policy.",
          submitButtonText: "Login",
        });
      } else {
        localStorage.setItem("access_token", loginResult.data.access_token);
        localStorage.setItem("user_role", loginResult.data.user_role);
        window.location = "/";
      }
    } else if (loginResult.errorStatus === 403) {
      this.setState({
        errorMessage:
          "Your account is still pending approval. Please, come back later.",
        submitButtonText: "Login",
      });
    } else {
      this.setState({
        errorMessage: loginResult.errorMessage,
        submitButtonText: "Login",
      });
    }
  }

  render() {
    return (
      <div className="ml-3 mr-4">
        <h3 className="mb-4">Login</h3>

        <div className="form-group ">
          <label className="font-weight-bold">Email</label>
          <input
            type="text"
            required
            className="form-control col-md-4"
            placeholder={this.state.email}
            value={this.state.email}
            onChange={this.onChangeEmail}
          />
        </div>
        <div className="form-group ">
          <label className="font-weight-bold">Password</label>
          <input
            name="password"
            type="password"
            required
            className="form-control col-md-4"
            placeholder={this.state.password}
            value={this.state.password}
            onChange={this.onChangePassword}
          />
        </div>
        <div className="form-group">
          <button className="btn btn-dark" onClick={this.onSubmit}>
            {this.state.submitButtonText}
          </button>
          <button
            className="btn btn-dark registerButton"
            onClick={this.onClickRegister}
          >
            {"Register"}
          </button>
        </div>
        <label style={{ color: "red" }}>{this.state.errorMessage}</label>
      </div>
    );
  }
}
