import React, {Component} from "react";
import {unauthorizedErrorMessage} from "../../Utils/authorization";
import Breadcrumb from "react-bootstrap/Breadcrumb";
import ConfirmDelete from "../../Utils/confirmDelete.component";
import APIInterface from "./APIInterface";
import LoadingSpinner from "../../Utils/LoadingSpinner";

const TableHeaderStyle = {
    cursor: "pointer",
    position: "relative",
};

/**
 * The component that manages the Language Definitions to be used in the Learner App UI
 */
export default class LanguageManagement extends Component {

    constructor(props) {
        super(props);
        this.onClickAddLanguageSpec = this.onClickAddLanguageSpec.bind(this)
        this.onClickEditLanguageSpec = this.onClickEditLanguageSpec.bind(this)
        this.onClickDeleteLanguageSpec = this.onClickDeleteLanguageSpec.bind(this)
        this.onConfirmDelete = this.onConfirmDelete.bind(this);
        this.closeDeleteConfirmationModal = this.closeDeleteConfirmationModal.bind(this);
        this.sortBy = this.sortBy.bind(this);

        /**
         *  languages: The list of languages that is hosted in the database
         *  showDeleteConfirmationModal: Show the confirmation window for deleting a language true/false
         *  addLanguageButtonText: What text should be displayed on the Language Button?
         *  deleteItemIndex: The Index in the array of languages the item to delete
         */
        this.state = {
            languages:[],
            showDeleteConfirmationModal:false,
            addLanguageButtonText: "Add Language",
            deleteItemIndex: undefined,
            showLoading:true,
            sortBy:"",
            sortDirection:""
        }
    }

    /**
     * When the Component mounts, get all of the languages we know of, and redirect to login if unauthorized
     * @return {Promise<void>}
     */
    async componentDidMount() {
        const languages = await APIInterface.getAllLanguages();
        if(languages.errorStatus === undefined){
            this.setState({
                languages:languages.data,
                showLoading:false
            });
        } else if (languages.errorStatus === 401){
            window.location = "/login";
            console.error(`COULD NOT GET ALL LANGUAGES: ${languages.errorMessage}`);
        } else if(languages.errorStatus === 403){
            window.location = "/home";
            console.error(`COULD NOT GET ALL LANGUAGES: ${languages.errorMessage}`);
        } else {
            alert();
            console.error(`COULD NOT GET ALL LANGUAGES: ${languages.errorMessage}`);
            window.location = "/login";
        }
    }

    /**
     * Go to the "New Language" page to define a language on click
     * @param lang - Unused...
     * @return {Promise<void>}
     */
    onClickAddLanguageSpec = async (lang) => {
        this.setState({addLanguageButtonText: "Please Wait..."})
        window.location = window.location + '/newLanguage';
    }

    /**
     * Go to the page to edit a language
     * @return {Promise<void>}
     */
    onClickEditLanguageSpec = async (e) => {
        this.setState({addLanguageButtonText: "Please Wait..."})
        window.location = window.location + `/${e.target.value}`;
    }

    /**
     * Delete the selected language
     * @param e
     * @return {Promise<void>}
     */
    onClickDeleteLanguageSpec = async (e) => {
        this.setState({
            showDeleteConfirmationModal:true,
            deleteItemIndex: e.target.id
        });
    }

    /**
     * Close the delete confirmation window
     */
    closeDeleteConfirmationModal = () => {
        this.setState({
            showDeleteConfirmationModal: false,
            deleteItemIndex: undefined,
        });
    };

    /**
     * Execute the actual delete
     * @param languageId - the ID of the language to delete
     * @return {Promise<void>}
     */
    onConfirmDelete = async (languageId) => {
        this.setState({
            showDeleteConfirmationModal: false,
        });

        const deleteLanguage = await APIInterface.deleteLanguage(languageId)

        if (deleteLanguage.errorStatus === undefined) {
            window.location = "/languageManagement";
        } else if (deleteLanguage.errorStatus === 401) {
            window.location = "/home";
            this.setState({
                errorMessage: unauthorizedErrorMessage,
                addLanguageButtonText: "Add Language",
            });
        } else {
            this.setState({
                errorMessage: deleteLanguage.errorMessage,
            });
        }
    };

