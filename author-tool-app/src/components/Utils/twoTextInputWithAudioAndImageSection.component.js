import React, { Component } from "react";
import MediaSection from "./Media/media.component";

export default class TwoTextInputWithAudioAndImageSection extends Component {
  constructor(props) {
    super(props);

    this.onChangeIndigenousText = this.onChangeIndigenousText.bind(this);
    this.onChangeEnglishText = this.onChangeEnglishText.bind(this);
    this.onChangeAudio = this.onChangeAudio.bind(this);
    this.onChangeImage = this.onChangeImage.bind(this);
    this.downloadAudio = this.downloadAudio.bind(this);
    this.downloadImage = this.downloadImage.bind(this);
    this.deleteAudio = this.deleteAudio.bind(this);
    this.deleteImage = this.deleteImage.bind(this);
  }

  onChangeIndigenousText = (e) => {
    this.props.updateTextStateFunction({
      text_indigenous: e.target.value,
      text_english: this.props.children.text_english,
    });
  };

  onChangeEnglishText = (e) => {
    this.props.updateTextStateFunction({
      text_english: e.target.value,
      text_indigenous: this.props.children.text_indigenous,
    });
  };

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
        <h5 className="font-weight-bold">
          {this.props.children.sectionTitle}:
        </h5>
        <div className="form-row">
          <div className="form-group col-md-6">
            <label className="font-weight-bold">Indigenous Language</label>
            <textarea
              type="text"
              rows="6"
              required
              className="form-control"
              placeholder={this.props.children.text_indigenous}
              value={this.props.children.text_indigenous}
              onChange={this.onChangeIndigenousText}
            />
          </div>
          <div className="form-group col-md-6">
            <label className="font-weight-bold">English</label>
            <textarea
              type="text"
              rows="6"
              required
              className="form-control"
              placeholder={this.props.children.text_english}
              value={this.props.children.text_english}
              onChange={this.onChangeEnglishText}
            />
          </div>
        </div>


        {this.props.elementId.toString().includes("new") &&
              <button
                  className="btn btn-dark"
                  onClick={this.props.saveFunction}>
                Add Media
              </button>
        }
        {!this.props.elementId.toString().includes("new") &&
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
        }
      </div>
    );
  }
}
