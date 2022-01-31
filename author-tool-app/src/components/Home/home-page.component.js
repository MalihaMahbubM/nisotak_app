import React, { Component } from "react";
import Breadcrumb from "react-bootstrap/Breadcrumb";
import ConfirmDelete from "../Utils/confirmDelete.component";
import LessonAPIInterface from "../Lesson/APIInterface";
import { unauthorizedErrorMessage } from "../Utils/authorization";
import LoadingSpinner from "../Utils/LoadingSpinner";

const TableHeaderStyle = {
  cursor: "pointer",
  position: "relative",
};

const OrderIconStyle = {
  position: "absolute",
  right: "20px",
  fontWeight: "lighter",
};

export default class HomePage extends Component {
  constructor(props) {
    super(props);

    this.onClickAddLesson = this.onClickAddLesson.bind(this);
    this.onClickEdit = this.onClickEdit.bind(this);
    this.onClickDelete = this.onClickDelete.bind(this);
    this.onConfirmDelete = this.onConfirmDelete.bind(this);
    this.closeDeleteConfirmationModal = this.closeDeleteConfirmationModal.bind(
        this
    );
    this.onChangeSearchTerm = this.onChangeSearchTerm.bind(this);
    this.onClickOrderByTitleDialect = this.onClickOrderByTitleDialect.bind(
        this
    );
    this.onClickOrderByTitleEnglish = this.onClickOrderByTitleEnglish.bind(
        this
    );
    this.onClickOrderByDialect = this.onClickOrderByDialect.bind(this);

    this.state = {
      lessons: [],
      lessonsOriginal: [],
      showDeleteConfirmationModal: false,
      addLessonButtonText: "Add Lesson",
      errorMessage: "",
      searchTerm: "",
      columnsOrder: {
        title_cree: "",
        title_eng: "",
        dialect: "",
        published:"",
      },
      deleteItemIndex: undefined,
      showLoading: true,
    };
  }

  async componentDidMount() {
    const lessons = await LessonAPIInterface.getAllLessons();

    if (lessons.errorStatus === undefined) {
      this.setState({
        lessons: lessons,
        lessonsOriginal: lessons,
        showLoading: false,
      });
    } else if (lessons.errorStatus === 401) {
      window.location = "/login";
    } else {
      this.setState({
        errorMessage: lessons.errorMessage,
      });
    }
  }

  onClickAddLesson = async () => {
    this.setState({
      addLessonButtonText: "Creating... Please, wait",
    });
    window.location = "/lesson/newLesson"
  };

  onClickEdit = (e) => {
    window.location = "/lesson/" + e.target.id;
  };

  closeDeleteConfirmationModal = () => {
    this.setState({
      showDeleteConfirmationModal: false,
      deleteItemIndex: undefined,
    });
  };

  onClickDelete = (e) => {
    this.setState({
      showDeleteConfirmationModal: true,
      deleteItemIndex: e.target.id,
    });
  };

  onConfirmDelete = async (lessonId) => {
    this.setState({
      showDeleteConfirmationModal: false,
    });

    const deleteLesson = await LessonAPIInterface.deleteLesson(lessonId);

    if (deleteLesson.errorStatus === undefined) {
      window.location = "/";
    } else if (deleteLesson.errorStatus === 401) {
      this.setState({
        errorMessage: unauthorizedErrorMessage,
        addLessonButtonText: "Add Lesson",
      });
      window.open("/login", "_blank");
    } else {
      this.setState({
        errorMessage: deleteLesson.errorMessage,
      });
    }
  };

  onChangeSearchTerm = (e) => {
    const searchTerm = e.target.value;
    if (searchTerm === "") {
      this.setState({
        lessons: this.state.lessonsOriginal,
        searchTerm: searchTerm,
        columnsOrder: {title_cree: "", title_eng: "", dialect: "", published:""},
      });
    } else {
      const filteredLessons = this.state.lessonsOriginal.filter(
          (lesson) =>
              (lesson.title_cree &&
                  lesson.title_cree
                      .toLowerCase()
                      .includes(e.target.value.toLowerCase())) ||
              (lesson.title_eng &&
                  lesson.title_eng
                      .toLowerCase()
                      .includes(e.target.value.toLowerCase())) ||
              (lesson.dialect &&
                  lesson.dialect.toLowerCase().includes(e.target.value.toLowerCase()))
      );
      this.setState({
        lessons: filteredLessons,
        searchTerm: searchTerm,
        columnsOrder: {title_cree: "", title_eng: "", dialect: "", published:""},
      });
    }
  };

  onClickOrderByTitleDialect = () => {
    const nextOrder =
        this.state.columnsOrder.title_cree === "asc" ? "desc" : "asc";
    let orderedLessons = this.state.lessons;
    if (nextOrder === "asc") {
      orderedLessons.sort((a, b) => (a.title_cree > b.title_cree ? 1 : -1));
    } else {
      orderedLessons.sort((a, b) => (a.title_cree < b.title_cree ? 1 : -1));
    }

    this.setState({
      lessons: orderedLessons,
      columnsOrder: {title_cree: nextOrder, title_eng: "", dialect: "", published:""},
    });
  };

