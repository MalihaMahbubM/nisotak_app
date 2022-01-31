import React, { Component } from "react";
import correctAnswerDropdown from "./correctAnswerDropdown";
import { TabbleButton, TransparentButton } from "../Utils/Buttons";
import AnswerModal from "./answerModal.component";
import urlParser from "../Utils/parseIdsFromURL";
import ConfirmDelete from "../Utils/confirmDelete.component";
import AudioPlayer from "../Utils/Audio/audioPlayer.component";

export default class QuestionAnswers extends Component {
  constructor(props) {
    super(props);

    this.updateParentState = this.updateParentState.bind(this);
    this.blankOption = this.blankOption.bind(this);
    this.onClickAddOption = this.onClickAddOption.bind(this);
    this.onChangeOptionTextCree = this.onChangeOptionTextCree.bind(this);
    this.onChangeOptionTextEng = this.onChangeOptionTextEng.bind(this);
    this.onClickDeleteOption = this.onClickDeleteOption.bind(this);
    this.onConfirmDeleteOption = this.onConfirmDeleteOption.bind(this);
    this.onChangeCorrectOption = this.onChangeCorrectOption.bind(this);
    this.onClickAudioOptions = this.onClickAudioOptions.bind(this);
    this.closeAudioModal = this.closeAudioModal.bind(this);
    this.closeDeleteConfirmationModal = this.closeDeleteConfirmationModal.bind(
      this
    );
    this.updateAnswerOptionFromModal = this.updateAnswerOptionFromModal.bind(
      this
    );

    let elementsId = urlParser.MCQuestionParser(window.location.href);

    this.state = {
      showAudioModal: false,
      showDeleteConfirmationModal: false,
      question_id: elementsId.question_id,
      deleteItemIndex: undefined,
      reGetAudio:false,
    };
  }

  updateParentState = (optionsList) => {
    this.props.updateStateFunction(optionsList);
  };

  blankOption = () => {
    return {
      audio:undefined,
      is_correct: false,
      text_cree: "",
      text_eng: "",
    };
  };

  onClickAddOption = (e) => {
    let updatedOptionsList = this.props.children;
    updatedOptionsList.push(this.blankOption());
    this.updateParentState(updatedOptionsList);
  };

  onChangeOptionTextCree = (e) => {
    let updatedOptionsList = this.props.children;
    updatedOptionsList[e.target.id].text_cree = e.target.value;
    this.updateParentState(updatedOptionsList);
  };

  onChangeOptionTextEng = (e) => {
    let updatedOptionsList = this.props.children;
    updatedOptionsList[e.target.id].text_eng = e.target.value;
    this.updateParentState(updatedOptionsList);
  };

  onClickDeleteOption = (e) => {
    this.setState({
      showDeleteConfirmationModal: true,
      deleteItemIndex: e.target.id,
    });
  };

  onConfirmDeleteOption = (elementId) => {
    this.setState({
      showDeleteConfirmationModal: false,
      deleteItemIndex: undefined,
    });

    let updatedOptionsList = this.props.children;
    updatedOptionsList.splice(elementId, 1);
    this.updateParentState(updatedOptionsList);
  };

  onChangeCorrectOption = (e) => {
    let updatedOptionsList = this.props.children;
    // Must clear the previous correct answer
    for (var i = 0; i < updatedOptionsList.length; i++) {
      updatedOptionsList[i].is_correct = false;
    }
    if (e.target.value >= 0) {
      updatedOptionsList[e.target.value].is_correct = true;
    }
    this.updateParentState(updatedOptionsList);
  };

  onClickAudioOptions = (e) => {
    this.setState({
      showAudioModal: parseInt(e.target.id),
    });
  };

  closeAudioModal = () => {
    this.setState({
      showAudioModal: false,
    });
  };

  closeDeleteConfirmationModal = () => {
    this.setState({
      showDeleteConfirmationModal: false,
    });
  };

  updateAnswerOptionFromModal = (answerId, updatedOptionsServerState) => {
    // Not all answer options are recorded in the server yet
    // But only the one saved must be updated in the page state
    let currentOptionsList = this.props.children;
    let updatedOptionsList = [];
    let serverOptIndex = 0;
    for (let index = 0; index < currentOptionsList.length; index++) {
      if (currentOptionsList[index]._id === "" && answerId !== index) {
        updatedOptionsList.push(currentOptionsList[index]);
      } else if (answerId === index) {
        updatedOptionsList.push(updatedOptionsServerState[serverOptIndex]);
        serverOptIndex++;
      } else {
        updatedOptionsList.push(currentOptionsList[index]);
        serverOptIndex++;
      }
    }

    this.updateParentState(updatedOptionsList);
  };

  render() {
    return (
      <div>
        <h5 className="font-weight-bold">Answer Options:</h5>

        <table className="table table-striped table-bordered mt-4 mb-4">
          <thead className="thead-dark">
            <tr>
              <th scope="col" width="30">
                Answer
              </th>
              <th scope="col">Language: Indigenous</th>
              <th scope="col">Language: English</th>
              <th scope="col" width="40">
                Audio
              </th>
              <th scope="col" width="200">
                Options
              </th>
            </tr>
          </thead>

          <tbody>
            {this.props.children.map((val, idx) => {
              return (
                <tr key={idx}>
                  <td className="text-center">
                    {String.fromCharCode(65 + idx)}
                  </td>
                  <td>
                    <input
                      type="text"
                      required
                      className="form-control"
                      name="Cree"
                      id={idx}
                      placeholder={val.text_cree}
                      value={val.text_cree}
                      onChange={this.onChangeOptionTextCree}
                    />
                  </td>
                  <td>
                    <input
                      type="text"
                      required
                      className="form-control"
                      name="English"
                      id={idx}
                      placeholder={val.text_eng}
                      value={val.text_eng}
                      onChange={this.onChangeOptionTextEng}
                    />
                  </td>
                  <td>
                    <AudioPlayer
                        audioProps={{question_id:this.state.question_id,option_id:val._id}}
                        file_name={val?.audio?.file_name ?? "None"}
                        ></AudioPlayer>
                  </td>
                  <td>
                    <TabbleButton id={idx} onClick={this.onClickDeleteOption}>
                      Delete
                    </TabbleButton>
                    <ConfirmDelete
                      id={this.state.deleteItemIndex}
                      show={this.state.showDeleteConfirmationModal}
                      closeModalCallback={this.closeDeleteConfirmationModal}
                      deleteFunction={this.onConfirmDeleteOption}
                    ></ConfirmDelete>
                    <TabbleButton id={idx} onClick={this.onClickAudioOptions}>
                      Audio
                    </TabbleButton>
                    <AnswerModal
                      id={idx}
                      show={this.state.showAudioModal === idx}
                      closeModalCallback={this.closeAudioModal}
                      updateOptionsCallback={this.updateAnswerOptionFromModal}
                      question_id={this.state.question_id}
                      answerLetter={String.fromCharCode(65 + idx)}
                      answerObject={val}
                    ></AnswerModal>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        <div className="form-row mb-3">
          <TransparentButton onClick={this.onClickAddOption}>
            Add New Answer
          </TransparentButton>
          <label className="font-weight-bold ml-3">Correct Answer: </label>
          {correctAnswerDropdown(
            this.props.children,
            this.onChangeCorrectOption
          )}
        </div>
      </div>
    );
  }
}
