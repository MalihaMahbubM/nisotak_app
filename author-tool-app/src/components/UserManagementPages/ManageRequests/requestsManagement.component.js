import React, { Component } from "react";
import OpenRequestsTable from "./openRequestsTable";
import APIInterface from "./APIInterface";
import { unauthorizedAccessToPage } from "../../Utils/authorization";
import LoadingSpinner from "../../Utils/LoadingSpinner";

export default class ResquestsManagement extends Component {
  constructor(props) {
    super(props);

    this.state = {
      requests: [],
      errorMessage: "",
      showLoading: true,
    };
  }

  async componentDidMount() {
    let requests = await APIInterface.getElement();

    if (requests.errorStatus === undefined) {
      this.setState({
        requests: requests,
        showLoading:false,
      });
    } else if (requests.errorStatus === 401) {
      window.location = "/login";
    } else if (requests.errorStatus === 403) {
      this.setState({
        errorMessage: unauthorizedAccessToPage,
        showLoading:false
      });
    } else {
      this.setState({
        errorMessage: requests.errorMessage,
        showLoading:false
      });
    }
  }

  render() {
    return (
      <div className="ml-3 mr-4">
        {this.state.showLoading && <LoadingSpinner top={'50%'} left={'50%'}/>}

        {!this.state.showLoading &&
        <div>
          <OpenRequestsTable updateStateFunction={this.updateMorphemes}>
            {this.state.requests}
          </OpenRequestsTable>
        </div>
        }
      </div>
    );
  }
}
