import React, { Component } from "react";
import Breadcrumb from "react-bootstrap/Breadcrumb";
import ConfirmDelete from "../Utils/confirmDelete.component";
import APIInterface from "./APIInterface";
import urlParser from "../Utils/parseIdsFromURL";
import { unauthorizedErrorMessage } from "../Utils/authorization";
import LoadingSpinner from "../Utils/LoadingSpinner";



export default class ContentPage extends Component {


  constructor(props) {
    super(props);

    this.onClickAdd = this.onClickAdd.bind(this);
    this.onChangeDisplayOrder = this.onChangeDisplayOrder.bind(this);
    this.onClickEdit = this.onClickEdit.bind(this);
    this.onClickDelete = this.onClickDelete.bind(this);
    this.onConfirmDelete = this.onConfirmDelete.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.closeDeleteConfirmationModal = this.closeDeleteConfirmationModal.bind(
      this
    );

    let elementsId = urlParser.ContentPageParser(window.location.href);

    this.state = {
      pg_table_name: "",
      deleteitemIndex: "",
      content: [],
      contentpg_id: elementsId.contentPage_id,
      lesson_id: elementsId.lesson_id,
      showModal: false,
      errorMessage: "",
      saveButtonText: "Save Page",
      showLoading:true,
    };
  }

  async componentDidMount() {

    if(this.state.contentpg_id !== "newContent") {
      let contentPage = await APIInterface.getElement(this.state.contentpg_id);

      if (contentPage.errorStatus === undefined) {
        contentPage.content.sort(function (a, b) {
          return a.display_order - b.display_order;
        });

        const contentPages = await APIInterface.getContentTableNames(
            contentPage.content
        );

        if (contentPages.errorStatus === undefined) {
          this.setState({
            pg_table_name: contentPage.pg_table_name,
            content: contentPages,
            showLoading: false,
          });
        } else if (contentPages.errorStatus === 401) {
          window.location = "/login";
        } else {
          this.setState({
            errorMessage: contentPages.errorMessage,
          });
        }
      } else if (contentPage.errorStatus === 401) {
        window.location = "/login";
      } else {
        this.setState({
          errorMessage: contentPage.errorMessage,
        });
      }
    } else {
      this.setState({showLoading:false});
    }
  }

  onClickAdd = async (e) => {
    let type = e.target.value;

    let saveContentResponse = this.onSubmit("new").then(async () =>{

        if(this.state.contentpg_id === "newContent"){
          this.setState({contentpg_id:saveContentResponse});
        }

      if (saveContentResponse.errorStatus === undefined) {
        let nextPageRedirect =
            "/lesson/" +
            this.state.lesson_id +
            "/contentPage/" +
            this.state.contentpg_id;

        if (type === "Text") {
          nextPageRedirect = nextPageRedirect + "/text/" + "newText" ;
        } else {
          nextPageRedirect = nextPageRedirect + "/phrase/" + "newPhrase";
        }
        window.location = nextPageRedirect;

      } else {
        if (saveContentResponse.errorStatus === 401) {
          this.setState({
            errorMessage: unauthorizedErrorMessage,
            saveButtonText: "Save Page (Login first)",
          });
          window.open("/login", "_blank");
        } else {
          this.setState({
            errorMessage: saveContentResponse.errorMessage,
            saveButtonText: "Save Page",
          });
        }
      }
    });
  };

  onChangeDisplayOrder = (e) => {
    var aux_content = this.state.content;

    if (e.target.value !== "") {
      aux_content[parseInt(e.target.id)].display_order = parseInt(
        e.target.value
      );
    } else {
      aux_content[parseInt(e.target.id)].display_order = "";
    }

    this.setState({
      content: aux_content,
    });
  };

  onClickEdit = async (e) => {
    var nextPageRedirect =
      "/lesson/" +
      this.state.lesson_id +
      "/contentPage/" +
      this.state.contentpg_id;

    if (this.state.content[e.target.id].content_type === "Text") {
      nextPageRedirect = nextPageRedirect + "/text/" + e.target.value;
    } else if (this.state.content[e.target.id].content_type === "Phrase") {
      nextPageRedirect = nextPageRedirect + "/phrase/" + e.target.value;
    }

    const saveContentResponse = await APIInterface.saveContent({
      contentPage_id: this.state.contentpg_id,
      pg_table_name: this.state.pg_table_name,
      content: this.state.content,
    });

    if (saveContentResponse.errorStatus === undefined) {
      window.location = nextPageRedirect;
    } else {
      if (saveContentResponse.errorStatus === 401) {
        this.setState({
          errorMessage: unauthorizedErrorMessage,
          saveButtonText: "Save Page (Login first)",
        });
        window.open("/login", "_blank");
      } else {
        this.setState({
          errorMessage: saveContentResponse.errorMessage,
          saveButtonText: "Save Page",
        });
      }
    }
  };

  onClickDelete = (e) => {
    this.setState({
      showModal: true,
      deleteitemIndex: e.target.id,
    });
  };

