import React, { Component } from "react";
import Breadcrumb from "react-bootstrap/Breadcrumb";

import Instructions from "./instructions.component";
import urlParser from "../Utils/parseIdsFromURL";
import APIInterface from "./APIInterface";
import QuestionAnswers from "./answerOptionsSection.component";
import changeTableName from "../Utils/changeElementName";
import { unauthorizedErrorMessage } from "../Utils/authorization";
import LoadingSpinner from "../Utils/LoadingSpinner";

export default class MCQuestion extends Component {
  constructor(props) {
    super(props);

    this.updateInstructions = this.updateInstructions.bind(this);
    this.updateOptions = this.updateOptions.bind(this);
    this.updateTableName = this.updateTableName.bind(this);
    this.onClickSave = this.onClickSave.bind(this);

    let elementsId = urlParser.MCQuestionParser(window.location.href);

    this.state = {
      pg_table_name: "",
      instructions: {
        text_cree: "",
        text_eng: "",
      },
      options: [],
      question_id: elementsId.question_id,
      lesson_id: elementsId.lesson_id,
      saveButtonText: "Save Question",
      errorMessage: "",
      audioFile: "",
      showLoading:true,
    };
  }

  async componentDidMount() {

    if(this.state.question_id !== "newQuestion") {
      let question = await APIInterface.getQuestion({
        question_id: this.state.question_id,
      });

      if (question.errorStatus === undefined) {
        this.setState({
          pg_table_name: question.pg_table_name,
          instructions: question.instructions,
          options: question.options,
          showLoading: false,
        });
      } else if (question.errorStatus === 401) {
        window.location = "/login";
      } else {
        this.setState({
          errorMessage: question.errorMessage,
        });
      }
    } else {
      this.setState({showLoading:false});
    }
  }

  updateInstructions = (newInstructions,newAudio) => {
    this.setState({
      instructions: newInstructions,
    });

    if(newAudio){
      this.setState({
        audio: newAudio.media,
        audioFile: newAudio.mediaFile,
      })
    }
  };

  updateOptions = (newOptions) => {
    this.setState({
      options: newOptions,
    });
  };

  updateTableName = (e) => {
    this.setState({
      pg_table_name: e.target.value,
    });
  };

  async onClickSave() {
    this.setState({
      saveButtonText: "Saving... Please wait.",
      errorMessage: "",
    });

    let saveResult;
    if(this.state.question_id === "newQuestion"){
      saveResult = await APIInterface.addQuestion(this.state)
      this.setState({question_id:saveResult})
    } else {
      saveResult = await APIInterface.updateQuestion({
        question: this.state,
      });
    }

    if (saveResult.errorStatus === undefined) {
      window.location = "/lesson/" + this.state.lesson_id + "/mcQuestion/" + this.state.question_id;
    } else {
      if (saveResult.errorStatus === 401) {
        this.setState({
          errorMessage: unauthorizedErrorMessage,
          saveButtonText: "Save Question (Login first)",
        });
        window.open("/login", "_blank");
      } else {
        this.setState({
          errorMessage: saveResult.errorMessage,
          saveButtonText: "Save Question",
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
              <Breadcrumb.Item active>Multiple Choice Question</Breadcrumb.Item>
            </Breadcrumb>
            <h3 className="mb-4">{this.state.pg_table_name || "New Multiple Choice Question"}</h3>
            <Instructions
              updateStateFunction={this.updateInstructions}
              elementId={this.state.question_id}
              saveFunction={this.onClickSave}
            >
              {this.state.instructions}
            </Instructions>
              <br/>
              {this.state.question_id === "newQuestion" &&
                  <button
                      className="btn btn-dark"
                      onClick={this.onClickSave}>
                    Add Answers
                  </button>
              }
              <br/>
              {this.state.question_id !== "newQuestion" &&
                <QuestionAnswers updateStateFunction={this.updateOptions}>
                  {this.state.options}
                </QuestionAnswers>
              }

              <br/>
            {changeTableName(
              "Question",
              this.state.pg_table_name,
              this.updateTableName
            )}
            <div className="form-group">
              <button className="btn btn-dark" onClick={this.onClickSave}>
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
