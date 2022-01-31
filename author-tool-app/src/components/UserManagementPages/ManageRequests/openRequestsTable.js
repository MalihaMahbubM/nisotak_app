import React, { Component } from "react";
import APIInterface from "./APIInterface";

export default class OpenRequestsTable extends Component {
  constructor(props) {
    super(props);

    this.onClickMakeAuthor = this.onClickMakeAuthor.bind(this);
    this.onClickMakeEditor = this.onClickMakeEditor.bind(this);
    this.onClickMakeAdmin = this.onClickMakeAdmin.bind(this);
  }

  async onClickMakeAuthor(e) {
    let response = await APIInterface.updateRole(e.target.value, "author");
    if (response.errorStatus === undefined) {
      window.location = "/requestsManagement";
    } else if (response.error === 401) {
      window.location = "/login";
    } else {
      this.setState({
        errorMessage: response.errorMessage,
      });
    }
  }

  async onClickMakeEditor(e) {
    let response = await APIInterface.updateRole(e.target.value, "editor");
    if (response.errorStatus === undefined) {
      window.location = "/requestsManagement";
    } else if (response.error === 401) {
      window.location = "/login";
    } else {
      this.setState({
        errorMessage: response.errorMessage,
      });
    }
  }

  async onClickMakeReader(e) {
    let response = await APIInterface.updateRole(e.target.value, "ReadOnly");
    if (response.errorStatus === undefined) {
      window.location = "/requestsManagement";
    } else if (response.error === 401) {
      window.location = "/login";
    } else {
      this.setState({
        errorMessage: response.errorMessage,
      });
    }
  }

  async onClickMakeAdmin(e) {
    let response = await APIInterface.updateRole(e.target.value, "admin");
    if (response.errorStatus === undefined) {
      window.location = "/requestsManagement";
    } else if (response.error === 401) {
      window.location = "/login";
    } else {
      this.setState({
        errorMessage: response.errorMessage,
      });
    }
  }

  render() {
    return (
      <div>
        <h5 className="font-weight-bold">Access Requests</h5>

        <table className="table table-striped table-bordered mt-4 mb-4">
          <thead className="thead-dark">
            <tr>
              <th scope="col">E-mail</th>
              <th scope="col">Username</th>
              <th scope="col" width="400">
                Options
              </th>
            </tr>
          </thead>

          <tbody>
            {this.props.children.map((val, idx) => {
              return (
                <tr key={idx}>
                  <td>
                    <label>{val.email}</label>
                  </td>
                  <td>
                    <label>{val.username}</label>
                  </td>
                  <td>
                    <button
                      className="btn btn-outline-dark"
                      id={idx}
                      value={val.email}
                      onClick={this.onClickMakeReader}
                    >
                      Approve as API reader
                    </button>
                    <button
                      className="btn btn-outline-dark ml-3"
                      id={idx}
                      value={val.email}
                      onClick={this.onClickMakeEditor}
                    >
                      Approve as Editor
                    </button>
                    <button
                      className="btn btn-outline-dark mt-2"
                      id={idx}
                      value={val.email}
                      onClick={this.onClickMakeAuthor}
                    >
                      Approve as Author
                    </button>
                    <button
                      className="btn btn-outline-dark ml-3 mt-2"
                      id={idx}
                      value={val.email}
                      onClick={this.onClickMakeAdmin}
                    >
                      Approve as Admin
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    );
  }
}
