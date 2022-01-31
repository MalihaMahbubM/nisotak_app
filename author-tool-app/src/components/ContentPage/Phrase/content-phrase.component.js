import React, { Component } from "react";
import Breadcrumb from "react-bootstrap/Breadcrumb";
import MorphemesTable from "./morphemesTable.component";
import UploadAudioAndImageSection from "../../Utils/Media/uploadAudioAndImageSection.component";
import APIInterface from "./APIInterface";
import urlParser from "../../Utils/parseIdsFromURL";
import { unauthorizedErrorMessage } from "../../Utils/authorization";
import LoadingSpinner from "../../Utils/LoadingSpinner";
import {TransparentButton} from "../../Utils/Buttons";



export default class ContentPhrase extends Component {
  constructor(props) {
    super(props);

    this.updateMorphemes = this.updateMorphemes.bind(this);
    this.blankMorpheme = this.blankMorpheme.bind(this);
    this.onChangeAudio = this.onChangeAudio.bind(this);
    this.onChangeImage = this.onChangeImage.bind(this);
    this.onChangeTblName = this.onChangeTblName.bind(this);
    this.onSubmit = this.onSubmit.bind(this);

    let elementsId = urlParser.PhraseContentParser(window.location.href);

    this.state = {
      cnt_table_name: "",
      morphemes: [],
      audio: undefined,
      imageFile: "",
      phrase_id: elementsId.phrase_id,
      cnt_page_id: elementsId.contentPage_id,
      lesson_id: elementsId.lesson_id,
      errorMessage: "",
      saveButtonText: "Save Phrase",
      showLoading:true,
    };
  }

  async componentDidMount() {

    if(this.state.phrase_id !== "newPhrase") {
      let phrase = await APIInterface.getElement(this.state.phrase_id);

      phrase.morphemes.sort(function (a, b) {
        return a.position - b.position;
      });

      if (phrase.errorStatus === undefined) {
        this.setState({
          audio: phrase.audio,
          image: phrase.image,
          morphemes: phrase.morphemes,
          cnt_table_name: phrase.cnt_table_name,
          showLoading: false,
        });
      } else if (phrase.error === 401) {
        window.location = "/login";
      } else {
        this.setState({
          errorMessage: phrase.errorMessage,
        });
      }
    } else {
      this.setState({showLoading:false})
    }
  }

  blankMorpheme = (pos) => {
    return {
      position: pos,
      morph_cree: "",
      morph_english: "",
    };
  };

  onClickAddMorpheme = (e) => {
    let updatedOptionsList = this.state.morphemes;
    updatedOptionsList.push(this.blankMorpheme(this.state.morphemes.length));
    this.updateMorphemes(updatedOptionsList);
  };


  updateMorphemes = (newMorphemesState) => {
    this.setState({
      morphemes: newMorphemesState,
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

  onChangeTblName = (e) => {
    this.setState({
      cnt_table_name: e.target.value,
    });
  };

  async onSubmit() {
    this.setState({
      saveButtonText: "Saving... Please wait.",
      errorMessage: "",
    });
    let saveResult;
    if(this.state.phrase_id === "newPhrase"){
      saveResult = await APIInterface.addElement(this.state)
	  this.setState({phrase_id:saveResult});
    } else {
      saveResult = await APIInterface.updateElement({
        fullElement: this.state,
      });
    }
    if (saveResult.errorStatus === undefined) {
      window.location =
        "/lesson/" +
        this.state.lesson_id +
        "/contentPage/" +
        this.state.cnt_page_id +
		"/phrase/" + this.state.phrase_id;
    } else {
      if (saveResult.errorStatus === 401) {
        this.setState({
          errorMessage: unauthorizedErrorMessage,
          saveButtonText: "Save Phrase (Login first)",
        });
        window.open("/login", "_blank");
      } else {
        this.setState({
          errorMessage: saveResult.errorMessage,
          saveButtonText: "Save Phrase",
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
              href={`/lesson/${this.state.lesson_id}/contentPage/${this.state.cnt_page_id}`}
            >
              Content Page
            </Breadcrumb.Item>
            <Breadcrumb.Item active>Phrase</Breadcrumb.Item>
          </Breadcrumb>

          <h3 className="mb-4">{this.state.cnt_table_name || "New Phrase"}</h3>

            {this.state.morphemes.length > 0 &&
              <div>
              <MorphemesTable updateStateFunction={this.updateMorphemes}>
                {this.state.morphemes}
              </MorphemesTable>
                <p>
                  <b>Preview:</b><br/>
                  <i>{this.state.morphemes.map(m => m.morph_cree).join(' ')}</i><br/>
                  {this.state.morphemes.map(m => m.morph_english).join(' ')}
              </p>
              </div>
            }

            <div className="form-row mb-3">
              <TransparentButton
                  disabled={this.state.morphemes.length >= 30}
                  onClick={this.onClickAddMorpheme}>
                Add Morpheme
              </TransparentButton>
            </div>




			{this.state.phrase_id === "newPhrase" &&
                <div>
                <button
                  className="btn btn-dark"
                  onClick={this.onSubmit.bind(this)}
                  > Add Media
                </button>
                </div>
			}
			{this.state.phrase_id !== "newPhrase" &&
					<UploadAudioAndImageSection
					  updateAudioStateFunction={this.onChangeAudio}
					  updateImageStateFunction={this.onChangeImage}
					  elementId={this.state.phrase_id}
					  APIInterface={APIInterface}
					>
					  {{
						sectionTitle: "Phrase Media",
						audio: this.state.audio,
						image: this.state.image,
					  }}
					</UploadAudioAndImageSection>
			}

            <br/>

            <div className="form-group">
              <label className="font-weight-bold">Phrase Name</label>
              <input
                type="text"
                required
                className="form-control col-md-4"
                placeholder={this.state.cnt_table_name}
                value={this.state.cnt_table_name}
                onChange={this.onChangeTblName}
              />
            </div>

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