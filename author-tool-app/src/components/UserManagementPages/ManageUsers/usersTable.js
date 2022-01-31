import React, { Component } from "react";
import APIInterface from "./APIInterface";
import ConfirmDelete from "../../Utils/confirmDelete.component";

export default class UsersTable extends Component {
  constructor(props) {
    super(props);

    this.onClickMakeAuthor = this.onClickMakeAuthor.bind(this);
    this.onClickMakeEditor = this.onClickMakeEditor.bind(this);
    this.onClickMakeAdmin = this.onClickMakeAdmin.bind(this);
    this.onClickDeleteUser = this.onClickDeleteUser.bind(this);
    this.onConfirmDelete = this.onConfirmDelete.bind(this);
    this.closeDeleteConfirmationModal = this.closeDeleteConfirmationModal.bind(
      this
    );

    this.state = {
      emailToDelete: "",
      errorMessage: "",
      showModal: false,
    };
  }

  async onClickMakeAuthor(e) {
    let response = await APIInterface.updateRole(e.target.value, "author");
    if (response.errorStatus === undefined) {
      window.location = "/usersManagement";
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
      window.location = "/usersManagement";
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
      window.location = "/usersManagement";
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
      window.location = "/usersManagement";
    } else if (response.error === 401) {
      window.location = "/login";
    } else {
      this.setState({
        errorMessage: response.errorMessage,
      });
    }
  }

  onClickDeleteUser = (e) => {
    this.setState({
      showModal: true,
      emailToDelete: e.target.value,
    });
  };

  onConfirmDelete = async (email) => {
    this.setState({
      showModal: false,
      emailToDelete: "",
    });

    let response = await APIInterface.deleteUser(email);
    if (response.errorStatus === undefined) {
      window.location = "/usersManagement";
    } else if (response.error === 401) {
      window.location = "/login";
    } else {
      this.setState({
        errorMessage: response.errorMessage,
      });
    }
  };

  closeDeleteConfirmationModal = () => {
    this.setState({
      showModal: false,
      emailToDelete: "",
    });
  };

  render() {
    return (
      <div>
        <h5 className="font-weight-bold">Users Management</h5>

        <table className="table table-striped table-bordered mt-4 mb-4">
          <thead className="thead-dark">
            <tr>
              <th scope="col">E-mail</th>
              <th scope="col">Username</th>
              <th scope="col">Role</th>
              <th scope="col" width="500">
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
                    <label>{val.role}</label>
                  </td>
                  <td>
                    <button
                      className="btn btn-outline-dark"
                      id={idx}
                      value={val.email}
                      onClick={this.onClickMakeReader}
                    >
                      Assign API Reader
                    </button>
                    <button
                      className="btn btn-outline-dark ml-3"
                      id={idx}
                      value={val.email}
                      onClick={this.onClickMakeEditor}
                    >
                      Assign Editor
                    </button>
                    <button
                      className="btn btn-outline-dark ml-3"
                      id={idx}
                      value={val.email}
                      onClick={this.onClickMakeAuthor}
                    >
                      Assign Author
                    </button>
                    <button
                      className="btn btn-outline-dark mt-2"
                      id={idx}
                      value={val.email}
                      onClick={this.onClickMakeAdmin}
                    >
                      Assign Admin
                    </button>
                    <button
                      className="btn btn-outline-dark ml-3 mt-2"
                      id={idx}
                      value={val.email}
                      onClick={this.onClickDeleteUser}
                    >
                      Delete User
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        <ConfirmDelete
          id={this.state.emailToDelete}
          show={this.state.showModal}
          closeModalCallback={this.closeDeleteConfirmationModal}
          deleteFunction={this.onConfirmDelete}
        ></ConfirmDelete>
      </div>
    );
  }
}
