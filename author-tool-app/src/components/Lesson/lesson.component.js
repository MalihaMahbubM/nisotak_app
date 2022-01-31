import React, { Component } from "react";
import Breadcrumb from "react-bootstrap/Breadcrumb";
import ConfirmDelete from "../Utils/confirmDelete.component";
import urlParser from "../Utils/parseIdsFromURL";
import APIInterface from "./APIInterface";
import { unauthorizedErrorMessage } from "../Utils/authorization";
import MediaSection from "../Utils/Media/media.component";
import LoadingSpinner from "../Utils/LoadingSpinner";

export default class Lesson extends Component {
  constructor(props) {
    super(props);

    // Lesson fields
    this.onChangeTitleCree = this.onChangeTitleCree.bind(this);
    this.onChangeTitleEng = this.onChangeTitleEng.bind(this);
    this.onChangeIntroCree = this.onChangeIntroCree.bind(this);
    this.onChangeIntroEng = this.onChangeIntroEng.bind(this);
    this.onChangeTopicCree = this.onChangeTopicCree.bind(this);
    this.onChangeTopicEng = this.onChangeTopicEng.bind(this);
    this.onChangeLocation = this.onChangeLocation.bind(this);
    this.onChangeDialect = this.onChangeDialect.bind(this);
    this.onChangeKnowledgeSource = this.onChangeKnowledgeSource.bind(this);
    this.onChangeLevel = this.onChangeLevel.bind(this);
    this.onClickNewContent = this.onClickNewContent.bind(this);
    this.onChangeDisplayOrder = this.onChangeDisplayOrder.bind(this);
    this.onClickEdit = this.onClickEdit.bind(this);
    this.onConfirmDelete = this.onConfirmDelete.bind(this);
    this.onClickDelete = this.onClickDelete.bind(this);
    this.closeDeleteConfirmationModal = this.closeDeleteConfirmationModal.bind(
        this
    );
    this.saveLesson = this.saveLesson.bind(this);
    // Media
    this.onChangeAudio = this.onChangeAudio.bind(this);
    this.downloadAudio = this.downloadAudio.bind(this);
    this.deleteAudio = this.deleteAudio.bind(this);

    let lesson_id = urlParser.LessonPageParser(window.location.href).lesson_id;
    this.state = {
      title_cree: "",
      title_eng: "",
      intro_cree: "",
      intro_eng: "",
      topic_cree: "",
      topic_eng: "",
      location: "",
      dialect: "",
      knowledge_source: "",
      author: "",
      level: "",
      difficulty: "",
      audioFile: "",
      audio:undefined,
      levelOpt: ["-", "Beginner", "Intermediate", "Advanced"],
      difficultyOpt: ["-", "Easy", "Normal", "Hard"],
      pages: [],
      errorMessage: "",
      saveButtonText: "Save Lesson",
      showDeleteConfirmationModal: false,
      deleteItemIndex: undefined,
      lesson_id: lesson_id,
      published:false,
      showLoading: true,
    };
  }

  async componentDidMount() {

    if (this.state.lesson_id !== "newLesson") {
      let lesson = await APIInterface.getElement(this.state.lesson_id);
      if (lesson.errorStatus === undefined) {
        lesson.pages.sort(function (a, b) {
          return a.pg_display_order - b.pg_display_order;
        });
        let lessonPages = await APIInterface.getContentTableNames(lesson.pages);
        if (lessonPages.errorStatus === undefined) {
          this.setState({
            title_cree: lesson.title_cree,
            title_eng: lesson.title_eng,
            intro_cree: lesson.intro_cree,
            intro_eng: lesson.intro_eng,
            topic_cree: lesson.topic_cree,
            topic_eng: lesson.topic_eng,
            location: lesson.location,
            dialect: lesson.dialect,
            knowledge_source: lesson.knowledge_source,
            author: lesson.author,
            level: lesson.level,
            difficulty: lesson.difficulty,
            audio: lesson.audio,
            pages: lessonPages,
            published:lesson.published,
            showLoading: false,
          });
        } else if (lessonPages.errorStatus === 401) {
          window.location = "/login";
        } else {
          this.setState({
            errorMessage: lessonPages.errorMessage,
          });
        }
      } else if (lesson.errorStatus === 401) {
        window.location = "/login";
      } else {
        this.setState({
          errorMessage: lesson.errorMessage,
        });
      }
    } else {
      this.setState({
        showLoading: false
      })
    }
  }

  onChangeTitleCree = (e) => {
    this.setState({
      title_cree: e.target.value,
    });
  };

  onChangeTitleEng = (e) => {
    this.setState({
      title_eng: e.target.value,
    });
  };

  onChangeIntroCree = (e) => {
    this.setState({
      intro_cree: e.target.value,
    });
  };

