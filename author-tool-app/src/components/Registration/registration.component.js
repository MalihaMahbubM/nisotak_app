import React, { Component } from "react";
import APIInterface from "./APIInterface";
import "./registration.style.css";

export default class Registration extends Component {
  constructor(props) {
    super(props);

    this.onChangeUsername = this.onChangeUsername.bind(this);
    this.onChangeEmail = this.onChangeEmail.bind(this);
    this.onChangePassword = this.onChangePassword.bind(this);
    this.onClickLoginPage = this.onClickLoginPage.bind(this);
    this.onSubmit = this.onSubmit.bind(this);

    this.state = {
      email: "",
      username: "",
      password: "",
      passwordsMatch: false,
      passwordMatchError: "",
      submitButtonText: "Register",
      errorMessage: "",
      successMessage: "",
      accountCreated: false,
    };
  }

  onChangeEmail = (e) => {
    this.setState({ email: e.target.value });
  };

  onChangeUsername = (e) => {
    this.setState({
      username: e.target.value,
    });
  };

  onChangePassword = (e) => {
    this.setState({
      password: e.target.value,
    });
  };

  onChangeVerifyPassword = (e) => {
    if (this.state.password === e.target.value) {
      this.setState({
        passwordMatchError: "",
        passwordsMatch: true,
      });
    } else {
      this.setState({
        passwordMatchError: "The passwords don't match.",
        passwordsMatch: false,
      });
    }
  };

  onClickLoginPage = () => {
    window.location = "/login";
  };

  async onSubmit() {
    this.setState({
      submitButtonText: "Please wait...",
      successMessage: "",
      errorMessage: "",
    });

    if (this.state.passwordsMatch) {
      let registrationResult = await APIInterface.registerUser({
        fullElement: this.state,
      });

      if (registrationResult.errorStatus === undefined) {
        this.setState({
          successMessage:
            "You account was created and it's now pending approval.",
          accountCreated: true,
          submitButtonText: "Done!",
        });
      } else {
        if (registrationResult.errorStatus === 403) {
          this.setState({
            errorMessage:
              "Registration failed. The email provided is already registered.",
            submitButtonText: "Register",
          });
        } else {
          console.log(registrationResult.errorStatus);
          this.setState({
            errorMessage: registrationResult.errorMessage,
            submitButtonText: "Register",
          });
        }
      }
    } else {
      this.setState({
        submitButtonText: "Register",
        errorMessage: "The passwords provided must match.",
      });
    }
  }

  render() {
    return (
      <div className="ml-3 mr-4">
        <h3 className="mb-4">Create Account</h3>

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
          <label className="font-weight-bold">Username</label>
          <input
            type="text"
            required
            className="form-control col-md-4"
            placeholder={this.state.username}
            value={this.state.username}
            onChange={this.onChangeUsername}
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
        <div className="form-group ">
          <label className="font-weight-bold">Verify Password</label>
          <input
            name="verifyPassword"
            type="password"
            required
            className="form-control col-md-4"
            placeholder={this.state.verifyPassword}
            value={this.state.verifyPassword}
            onChange={this.onChangeVerifyPassword}
          />
          <label style={{ color: "red" }}>
            {this.state.passwordMatchError}
          </label>
        </div>
        <div className="form-group">
          <button
            className="btn btn-dark"
            onClick={this.onSubmit}
            disabled={this.state.accountCreated}
          >
            {this.state.submitButtonText}
          </button>
          <button
            className="btn btn-dark loginButton"
            onClick={this.onClickLoginPage}
          >
            {"Login"}
          </button>
        </div>
        <label style={{ color: "blue", fontWeight: "bold" }}>
          {this.state.successMessage}
        </label>
        <label style={{ color: "red" }}>{this.state.errorMessage}</label>
      </div>
    );
  }
}
