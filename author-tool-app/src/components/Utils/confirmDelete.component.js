import React, { Component } from "react";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";

export default class ConfirmDelete extends Component {
  constructor(props) {
    super(props);

    this.onTypeConfirmation = this.onTypeConfirmation.bind(this);
    this.onClickDelete = this.onClickDelete.bind(this);

    this.state = {
      confirmationInput: "",
      errorMessage: "",
    };
  }

  onTypeConfirmation = (e) => {
    this.setState({
      confirmationInput: e.target.value,
      errorMessage: "",
    });
  };

  onClickDelete = () => {
    if (this.state.confirmationInput.toLowerCase() === "yes") {
      this.setState({
        confirmationInput: "",
        errorMessage: "",
      });
      this.props.deleteFunction(this.props.id);
    } else {
      this.setState({
        errorMessage: "Type yes to confirm or click cancel.",
      });
    }
  };

  render() {
    return (
      <>
        <Modal
          show={this.props.show}
          onHide={this.props.closeModalCallback}
          backdrop="static"
          keyboard={false}
        >
          <Modal.Header closeButton>
            <Modal.Title>Delete confirmation</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <label>Are you sure you want to delete this item?</label>
            <label>Type yes below to confirm</label>
            <input
              type="text"
              required
              className="form-control"
              placeholder={this.state.confirmationInput}
              value={this.state.confirmationInput}
              onChange={this.onTypeConfirmation}
            />
            <label style={{ color: "red" }}>{this.state.errorMessage}</label>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="dark" onClick={this.onClickDelete}>
              Delete
            </Button>
            <Button variant="secondary" onClick={this.props.closeModalCallback}>
              Cancel
            </Button>
          </Modal.Footer>
        </Modal>
      </>
    );
  }
}
