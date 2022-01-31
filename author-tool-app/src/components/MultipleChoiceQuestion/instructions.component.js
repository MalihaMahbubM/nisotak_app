import React, { Component } from "react";
import APIInterface from "./APIInterface";
import MediaSection from "../Utils/Media/media.component";

export default class Instructions extends Component {
  constructor(props) {
    super(props);

    this.onChangeCreeInstructions = this.onChangeCreeInstructions.bind(this);
    this.onChangeEngInstructions = this.onChangeEngInstructions.bind(this);
    this.onChangeAudio = this.onChangeAudio.bind(this);
    this.downloadAudio = this.downloadAudio.bind(this);
    this.deleteAudio = this.deleteAudio.bind(this);
  }

  onChangeCreeInstructions = (e) => {
    this.props.updateStateFunction({
      text_cree: e.target.value,
      text_eng: this.props.children.text_eng,
      audio: this.props.children.audio,
    });
  };

  onChangeEngInstructions = (e) => {
    this.props.updateStateFunction({
      text_eng: e.target.value,
      text_cree: this.props.children.text_cree,
      audio: this.props.children.audio,
    });
  };

  onChangeAudio = (audioObject) => {
    this.props.updateStateFunction(
      {
        text_eng: this.props.children.text_eng,
        text_cree: this.props.children.text_cree,
      },
      audioObject,
    );
  };

  async downloadAudio() {
    let response = await APIInterface.downloadAudio({
      question_id: this.props.elementId,
    });
    return response;
  }

  async deleteAudio() {
    let response = await APIInterface.deleteAudio({
      question_id: this.props.elementId,
    });
    return response;
  }

  render() {
    return (
      <div>
        <h5 className="font-weight-bold">Instructions:</h5>
        <div className="form-row">
          <div className="form-group col-md-6">
            <label className="font-weight-bold">Indigenous Language</label>
            <textarea
              type="text"
              rows="6"
              required
              className="form-control"
              placeholder={this.props.children.text_cree}
              value={this.props.children.text_cree}
              onChange={this.onChangeCreeInstructions}
            />
          </div>
          <div className="form-group col-md-6">
            <label className="font-weight-bold">English</label>
            <textarea
              type="text"
              rows="6"
              required
              className="form-control"
              placeholder={this.props.children.text_eng}
              value={this.props.children.text_eng}
              onChange={this.onChangeEngInstructions}
            />
          </div>
        </div>

        {this.props.elementId === "newQuestion" &&
            <button
                className="btn btn-dark"
                onClick={this.props.saveFunction}
                > Add Audio </button>
        }
        {this.props.elementId !== "newQuestion" &&
        <MediaSection
            onChangeFile={this.onChangeAudio}
            downloadMediaAPICall={this.downloadAudio}
            deleteMediaAPICall={this.deleteAudio}
            reloadPageAfterDelete={true}
            title="Audio"
            allowedType={["mp3"]}>
          {this.props.children.audio}
        </MediaSection>
        }
      </div>
    );
  }
}