    sortBy = () => {
        let order = this.state.sortDirection === "asc" ? "desc" : "asc";
        let orderedLangs = this.state.languages;
        if(order === "asc"){
            orderedLangs.sort((a,b) => (a.published && !b.published ? 1 : -1));
        } else {
            orderedLangs.sort((a,b) => (a.published && !b.published ? -1 : 1));
        }

        this.setState({
            languages:orderedLangs,
            sortDirection: order,
        });
    }

    render(){
        return(
            <div className="ml-3 mr-4">

                {this.state.showLoading &&
                    <LoadingSpinner top={'50%'} left={'50%'}/>
                }
                {!this.showLoading &&
                <div>

                    <Breadcrumb>
                        <Breadcrumb.Item active>Manage Languages</Breadcrumb.Item>
                    </Breadcrumb>
                    <h3 className="mb-4">Languages</h3>
                    <label style={{color: "red"}}>{this.state.errorMessage}</label>
                    <div className="form-group">
                        <button className="btn btn-outline-dark" onClick={this.onClickAddLanguageSpec}>
                            {this.state.addLanguageButtonText}
                        </button>
                    </div>
                    <div className="form-group">
                        {this.state.languages?.length > 0 &&
                        <table className="table table-striped table-bordered table-hover">
                            <thead className="thead-dark">
                            <tr>
                                <th scope="col"
                                    style={TableHeaderStyle}
                                >
                                    <span>Language Name</span>
                                </th>
                                <th scope="col" style={TableHeaderStyle}>
                                    <span>Location</span>
                                </th>
                                <th scope="col" style={TableHeaderStyle}>
                                    <span>Author</span>
                                </th>
                                <th scope="col" sytle={TableHeaderStyle}
                                onClick={this.sortBy}>
                                    <span>Published</span>
                                    <span> {this.state.sortDirection === "asc" ? "^" : "v"}</span>
                                </th>
                                <th scope="col" style={TableHeaderStyle}>
                                    <span>Options</span>
                                </th>
                            </tr>
                            </thead>
                            <tbody>
                            {this.state.languages.map((val, idx) => {
                                return (
                                    <tr key={idx}>
                                        <td onClick={() => this.onClickEditLanguageSpec({
                                            target: {
                                                id: val._id,
                                                value: val._id
                                            }
                                        })}>{val.name}</td>
                                        <td onClick={() => this.onClickEditLanguageSpec({
                                            target: {
                                                id: val._id,
                                                value: val._id
                                            }
                                        })}>{val.location}</td>
                                        <td onClick={() => this.onClickEditLanguageSpec({
                                            target: {
                                                id: val._id,
                                                value: val._id
                                            }
                                        })}>{val.author}</td>
                                        <td onClick={() => this.onClickEditLanguageSpec({
                                            target: {
                                                id: val._id,
                                                value: val._id
                                            }
                                        })}>{val.published === true ? "Yes":"No"}</td>
                                        <td>
                                            <button
                                                className="btn btn-outline-dark"
                                                onClick={this.onClickEditLanguageSpec}
                                                id={val._id}
                                                value={val._id}
                                            >
                                                Edit
                                            </button>

                                            <button
                                                className="btn btn-outline-dark ml-3"
                                                onClick={this.onClickDeleteLanguageSpec}
                                                id={val._id}
                                                value={val.author}
                                            >
                                                Delete
                                            </button>

                                            <ConfirmDelete
                                                id={this.state.deleteItemIndex}
                                                show={this.state.showDeleteConfirmationModal}
                                                closeModalCallback={this.closeDeleteConfirmationModal}
                                                deleteFunction={this.onConfirmDelete}/>
                                        </td>
                                    </tr>
                                )
                            })}
                            </tbody>
                        </table>
                        }
                    </div>
                </div>
                }
            </div>
        )
    }
}