  onChangeIntroEng = (e) => {
    this.setState({
      intro_eng: e.target.value,
    });
  };

  onChangeTopicCree = (e) => {
    this.setState({
      topic_cree: e.target.value,
    });
  };

  onChangeTopicEng = (e) => {
    this.setState({
      topic_eng: e.target.value,
    });
  };

  onChangeLocation = (e) => {
    this.setState({
      location: e.target.value,
    });
  };

  onChangeDialect = (e) => {
    this.setState({
      dialect: e.target.value,
    });
  };

  onChangeKnowledgeSource = (e) => {
    this.setState({
      knowledge_source: e.target.value,
    });
  };

  onChangeLevel = (e) => {
    this.setState({
      level: e.target.value,
    });
  };

  onChangeDifficulty = (e) => {
    this.setState({
      difficulty: e.target.value,
    });
  };

  changePublish = async (doPublish) => {
    let {lesson_id} = this.state;
    let result = await APIInterface.changePublished({doPublish:doPublish, lesson_id:lesson_id})
    if(result.errorStatus === undefined) {
      this.setState({published: result})
    }
    else if (result.errorStatus === 403){
      window.location = '/login'
    } else {
      console.error(`Failed to publish lesson: ${JSON.stringify(result)}`);
    }
  }

  saveLesson = async (window_address) => {
    this.setState({
      saveButtonText: "Saving... Please wait.",
      errorMessage: "",
      showLoading: true,
    });

    let lesson = this.state;
    let saveResult;
    if (this.state.lesson_id === "newLesson") {
      saveResult = await APIInterface.addLesson(lesson)
      this.setState({lesson_id:saveResult})
    } else {
      saveResult = await APIInterface.updateElement({
        fullElement: this.state,
      });
      this.setState({audio:saveResult.data})
    }
    if (saveResult.errorStatus === undefined) {
      if (window_address !== "stay") {
        //If we are creating a new page, we don't want to navigate
        if (window_address !== "newPage") {
          window.location = window_address;
        }
      }
      else {
          window.location = '/lesson/' + this.state.lesson_id;

        this.setState({
          saveButtonText: "Save Lesson",
          errorMessage: "",
          showLoading: false,
        });
        return true;
      }
    } else {
      if (saveResult.errorStatus === 401) {
        this.setState({
          errorMessage: unauthorizedErrorMessage,
          saveButtonText: "Save Lesson (Login first)",
          showLoading: false,
        });
        window.open("/login", "_blank");
        return false;
      } else {
        this.setState({
          errorMessage: saveResult.errorMessage,
          saveButtonText: "Save Lesson",
          showLoading: false,
        });
        return false;
      }
    }
  };

  onClickNewContent = async (e) => {

    let contentType = e.target.name;
    await this.saveLesson("newPage")
        .then(() => {
          let redirect = window.location.href;

          if(contentType === "Content Page"){
            redirect =
                "/lesson/" +
                this.state.lesson_id +
                "/contentPage/" +
                "newContent"
          } else if (contentType === "Multiple Choice Question"){
            redirect =
                "/lesson/" +
                this.state.lesson_id +
                "/mcQuestion/" +
                "newQuestion"
          }
          else {
            console.error(`Unknown content type requested: ${contentType}`);
          }



          window.location = redirect
        });
  };

  onChangeDisplayOrder = (e) => {
    var aux_pages = this.state.pages;

    if (e.target.value !== "") {
      aux_pages[parseInt(e.target.id)].pg_display_order = parseInt(
          e.target.value
      );
    } else {
      aux_pages[parseInt(e.target.id)].pg_display_order = "";
    }

    this.setState({
      pages: aux_pages,
    });
  };

  onClickEdit = (e) => {
    var nextPageRedirect = "/lesson/" + this.state.lesson_id;

    if (this.state.pages[e.target.id].pg_type === "Content Page") {
      nextPageRedirect = nextPageRedirect + "/contentPage/" + e.target.value;
    } else if (
        this.state.pages[e.target.id].pg_type === "Multiple Choice Question"
    ) {
      nextPageRedirect = nextPageRedirect + "/mcQuestion/" + e.target.value;
    }

    this.saveLesson(nextPageRedirect);
  };

  onClickDelete = (e) => {
    this.setState({
      showDeleteConfirmationModal: true,
      deleteItemIndex: e.target.id,
    });
  };

  closeDeleteConfirmationModal = () => {
    this.setState({
      showDeleteConfirmationModal: false,
      deleteItemIndex: undefined,
    });
  };

