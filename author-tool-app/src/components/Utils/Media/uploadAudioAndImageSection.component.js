import React, { Component } from "react";
import MediaSection from "./media.component";

export default class UploadAudioAndImageSection extends Component {
  constructor(props) {
    super(props);

    this.onChangeAudio = this.onChangeAudio.bind(this);
    this.downloadAudio = this.downloadAudio.bind(this);
    this.deleteAudio = this.deleteAudio.bind(this);

    this.onChangeImage = this.onChangeImage.bind(this);
    this.downloadImage = this.downloadImage.bind(this);
    this.deleteImage = this.deleteImage.bind(this);
  }

  onChangeAudio = (audioObject) => {
    this.props.updateAudioStateFunction(
      {
        audio: audioObject.media,
      },
      audioObject.mediaFile
    );
  };

  onChangeImage = (imageObject) => {
    this.props.updateImageStateFunction(
      {
        image: imageObject.media,
      },
      imageObject.mediaFile
    );
  };

  async downloadAudio() {
    let response = await this.props.APIInterface.downloadAudio({
      element_id: this.props.elementId,
    });
    return response;
  }

  async downloadImage() {
    let response = await this.props.APIInterface.downloadImage({
      element_id: this.props.elementId,
    });
    return response;
  }

  async deleteAudio() {
    let response = await this.props.APIInterface.deleteAudio({
      element_id: this.props.elementId,
    });
    return response;
  }

  async deleteImage() {
    let response = await this.props.APIInterface.deleteImage({
      element_id: this.props.elementId,
    });
    return response;
  }

  render() {
    return (
      <div>
        <h5 className="font-weight-bold">{this.props.children.sectionTitle}</h5>

        <div className="form-row ml-1">
          <MediaSection
            onChangeFile={this.onChangeImage}
            downloadMediaAPICall={this.downloadImage}
            deleteMediaAPICall={this.deleteImage}
            reloadPageAfterDelete={true}
            title="Image"
            allowedType={["jpeg", "png", "jpg"]}
          >
            {this.props.children.image}
          </MediaSection>

          <MediaSection
            onChangeFile={this.onChangeAudio}
            downloadMediaAPICall={this.downloadAudio}
            deleteMediaAPICall={this.deleteAudio}
            reloadPageAfterDelete={true}
            title="Audio"
            allowedType={["mp3"]}
          >
            {this.props.children.audio}
          </MediaSection>
        </div>
      </div>
    );
  }
}
