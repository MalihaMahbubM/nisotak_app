import React, { Component } from "react";

import {
  UploadFileSection,
  ShowCurrentFile,
  FileOptions,
} from "./uploadMediaSections.component";
import download from "downloadjs";
import { unauthorizedErrorMessage } from "../authorization";

let previewUrls = new WeakMap();

let blobUrl = (blob) => {
  if (previewUrls.has(blob)) {
    return previewUrls.get(blob);
  } else {
    let url = URL.createObjectURL(blob);
    previewUrls.set(blob, url);
    return url;
  }
};

const isImageFile = (fileExtension) => {
  const supportedImageTypes = ["jpeg", "png", "jpg", "image/png", "image/jpeg"];

  return fileExtension
    ? supportedImageTypes.includes(fileExtension.toLowerCase())
    : false;
};

const isAudioFile = (fileExtension) => {
  const supportedAudioTypes = ["mp3",'audio/mpeg'];

  return fileExtension
      ? supportedAudioTypes.includes(fileExtension.toLowerCase())
      : false;
};


const imagePreviewStyle = {
  maxHeight: "200px",
  maxWidth: "300px",
  marginTop: "10px",
};

export default class MediaSection extends Component {
  constructor(props) {
    super(props);

    this.onChangeFile = this.onChangeFile.bind(this);
    this.onClickDownloadFile = this.onClickDownloadFile.bind(this);
    this.onClickUploadFile = this.onClickUploadFile.bind(this);
    this.onClickDeleteFile = this.onClickDeleteFile.bind(this);
    this.getMimeTypeFromFileName = this.getMimeTypeFromFileName.bind(this);
    this.loadImagePreview = this.loadImagePreview.bind(this);

    this.state = {
      fileErrorFeedbackMessage: "",
      showUploadNewFile: false,
      downloadFileButtonText: "Download",
      deleteFileButtonText: "Delete",
      imageFilePreview: null,
      audioFilePreview: null,
      isLoadingImagePreview: false,
      isLoadingAudioPreview: false,
      audioPreviewOriginalFileName: "",
      audioPreviewMimeType: "",
      imagePreviewOriginalFileName: "",
      imagePreviewMimeType: "",
    };
  }

  onChangeFile = (e) => {
    this.setState({ showUploadNewFile: true, fileErrorFeedbackMessage: "" });
    if (e.target.files[0] === undefined) return;

    if (e.target.files[0].size <= 10000000) {
      let nameSplit = e.target.files[0].name.split(".");
      let fileExtension = nameSplit.pop();
      if (this.props.allowedType.includes(fileExtension.toLowerCase())) {
        let newMediaObjectState = {
          mediaFile: e.target.files[0],
          media: {
            file_id: undefined,
            file_path: "",
            file_name: e.target.files[0].name,
          },
          fileErrorFeedbackMessage: "",
        };

        if (isImageFile(fileExtension)) {
          this.setState({
            imageFilePreview: newMediaObjectState.mediaFile,
          });
        } else if (isAudioFile(fileExtension)){
          this.setState({
            audioFilePreview: newMediaObjectState.mediaFile
          })
        }

        if (this.props.children !== undefined) {
          newMediaObjectState.media.file_id = this.props.children.file_id;
          newMediaObjectState.media.file_path = this.props.children.file_path;
        }
        this.props.onChangeFile(newMediaObjectState);
      } else {
        this.setState({
          fileErrorFeedbackMessage: "Error: File type not allowed.",
        });
      }
    } else {
      this.setState({
        fileErrorFeedbackMessage:
          "Error: The file is too big (maximum size allowed: 10MB).",
      });
    }
  };

  hasAFileUploaded(mediaObj) {
    if (mediaObj === undefined) return false;
    return mediaObj.file_id !== undefined;
  }

  getMimeTypeFromFileName(file_name) {
    let nameSplit = file_name.split(".");
    let fileExtension = nameSplit.pop();
    let mimeType = 'none';
    if (fileExtension === "mp3") {
      mimeType = "audio/mpeg";
    } else if (fileExtension === "png") {
      mimeType = "image/png";
    } else if (fileExtension === "jpg") {
      mimeType = "image/jpeg";
    }
    return mimeType;
  }

  async loadAudioPreview(){
    var originalFileName = this.props.children.file_name;
    let downloadMimeType = this.getMimeTypeFromFileName(originalFileName);

    this.setState({
      downloadFileButtonText: "Loading...",
      fileErrorFeedbackMessage: "",
      isLoadingAudioPreview: true,
      audioPreviewOriginalFileName: originalFileName,
      audioPreviewMimeType: downloadMimeType,
    });

    let response = await this.props.downloadMediaAPICall();

    if (response.errorStatus === undefined) {
      let downloadMimeType = this.getMimeTypeFromFileName(originalFileName);
      const media = new Blob([response.data], { type: downloadMimeType });

      this.setState({
        audioFilePreview: media,
      });
    } else {
      if (response.errorStatus === 401) {
        this.setState({
          fileErrorFeedbackMessage: unauthorizedErrorMessage,
        });
        window.open("/login", "_blank");
      } else {
        console.error(`Failed to download Audio: ${JSON.stringify(response.errorStatus)}`)
        this.setState({
          fileErrorFeedbackMessage:
              "Error: Download failed. Please, refresh the page and try again.",
        });
      }
    }
    this.setState({
      downloadFileButtonText: "Download",
    });
  }

