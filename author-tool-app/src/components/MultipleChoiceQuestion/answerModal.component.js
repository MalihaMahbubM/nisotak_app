import React, { Component } from "react";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import APIInterface from "./APIInterface";
import { unauthorizedErrorMessage } from "../Utils/authorization";
import MediaSection from "../Utils/Media/media.component";
import Audio from "../Utils/Audio/audio.component";

export default class AnswerModal extends Component {
  constructor(props) {
    super(props);

    this.onClickSaveAnswer = this.onClickSaveAnswer.bind(this);
    this.setAudioState = this.setAudioState.bind(this);
    this.downloadAudio = this.downloadAudio.bind(this);
    this.deleteAudio = this.deleteAudio.bind(this);

    this.state = {
      audioObjectState: undefined,
      saveButtonText: "Save file",
      errorMessage: "",
    };
  }

  setAudioState = (newAudioObjectState) => {
    this.setState({
      audioObjectState: newAudioObjectState,
      errorMessage: "",
    });
  };

  async downloadAudio() {
    let response = await APIInterface.downloadAudio({
      question_id: this.props.question_id,
      option_id: this.props.answerObject._id,
    });
    return response;
  }

  async deleteAudio() {
    let response = await APIInterface.deleteAudio({
      question_id: this.props.question_id,
      option_id: this.props.answerObject._id,
    });
    if (response.errorStatus === undefined) {
      this.props.updateOptionsCallback(this.props.id, response.data);
    }
    return response;
  }

  async onClickSaveAnswer() {
    if (this.state.audioObjectState === undefined) {
      this.setState({
        saveButtonText: "Save file",
        errorMessage: "A valid file must be selected.",
      });
      return;
    }

    this.setState({
      saveButtonText: "Saving...",
      errorMessage: "",
    });

    let updateOptionObject = {
      option: this.props.answerObject,
      question_id: this.props.question_id,
      audioFile: this.state.audioObjectState.audioFile,
    };
    updateOptionObject.option.audio = this.state.audioObjectState;

    let updateResult = await APIInterface.updateAnswerOption(
      updateOptionObject
    );

    if (updateResult.errorStatus === undefined) {
      this.setState({
        saveButtonText: "Save file",
        errorMessage: "",
      });
      this.props.updateOptionsCallback(this.props.id, updateResult.data);
      this.props.closeModalCallback();
    } else {
      if (updateResult.errorStatus === 401) {
        this.setState({
          errorMessage: unauthorizedErrorMessage,
          saveButtonText: "Save File (Login first)",
        });
        window.open("/login", "_blank");
      } else {
        this.setState({
          errorMessage: updateResult.errorMessage,
          saveButtonText: "Save file",
        });
      }
    }
  }

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
            <Modal.Title>Answer {this.props.answerLetter}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Audio
                onChangeAudioFile={this.setAudioState}
                downloadAudioAPICall={this.downloadAudio}
                deleteAudioAPICall={this.deleteAudio}
                reloadPageAfterDelete={false}
                elementId={this.props.question_id}>
              {this.props.answerObject.audio}
            </Audio>
            <label style={{ color: "red" }}>{this.state.errorMessage}</label>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="dark" onClick={this.onClickSaveAnswer}>
              {this.state.saveButtonText}
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