  onClickOrderByTitleEnglish = () => {
    const nextOrder =
        this.state.columnsOrder.title_eng === "asc" ? "desc" : "asc";
    let orderedLessons = this.state.lessons;
    if (nextOrder === "asc") {
      orderedLessons.sort((a, b) => (a.title_eng > b.title_eng ? 1 : -1));
    } else {
      orderedLessons.sort((a, b) => (a.title_eng < b.title_eng ? 1 : -1));
    }

    this.setState({
      lessons: orderedLessons,
      columnsOrder: {title_cree: "", title_eng: nextOrder, dialect: "", published: ""},
    });
  };

  onClickOrderByDialect = () => {
    const nextOrder =
        this.state.columnsOrder.dialect === "asc" ? "desc" : "asc";
    let orderedLessons = this.state.lessons;
    if (nextOrder === "asc") {
      orderedLessons.sort((a, b) => (a.dialect > b.dialect ? 1 : -1));
    } else {
      orderedLessons.sort((a, b) => (a.dialect < b.dialect ? 1 : -1));
    }

    this.setState({
      lessons: orderedLessons,
      columnsOrder: {title_cree: "", title_eng: "", published:"", dialect: nextOrder},
    });
  };

  onClickOrderByPublished = () => {
    const nextOrder =
        this.state.columnsOrder.published === "asc" ? "desc" : "asc";
    let orderedLessons = this.state.lessons;
    if (nextOrder === "asc") {
      orderedLessons.sort((a, b) => (a.published && !b.published ? 1 : -1));
    } else {
      orderedLessons.sort((a, b) => (a.published && !b.published ? -1 : 1));
    }

    this.setState({
      lessons: orderedLessons,
      columnsOrder: {title_cree: "", title_eng: "", dialect:"", published: nextOrder},
    });
  }


  render() {
    return (
        <div className="ml-3 mr-4">

          {this.state.showLoading && <LoadingSpinner top={'50%'} left={'50%'}/>}

          {!this.state.showLoading &&
          <div>
            <Breadcrumb>
              <Breadcrumb.Item active>Home</Breadcrumb.Item>
            </Breadcrumb>
            <h3 className="mb-4">Lessons list</h3>

            <label style={{color: "red"}}>{this.state.errorMessage}</label>
            <div className="form-group">
              <button
                  className="btn btn-outline-dark"
                  onClick={this.onClickAddLesson}
              >
                {this.state.addLessonButtonText}
              </button>
            </div>

            <div className="form-group">
              <label style={{marginRight: "10px"}}>Filter table by term:</label>
              <input
                  type="text"
                  className="form-control"
                  placeholder={this.state.searchTerm}
                  value={this.state.searchTerm}
                  onChange={this.onChangeSearchTerm}
              ></input>
            </div>

        <table className="table table-striped table-bordered table-hover">
          <thead className="thead-dark">
            <tr>
              <th
                  scope="col"
                  onClick={this.onClickOrderByTitleDialect}
                  style={TableHeaderStyle}
              >
                <span>Title (Dialect)</span>
                <span style={OrderIconStyle}>
                  {this.state.columnsOrder.title_cree === "asc" ? "^" : "v"}
                </span>
                </th>
                <th
                    scope="col"
                    onClick={this.onClickOrderByTitleEnglish}
                    style={TableHeaderStyle}
                >
                  <span>Title (English)</span>
                  <span style={OrderIconStyle}>
                  {this.state.columnsOrder.title_eng === "asc" ? "^" : "v"}
                </span>
                </th>
                <th
                    scope="col"
                    width="250"
                    onClick={this.onClickOrderByDialect}
                    style={TableHeaderStyle}
                >
                  <span>Dialect</span>
                  <span style={OrderIconStyle}>
                  {this.state.columnsOrder.dialect === "asc" ? "^" : "v"}
                </span>
              </th>
              <th
                scope="col"
                width="150"
                onClick={this.onClickOrderByPublished}
                style={TableHeaderStyle}>
                <span>Published</span>
                <span style={OrderIconStyle}>
                  {this.state.columnsOrder.published === "asc" ? "^" : "v"}
                </span>
              </th>

              <th scope="col" width="210">
                Options
              </th>
            </tr>
            </thead>
            <tbody>
            {this.state.lessons.map((val, idx) => {
              return (
                <tr key={idx}>
                  <td onClick={() => this.onClickEdit({target:{id:val._id}})}>{val.title_cree}</td>
                  <td onClick={() => this.onClickEdit({target:{id:val._id}})}>{val.title_eng}</td>
                  <td onClick={() => this.onClickEdit({target:{id:val._id}})}>{val.dialect}</td>
                  <td onClick={() => this.onClickEdit({target:{id:val._id}})}>{val.published === true ? "Yes":"No"}</td>
                  <td>
                    <button
                      className="btn btn-outline-dark"
                      id={val._id}
                      value={val._id}
                      onClick={this.onClickEdit}
                    >
                      Edit
                    </button>
                    <button
                      className="btn btn-outline-dark ml-3"
                      id={val._id}
                      value={val._id}
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
        </div>
        }
      </div>
    );
  }
}
