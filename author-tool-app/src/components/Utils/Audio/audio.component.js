import React, { Component } from "react";

import {
  UploadFileSection,
  ShowCurrentFile,
  AudioOptions,
} from "./uploadAudioSections.component";
import download from "downloadjs";
import { unauthorizedErrorMessage } from "../authorization";

export default class Audio extends Component {
  constructor(props) {
    super(props);

    this.onChangeAudio = this.onChangeAudio.bind(this);
    this.onClickDownloadAudio = this.onClickDownloadAudio.bind(this);
    this.onClickUploadFile = this.onClickUploadFile.bind(this);
    this.onClickDeleteFile = this.onClickDeleteFile.bind(this);

    this.state = {
      fileErrorFeedbackMessage: "",
      showUploadNewFile: false,
      downloadAudioButtonText: "Download",
      deleteAudioButtonText: "Delete",
    };
  }

  onChangeAudio = (e) => {
    this.setState({ showUploadNewFile: true, fileErrorFeedbackMessage: "" });
    if (e.target.files[0] === undefined) return;

    if (e.target.files[0].size <= 10000000) {
      let newAudioObjectState = {
        audioFile: e.target.files[0],
        audio: {
          file_id: undefined,
          file_path: "",
          file_name: e.target.files[0].name,
        },
        fileErrorFeedbackMessage: "",
      };

      if (this.props.children !== undefined) {
        newAudioObjectState.audio.file_id = this.props.children.file_id;
        newAudioObjectState.audio.file_path = this.props.children.file_path;
      }
      this.props.onChangeAudioFile(newAudioObjectState);
    } else {
      this.setState({
        fileErrorFeedbackMessage:
          "Error: The file is too big (maximum size allowed: 10MB).",
      });
    }
  };

  hasAFileUploaded(audioObj) {
    if (audioObj === undefined) return false;
    return audioObj.file_id !== undefined;
  }

  async onClickDownloadAudio() {
    var originalFileName = this.props.children.file_name;
    this.setState({
      downloadAudioButtonText: "Downloading...",
      fileErrorFeedbackMessage: "",
    });

    let response = await this.props.downloadAudioAPICall();

    if (response.errorStatus === undefined) {
      const mp3 = new Blob([response.data], { type: "audio/mpeg" });
      download(mp3, originalFileName, "audio/mpeg");
    } else {
      if (response.errorStatus === 401) {
        this.setState({
          fileErrorFeedbackMessage: unauthorizedErrorMessage,
        });
        window.open("/login", "_blank");
      } else {
        this.setState({
          fileErrorFeedbackMessage:
            "Error: Download failed. Please, refresh the page and try again.",
        });
      }
    }

    this.setState({
      downloadAudioButtonText: "Download",
    });
  }

  onClickUploadFile = (e) => {
    this.setState({
      showUploadNewFile: true,
    });
  };

  async onClickDeleteFile() {
    this.setState({
      deleteAudioButtonText: "Deleting...",
      fileErrorFeedbackMessage: "",
    });
    let response = await this.props.deleteAudioAPICall();

    if (response.errorStatus === undefined) {
      if (this.props.reloadPageAfterDelete === false) return;

      window.location.reload(false);
    } else {
      if (response.errorStatus === 401) {
        this.setState({
          fileErrorFeedbackMessage: unauthorizedErrorMessage,
        });
        window.open("/login", "_blank");
      } else {
        this.setState({
          fileErrorFeedbackMessage:
            "Error: Couldn't delete file. Please, refresh the page and try again.",
        });
      }
    }

    this.setState({
      deleteAudioButtonText: "Delete",
    });
  }

  render() {
    const noAudioObjectProvided = this.props.children === undefined;

    return (
      <>
        <div className="form-group">
          <label className="font-weight-bold">Audio </label>
          <ShowCurrentFile>{this.props.children}</ShowCurrentFile>
          <AudioOptions
            onClickDownload={this.onClickDownloadAudio}
            downloadButtonText={this.state.downloadAudioButtonText}
            onclickUploadFile={this.onClickUploadFile}
            uploadFileButtonText="Replace"
            onClickDeleteFile={this.onClickDeleteFile}
            deleteButtonText={this.state.deleteAudioButtonText}
            showOptions={this.hasAFileUploaded(this.props.children)}
          >
            {this.props.children}
          </AudioOptions>
          <UploadFileSection
            onChangeFunction={this.onChangeAudio}
            hide={noAudioObjectProvided ? false : !this.state.showUploadNewFile}
          ></UploadFileSection>
          <label style={{ color: "red" }}>
            {this.state.fileErrorFeedbackMessage}
          </label>
        </div>
      </>
    );
  }
}