  async loadImagePreview() {
    var originalFileName = this.props.children.file_name;
    let downloadMimeType = this.getMimeTypeFromFileName(originalFileName);

    this.setState({
      downloadFileButtonText: "Loading...",
      fileErrorFeedbackMessage: "",
      isLoadingImagePreview: true,
      imagePreviewOriginalFileName: originalFileName,
      imagePreviewMimeType: downloadMimeType,
    });

    let response = await this.props.downloadMediaAPICall();

    if (response.errorStatus === undefined) {
      let downloadMimeType = this.getMimeTypeFromFileName(originalFileName);
      const media = new Blob([response.data], { type: downloadMimeType });

      this.setState({
        imageFilePreview: media,
      });
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
      downloadFileButtonText: "Download",
    });
  }

  onClickDownloadFile = async () => {
    //Download audio
    let mimeType = this.getMimeTypeFromFileName(this.props.children.file_name)
    if (this.state.audioFilePreview !== null && mimeType.includes("audio")) {
      download(
          this.state.audioFilePreview,
          this.state.audioPreviewOriginalFileName,
          this.state.audioPreviewMimeType
      );
    }
    //Download image
    else if(this.state.imageFilePreview !== null && mimeType.includes("image")) {
      download(
        this.state.imageFilePreview,
        this.state.imagePreviewOriginalFileName,
        this.state.imagePreviewMimeType
      );
    } else {
      console.error("UNSUPPORTED FILE TYPE:" + mimeType);
    }
  }

  onClickUploadFile = (e) => {
    this.setState({
      showUploadNewFile: true,
    });
  };

  async onClickDeleteFile() {
    this.setState({
      deleteFileButtonText: "Deleting...",
      fileErrorFeedbackMessage: "",
    });
    let response = await this.props.deleteMediaAPICall();

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
      deleteFileButtonText: "Delete",
    });
  }

  render() {
    const isMediaObjectProvided = this.props.children !== undefined;
    let loadImagePreview = false;
    let loadAudioPreview = false;

    if (isMediaObjectProvided) {
      let fileMimeType = this.getMimeTypeFromFileName(
        this.props.children.file_name
      );
      loadImagePreview = isImageFile(fileMimeType);
      loadAudioPreview = isAudioFile(fileMimeType);
    }

    //Setting up the image preview
    let { imageFilePreview, isLoadingImagePreview } = this.state;
    let imagePreviewUrl = imageFilePreview && blobUrl(imageFilePreview);

    let { audioFilePreview, isLoadingAudioPreview } = this.state;
    let audioPreviewUrl = audioFilePreview && blobUrl(audioFilePreview);

    if (isMediaObjectProvided) {
      if (imageFilePreview === null && isLoadingImagePreview === false && loadImagePreview) {
        this.loadImagePreview();
      } else if (audioFilePreview === null && isLoadingAudioPreview === false && loadAudioPreview) {
        this.loadAudioPreview().catch(err => {console.error(`FAILED TO GET BLOB FOR AUDIO: ${err}`)});
      }
    }
    return (
      <>
        <div className="form-group col-md-6">
          <label className="font-weight-bold">{this.props.title} </label>
          <ShowCurrentFile>{this.props.children}</ShowCurrentFile>
          <FileOptions
            onClickDownload={this.onClickDownloadFile}
            downloadButtonText={this.state.downloadFileButtonText}
            onclickUploadFile={this.onClickUploadFile}
            uploadFileButtonText="Replace"
            onClickDeleteFile={this.onClickDeleteFile}
            deleteButtonText={this.state.deleteFileButtonText}
            showOptions={this.hasAFileUploaded(this.props.children)}
          >
            {this.props.children}
          </FileOptions>
          <UploadFileSection
            onChangeFunction={this.onChangeFile}
            hide={
              !isMediaObjectProvided ? false : !this.state.showUploadNewFile
            }
          ></UploadFileSection>
          {imagePreviewUrl && (
            <img
              style={imagePreviewStyle}
              src={imagePreviewUrl}
              alt="Preview"
            />
          )}
          {audioPreviewUrl && (
              <audio
                  src={audioPreviewUrl}
                  controls={true}
              />
          )}

          <label style={{ color: "red" }}>
            {this.state.fileErrorFeedbackMessage}
          </label>
        </div>
      </>
    );
  }
}