  onConfirmDelete = async (elementId) => {
    this.setState({
      showDeleteConfirmationModal: false,
    });

    let isSaved = await this.saveLesson("stay");
    if (isSaved) {
      let deleteResult = await APIInterface.deleteContent(
          this.state.pages[elementId].pg_id,
          this.state.pages[elementId].pg_type
      );
      if (deleteResult.errorStatus === undefined) {
        window.location = "/lesson/" + this.state.lesson_id;
      } else {
        if (deleteResult.errorStatus === 401) {
          this.setState({
            errorMessage: unauthorizedErrorMessage,
            saveButtonText: "Save Lesson (Login first)",
          });
          window.open("/login", "_blank");
        } else {
          this.setState({
            errorMessage: deleteResult.errorMessage,
            saveButtonText: "Save Lesson",
          });
        }
      }
    }
  };

  onChangeAudio = (audioObject) => {
    this.setState({
      audio: audioObject.media,
      audioFile: audioObject.mediaFile,
    });
  };

  async downloadAudio() {
    let response = await APIInterface.downloadAudio({
      element_id: this.state.lesson_id,
    });
    return response;
  }

  async deleteAudio() {
    let response = APIInterface.deleteAudio({
      element_id: this.state.lesson_id,
    });
    return response;
  }

  render() {
    return (
        <div className="ml-3 mr-4">

          {this.state.showLoading && <LoadingSpinner top={'50%'} left={'50%'}/>}

          {!this.state.showLoading &&
          <div>
            <Breadcrumb>
              <Breadcrumb.Item href="/">Home</Breadcrumb.Item>
              <Breadcrumb.Item active>Lesson</Breadcrumb.Item>
            </Breadcrumb>

            <h3 className="mb-4">{this.state.title_cree || "New Lesson"}</h3>
            <h5 className="mb-4"><i>{this.state.title_eng || "New Lesson"}</i></h5>
            {this.state.lesson_id !== "newLesson" &&
            <div>
              <label>Created by: {this.state.author}</label>
            </div>
            }
            {this.state.lesson_id !== "newLesson" &&
            <div align="right">
              {this.state.published &&
              <button
                  onClick={() => this.changePublish(false)}
                  className="btn btn-light">Un-publish
              </button>
              }
              {!this.state.published &&
              <button
                  onClick={() => this.changePublish(true)}
                  className="btn btn-dark">Publish</button>
              }
            </div>
            }

            <h5 className="mt-3 mb-3">About the Language</h5>

            <div className="form-row">
              <div className="form-group col-md-6">
                <label className="font-weight-bold">Location: </label>
                <input
                    type="text"
                    required
                    className="form-control"
                    placeholder={this.state.location}
                    value={this.state.location}
                    onChange={this.onChangeLocation}
                />
              </div>

              <div className="form-group col-md-6">
                <label className="font-weight-bold">Dialect: </label>
                <input
                    type="text"
                    required
                    className="form-control"
                    placeholder={this.state.dialect}
                    value={this.state.dialect}
                    onChange={this.onChangeDialect}
                />
              </div>

              <div className="form-group col-md-6">
                <label className="font-weight-bold">Knowledge source: </label>
                <input
                    type="text"
                    required
                    className="form-control"
                    placeholder={this.state.knowledge_source}
                    value={this.state.knowledge_source}
                    onChange={this.onChangeKnowledgeSource}
                />
              </div>
            </div>

            <h5 className="mt-3 mb-3">Lesson Details</h5>

            <div className="form-row">
              <div className="form-group col-md-6">
                <label className="font-weight-bold">Level: </label>
                <select
                    ref="userInput"
                    required
                    className="form-control"
                    value={this.state.level}
                    onChange={this.onChangeLevel}
                >
                  {this.state.levelOpt.map(function (level) {
                    return (
                        <option key={level} value={level}>
                          {level}
                        </option>
                    );
                  })}
                </select>
              </div>
              <div className="form-group col-md-6">
                <label className="font-weight-bold">Difficulty: </label>
                <select
                    ref="userInput"
                    required
                    className="form-control"
                    value={this.state.difficulty}
                    onChange={this.onChangeDifficulty}
                >
                  {this.state.difficultyOpt.map(function (difficulty) {
                    return (
                        <option key={difficulty} value={difficulty}>
                          {difficulty}
                        </option>
                    );
                  })}
                </select>
              </div>
            </div>

            <div className="form-row">
              <div className="form-group col-md-6">
                <label className="font-weight-bold">
                  Title (Indigenous Language):{" "}
                </label>
                <input
                    type="text"
                    required
                    className="form-control"
                    placeholder={this.state.title_cree}
                    value={this.state.title_cree}
                    onChange={this.onChangeTitleCree}
                />
              </div>
              <div className="form-group col-md-6">
                <label className="font-weight-bold">Title (English): </label>
                <input
                    type="text"
                    required
                    className="form-control"
                    placeholder={this.state.title_eng}
                    value={this.state.title_eng}
                    onChange={this.onChangeTitleEng}
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group col-md-6">
                <label className="font-weight-bold">
                  Topic (Indigenous Language):{" "}
                </label>
                <input
                    type="text"
                    required
                    className="form-control"
                    placeholder={this.state.topic_cree}
                    value={this.state.topic_cree}
                    onChange={this.onChangeTopicCree}
                />
              </div>
              <div className="form-group col-md-6">
                <label className="font-weight-bold">Topic (English): </label>
                <input
                    type="text"
                    required
                    className="form-control"
                    placeholder={this.state.topic_eng}
                    value={this.state.topic_eng}
                    onChange={this.onChangeTopicEng}
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group col-md-6">
                <label className="font-weight-bold">
                  Description (Indigenous Language)
                </label>
                <textarea
                    type="text"
                    rows="6"
                    required
                    className="form-control"
                    placeholder={this.state.intro_cree}
                    value={this.state.intro_cree}
                    onChange={this.onChangeIntroCree}
                />
              </div>
              <div className="form-group col-md-6">
                <label className="font-weight-bold">Description (English)</label>
                <textarea
                    type="text"
                    rows="6"
                    required
                    className="form-control"
                    placeholder={this.state.intro_eng}
                    value={this.state.intro_eng}
                    onChange={this.onChangeIntroEng}
                />
              </div>
            </div>

            {this.state.lesson_id === "newLesson" &&
            <button
              className="btn btn-dark"
              onClick={this.saveLesson.bind(this, "stay")}
              > Add Audio
            </button>}

            {this.state.lesson_id !== "newLesson" &&
            <MediaSection
                onChangeFile={this.onChangeAudio}
                downloadMediaAPICall={this.downloadAudio}
                deleteMediaAPICall={this.deleteAudio}
                reloadPageAfterDelete={true}
                title="Audio"
                allowedType={["mp3"]}
            >
              {this.state.audio}
            </MediaSection>
            }

            <h5 className="mt-3 mb-3">Lesson Flow</h5>

            <p>
              The lesson flow is composed by content pages and questions, which can
              be combined and ordered freely.
            </p>

            <div className="form-row ">
              <div className="form-group col-sl-2">
                <button
                    name={"Content Page"}
                    className="btn btn-outline-dark"
                    onClick={this.onClickNewContent}
                >
                  New Content Page
                </button>
              </div>
              <div className="form-group ml-2">
                <button
                    name={"Multiple Choice Question"}
                    className="btn btn-outline-dark"
                    onClick={this.onClickNewContent}
                >
                  New Question
                </button>
              </div>
            </div>

      {this.state.pages.length > 0 &&
        <div className="form-group mt-4 ml-5 mr-5">
          <table className="table table-striped table-hover table-bordered">
            <thead className="thead-dark">
              <tr>
                <th scope="col" width="130">
                  Display Order
                </th>
                <th scope="col">Name</th>
                <th scope="col">Page Type</th>
                <th scope="col">Options</th>
              </tr>
            </thead>
            <tbody>
              {this.state.pages.map((val, idx) => {
                return (
                  <tr key={idx}>
                    <td onClick={() => this.onClickEdit({target:{id:idx, value:val.pg_id}})}>
                      <input
                        type="text"
                        required
                        id={idx}
                        className="form-control text-center"
                        placeholder={val.pg_display_order}
                        value={val.pg_display_order}
                        onChange={this.onChangeDisplayOrder}
                      />
                    </td>
                    <td onClick={() => {this.onClickEdit({target:{id:idx, value:val.pg_id}})}}>{val.pg_table_name}</td>
                    <td onClick={() => {this.onClickEdit({target:{id:idx, value:val.pg_id}})}}>{val.pg_type}</td>
                    <td>
                      <button
                        className="btn btn-outline-dark"
                        id={idx}
                        value={val.pg_id}
                        onClick={this.onClickEdit}
                      >
                        Edit
                      </button>
                      <button
                        className="btn btn-outline-dark ml-3"
                        id={idx}
                        value={val.pg_id}
                        onClick={this.onClickDelete}
                      >
                        Delete
                      </button>
                      <ConfirmDelete
                        id={this.state.deleteItemIndex}
                        show={this.state.showDeleteConfirmationModal}
                        closeModalCallback={this.closeDeleteConfirmationModal}
                        deleteFunction={this.onConfirmDelete}
                      ></ConfirmDelete>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>}

            <label style={{color: "red"}}>{this.state.errorMessage}</label>
            <div className="form-group">
              <button
                  className="btn btn-dark"
                  onClick={this.saveLesson.bind(this, "stay")}
              >
                {this.state.saveButtonText}
              </button>
            </div>
          </div>
          }
        </div>
    );
  }
}
