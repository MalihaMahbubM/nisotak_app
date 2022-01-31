import React, { Component } from "react";
import Breadcrumb from "react-bootstrap/Breadcrumb";
import TwoTextInputWithAudioAndImageSection from "../../Utils/twoTextInputWithAudioAndImageSection.component";
import changeTableName from "../../Utils/changeElementName";
import APIInterface from "./APIInterface";
import urlParser from "../../Utils/parseIdsFromURL";
import { unauthorizedErrorMessage } from "../../Utils/authorization";
import LoadingSpinner from "../../Utils/LoadingSpinner";

export default class ContentText extends Component {
  constructor(props) {
    super(props);

    this.onChangeTableName = this.onChangeTableName.bind(this);
    this.onChangeAudio = this.onChangeAudio.bind(this);
    this.onChangeImage = this.onChangeImage.bind(this);
    this.onChangeText = this.onChangeText.bind(this);
    this.onSubmit = this.onSubmit.bind(this);

    let elementsId = urlParser.TextContentParser(window.location.href);

    this.state = {
      text_cree: "",
      text_english: "",
      cnt_table_name: "",
      audio: undefined,
      audioFile: "",
      image: undefined,
      imageFile: "",
      text_id: elementsId.text_id,
      cnt_pg_id: elementsId.contentPage_id,
      lesson_id: elementsId.lesson_id,
      errorMessage: "",
      saveButtonText: "Save Text/Story",
      showLoading:true,
    };
  }

  async componentDidMount() {
    if(this.state.text_id !== "newText") {
      let text = await APIInterface.getElement(this.state.text_id);

      if (text.errorStatus === undefined) {
        this.setState({
          text_cree: text.text_cree,
          text_english: text.text_english,
          audio: text.audio,
          image: text.image,
          cnt_table_name: text.cnt_table_name,
          showLoading: false,
        });
      } else if (text.errorStatus === 401) {
        window.location = "/login";
      } else {
        this.setState({
          errorMessage: text.errorMessage,
        });
      }
    } else {
      this.setState({showLoading:false});
    }
  }

  onChangeText = (textInput) => {
    this.setState({
      text_cree: textInput.text_indigenous,
      text_english: textInput.text_english,
    });
  };

  onChangeAudio = (newAudioObject, newAudioFile) => {
    this.setState({
      audio: newAudioObject.audio,
      audioFile: newAudioFile,
    });
  };

  onChangeImage = (newMediaObject, newImageFile) => {
    this.setState({
      image: newMediaObject.image,
      imageFile: newImageFile,
    });
  };

  onChangeTableName = (e) => {
    this.setState({
      cnt_table_name: e.target.value,
    });
  };

  async onSubmit() {

    this.setState({
      saveButtonText: "Saving... Please wait.",
      errorMessage: "",
    });

    let saveTextResult;
    if (this.state.text_id === "newText") {
      let newText = this.state
      saveTextResult = await APIInterface.addElement(newText)
      this.setState({text_id:saveTextResult})
    } else {
    saveTextResult = await APIInterface.updateElement({
      fullElement: this.state,
    });
  }

    if (saveTextResult.errorStatus === undefined) {
      window.location =
        "/lesson/" +
        this.state.lesson_id +
        "/contentPage/" +
        this.state.cnt_pg_id +
        "/text/" + this.state.text_id;
    } else {
      if (saveTextResult.errorStatus === 401) {
        this.setState({
          errorMessage: unauthorizedErrorMessage,
          saveButtonText: "Save Text/Story (Login first)",
        });
        window.open("/login", "_blank");
      } else {
        this.setState({
          errorMessage: saveTextResult.errorMessage,
          saveButtonText: "Save Text/Story",
        });
      }
    }
  }

  render() {
    return (
      <div className="ml-3 mr-4">
        {this.state.showLoading && <LoadingSpinner top={'50%'} left={'50%'}/>}

        {!this.state.showLoading &&
          <div>
          <Breadcrumb>
            <Breadcrumb.Item href="/">Home</Breadcrumb.Item>
            <Breadcrumb.Item href={`/lesson/${this.state.lesson_id}`}>
              Lesson
            </Breadcrumb.Item>
            <Breadcrumb.Item
              href={`/lesson/${this.state.lesson_id}/contentPage/${this.state.cnt_pg_id}`}
            >
              Content Page
            </Breadcrumb.Item>
            <Breadcrumb.Item active>Text/Story Content</Breadcrumb.Item>
          </Breadcrumb>

          <h3 className="mb-4">{this.state.cnt_table_name|| "New Text/Story"}</h3>
          <h5 className="mb-4">Text/Story Content</h5>
          <TwoTextInputWithAudioAndImageSection
            updateTextStateFunction={this.onChangeText}
            updateAudioStateFunction={this.onChangeAudio}
            updateImageStateFunction={this.onChangeImage}
            saveFunction={this.onSubmit}
            elementId={this.state.text_id}
            APIInterface={APIInterface}
          >
            {{
              text_indigenous: this.state.text_cree,
              text_english: this.state.text_english,
              sectionTitle: "Text/Story",
              audio: this.state.audio,
              image: this.state.image,
            }}
          </TwoTextInputWithAudioAndImageSection>
          <br/>
          {changeTableName(
            "Text/Story",
            this.state.cnt_table_name,
            this.onChangeTableName
          )}

          <div className="form-group">
            <button className="btn btn-dark" onClick={this.onSubmit}>
              {this.state.saveButtonText}
            </button>
          </div>
          <label style={{ color: "red" }}>{this.state.errorMessage}</label>
          </div>
        }
      </div>
    );
  }
}