  onConfirmDelete = async (elementId) => {
    this.setState({
      showModal: false,
      deleteitemIndex: undefined,
    });

    const saveContentResponse = await APIInterface.saveContent({
      contentPage_id: this.state.contentpg_id,
      pg_table_name: this.state.pg_table_name,
      content: this.state.content,
    });

    if (saveContentResponse.errorStatus === undefined) {
      const deleteContentResponse = await APIInterface.deleteContent({
        content_type: this.state.content[elementId].content_type,
        content_id: this.state.content[elementId].content_id,
      });

      if (deleteContentResponse.errorStatus === undefined) {
        window.location =
          "/lesson/" +
          this.state.lesson_id +
          "/contentPage/" +
          this.state.contentpg_id;
      } else {
        if (deleteContentResponse.errorStatus === 401) {
          this.setState({
            errorMessage: unauthorizedErrorMessage,
            saveButtonText: "Save Page (Login first)",
          });
          window.open("/login", "_blank");
        } else {
          this.setState({
            errorMessage: deleteContentResponse.errorMessage,
            saveButtonText: "Save Page",
          });
        }
      }
    } else {
      if (saveContentResponse.errorStatus === 401) {
        this.setState({
          errorMessage: unauthorizedErrorMessage,
          saveButtonText: "Save Page (Login first)",
        });
        window.open("/login", "_blank");
      } else {
        this.setState({
          errorMessage: saveContentResponse.errorMessage,
          saveButtonText: "Save Page",
        });
      }
    }
  };

  closeDeleteConfirmationModal = () => {
    this.setState({
      showModal: false,
    });
  };

  onChangePgTblName = (e) => {
    this.setState({
      pg_table_name: e.target.value,
    });
  };

  async onSubmit(redirect) {

    let saveContentResponse;
    let contentPage = {
      contentPage_id: this.state.contentpg_id,
      pg_table_name: this.state.pg_table_name,
      content: this.state.content,
      lesson_id: this.state.lesson_id,
    }

    if(this.state.contentpg_id === "newContent"){
      saveContentResponse = await APIInterface.addContentPage(contentPage)
      this.setState({contentpg_id:saveContentResponse})
      if(redirect !== "new") {
        window.location = "/lesson/" + this.state.lesson_id + "/contentPage/" + this.state.contentpg_id;
      }
    } else {
      saveContentResponse = await APIInterface.saveContent(contentPage);
    }

    if (saveContentResponse.errorStatus === undefined) {
      console.log(`Content Page Successfully Saved`)
    } else {
      if (saveContentResponse.errorStatus === 401) {
        this.setState({
          errorMessage: unauthorizedErrorMessage,
          saveButtonText: "Save Page (Login first)",
        });
        window.open("/login", "_blank");
      } else {
        this.setState({
          errorMessage: saveContentResponse.errorMessage,
          saveButtonText: "Save Page",
        });
      }
    }

   return saveContentResponse;
  }

  render() {
    return (
      <div className="ml-3 mr-4">
        {this.state.showLoading &&
            <LoadingSpinner top={'50%'} left={'50%'}/>
        }

          {!this.state.showLoading &&
          <div>
          <Breadcrumb>
            <Breadcrumb.Item href="/">Home</Breadcrumb.Item>
            <Breadcrumb.Item href={`/lesson/${this.state.lesson_id}`}>
              Lesson
            </Breadcrumb.Item>
            <Breadcrumb.Item active>Content Page</Breadcrumb.Item>
          </Breadcrumb>
          <h3 className="mb-4">{this.state.pg_table_name || "New Content Page"}</h3>
          <div className="form-group">
            <button
              className="btn btn-outline-dark"
              value={"Text"}
              onClick={this.onClickAdd}
            >
              Add Text/Story
            </button>
            <button
              className="btn btn-outline-dark ml-3"
              value={"Phrase"}
              onClick={this.onClickAdd}
            >
              Add Phrase
            </button>
          </div>
            {this.state.content.length > 0 &&
            <table className="table table-striped table-hover table-bordered mt-4 mb-4">
              <thead className="thead-dark">
              <tr>
                <th scope="col" width="130">
                  Display Order
                </th>
                <th scope="col">Name</th>
                <th scope="col" width="200">
                  Type
                </th>
                <th scope="col" width="200">
                  Options
                </th>
              </tr>
              </thead>
              <tbody>
              {this.state.content.map((val, idx) => {
                return (
                    <tr key={idx}>
                      <td>
                        <input
                            type="text"
                            required
                            id={idx}
                            className="form-control text-center"
                            placeholder={val.display_order}
                            value={val.display_order}
                            onChange={this.onChangeDisplayOrder}
                        />
                      </td>
                      <td onClick={() => this.onClickEdit({
                        target: {
                          id: idx,
                          value: val.content_id
                        }
                      })}>{val.cnt_table_name}</td>
                      <td onClick={() => this.onClickEdit({target: {id: idx, value: val.content_id}})}>
                        {val.content_type === "Text"
                            ? "Text/Story"
                            : val.content_type}
                      </td>
                      <td>
                        <button
                            className="btn btn-outline-dark"
                            id={idx}
                            value={val.content_id}
                            onClick={this.onClickEdit}
                        >
                          Edit
                        </button>
                        <button
                            className="btn btn-outline-dark ml-3 "
                            id={idx}
                            value={val.content_id}
                            onClick={this.onClickDelete}
                        >
                          Delete
                        </button>
                        <ConfirmDelete
                            id={this.state.deleteitemIndex}
                            show={this.state.showModal}
                            closeModalCallback={this.closeDeleteConfirmationModal}
                            deleteFunction={this.onConfirmDelete}
                        ></ConfirmDelete>
                      </td>
                    </tr>
                );
              })}
              </tbody>
            </table>
            }
        <div className="form-group ">
          <label className="font-weight-bold">
            Name (to be displayed on the lesson page table)
          </label>
          <input
            type="text"
            required
            className="form-control col-md-4"
            placeholder={this.state.pg_table_name}
            value={this.state.pg_table_name}
            onChange={this.onChangePgTblName}
          />
        </div>
        <div className="form-group">
          <button className="btn btn-dark" onClick={this.onSubmit}>
            {this.state.saveButtonText}
          </button>
        </div>
        <label style={{ color: "red" }}>{this.state.errorMessage}</label>
      </div>}
      </div>
    );
  }
}
