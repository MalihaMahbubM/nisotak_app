import React, {Component} from "react";
import {Breadcrumb} from "react-bootstrap";
import {AdventurePage, LessonPage, SearchPage, SettingsPage, SideMenu, WelcomePage} from "./LanguageSpec";
import {LanguageFormCol} from "./LanguageSubComponents/Templates";
import urlParser from "../../Utils/parseIdsFromURL";
import APIInterface from "./APIInterface";
import UsersAPIInteface from "../ManageUsers/APIInterface" ;
import LoadingSpinner from "../../Utils/LoadingSpinner";

export default class LanguageDefinition extends Component{
    constructor(props) {

        let languageId = urlParser.LessonPageParser(window.location.href).lesson_id;

        super(props);
        this.state = {
            languageId:languageId,
            name:"",
            location:"",
            author:"",
            knowledge_source:"",
            published:false,
            side_menu:SideMenu,
            welcome_page:WelcomePage,
            lesson_page:LessonPage,
            search_page:SearchPage,
            settings_page:SettingsPage,
            adventure_page:AdventurePage,
            showLoading:true,
        }
    }

    async componentDidMount() {
        let isAuthorized;
        if(this.state.languageId !== "newLanguage"){
            //NOTE: The URL Parser was named poorly. It will work with more than just lessons, any url with an ID at
            //The end should work...
            isAuthorized = await APIInterface.getLanguage(this.state.languageId);
            let lang = isAuthorized.data
            this.setState(lang)
        }
        else {
            isAuthorized = await UsersAPIInteface.checkAuthorization()
        }
        if (isAuthorized.errorMessage !== undefined) {
            if (isAuthorized.errorStatus === 401) {
                window.location = '/login';
            } else {
                console.error(`${JSON.stringify(isAuthorized)}`);
            }
        }
        this.setState({showLoading:false});
    }

    /**
     * Sets the state of a base-level state item
     * @param key - the name of the object key
     * @param value - the value to assign at that key
     */
    setBaseState(key,value){
        this.setState({
            [key]:value,
        })
    }

    /**
     * Sets the state of a state item 1 layer beneath the top level
     * @param key - the key of the item to update in the sub-object
     * @param value - the value to update the sub-object to.
     * @param superkey - the base-level key of the object that holds the given key
     */
    setNestedState(key,value,superkey){
        let target = {...this.state[superkey]}
        target[key] = value;
        this.setBaseState(superkey,target)
    }

    /**
     * Saves or updates a language definition.
     * @return {Promise<void>}
     */
    saveLanguage = async () =>{
        this.setState({showLoading:true});
        let lang = this.state;
        let saveResult;

        if(this.state.languageId === "newLanguage") {
            saveResult = await APIInterface.addLanguage(lang);
            this.setState({languageId:saveResult});
        } else {
            saveResult = await APIInterface.updateLanguage(lang);
        }
        if(saveResult.errorMessage === undefined){
            window.location = "/LanguageManagement/" + this.state.languageId;
        } else if (saveResult.errorStatus === 401){
            window.location = "/login";
        } else {
            console.error(`ERROR: ${JSON.stringify(saveResult)}`)
        }

        this.setState({showLoading:false});

    }

    /**
     * Checks to see if all of the form fields have been filled out
     * @return {boolean} - true/false is filled out.
     */
    canSubmitForm(){
        let inputs = document.getElementsByTagName("input")
        for (let i = 0; i < inputs.length; i++) {
            if(inputs[i].value.length < 1){
                return false
            }
        }
        return true;
    }

    changePublish = async (doPublish) => {
        let {languageId} = this.state;
        let result = await APIInterface.changePublished({doPublish:doPublish, lang_id:languageId})
        if(result.errorStatus === undefined) {
            this.setState({published: result})
        }
        else if (result.errorStatus === 403){
            window.location = '/login'
        } else {
            console.error(`Failed to publish lesson: ${JSON.stringify(result)}`);
        }
    }

    render() {
        return(
            <div className="ml-3 mr-4">

                {this.state.showLoading && <LoadingSpinner top={'50%'} left={'50%'}/>}

                {!this.state.showLoading &&
               <div>
                    <Breadcrumb>
                        <Breadcrumb.Item href={'/LanguageManagement'}>Languages</Breadcrumb.Item>
                        <Breadcrumb.Item active>Language Definition</Breadcrumb.Item>
                    </Breadcrumb>
                    <h3 className="mb-4">{this.state.name || "New Language"}</h3>


                    {this.state.languageId !== "newLanguage" &&
                    <div align="right">
                        {this.state.published &&
                        <button
                            disabled={!this.canSubmitForm()}
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

                    <form>
                    <h5 className="mt-3 mb-3">About the Language</h5>

                    <div className="form-row">
                    <LanguageFormCol
                        placeholder='name...'
                        label="Name"
                        value={this.state.name}
                        onChange={e => this.setBaseState('name',e.target.value)}/>

                    <LanguageFormCol
                        placeholder='location...'
                        label="Location"
                        value={this.state.location}
                        onChange={e => this.setBaseState('location',e.target.value)}/>

                    <LanguageFormCol
                        placeholder='knowledge source...'
                        label="Knowledge source"
                        value={this.state.knowledge_source}
                        onChange={e => this.setBaseState('knowledge_source',e.target.value)}/>

                    </div>

                    <h5 className="mt-3 mb-3">Side Menu Items</h5>
                    <div className="form-row">
                        <LanguageFormCol
                            label="Home"
                            placeholder="home..."
                            value={this.state.side_menu.home_label}
                            onChange={e => {this.setNestedState("home_label",e.target.value,"side_menu")}}/>

                        <LanguageFormCol
                            label="Browse"
                            placeholder="browse..."
                            value={this.state.side_menu.browse_label}
                            onChange={e => {this.setNestedState("browse_label",e.target.value,"side_menu")}}/>

                        <LanguageFormCol
                            label="Search"
                            placeholder="search..."
                            value={this.state.side_menu.search_label}
                            onChange={e => {this.setNestedState("search_label",e.target.value,"side_menu")}}/>

                        <LanguageFormCol
                            label="Adventure Area"
                            placeholder="adventure area..."
                            value={this.state.side_menu.adventure_label}
                            onChange={e => {this.setNestedState("adventure_label",e.target.value,"side_menu")}}/>

                        <LanguageFormCol
                            label="Settings"
                            placeholder="settings..."
                            value={this.state.side_menu.settings_label}
                            onChange={e => {this.setNestedState("settings_label",e.target.value,"side_menu")}}/>

                        <LanguageFormCol
                            label="Help"
                            placeholder="help..."
                            value={this.state.side_menu.help_label}
                            onChange={e => {this.setNestedState("help_label",e.target.value,"side_menu")}}/>

                        <LanguageFormCol
                            label="Logout"
                            placeholder="logout..."
                            value={this.state.side_menu.logout_label}
                            onChange={e => {this.setNestedState("logout_label",e.target.value,"side_menu")}}/>
                    </div>


                    <h5 className="mt-3 mb-3">Welcome Page Items</h5>
                    <div className="form-row">

                        <LanguageFormCol
                            label="Welcome"
                            placeholder="welcome..."
                            value={this.state.welcome_page.welcome_label}
                            onChange={e => {this.setNestedState("welcome_label",e.target.value,"welcome_page")}}/>

                        <LanguageFormCol
                            label="Login"
                            placeholder="login..."
                            value={this.state.welcome_page.login_label}
                            onChange={e => {this.setNestedState("login_label",e.target.value,"welcome_page")}}/>

                        <LanguageFormCol
                            label="Username"
                            placeholder="username..."
                            value={this.state.welcome_page.username_label}
                            onChange={e => {this.setNestedState("username_label",e.target.value,"welcome_page")}}/>

                        <LanguageFormCol
                            label="Password"
                            placeholder="password..."
                            value={this.state.welcome_page.password_label}
                            onChange={e => {this.setNestedState("password_label",e.target.value,"welcome_page")}}/>

                        <LanguageFormCol
                            label="Signup"
                            placeholder="signup..."
                            value={this.state.welcome_page.signup_label}
                            onChange={e => {this.setNestedState("signup_label",e.target.value,"welcome_page")}}/>

                        <LanguageFormCol
                            label="Thank you"
                            placeholder="thank you..."
                            value={this.state.welcome_page.thank_you_label}
                            onChange={e => {this.setNestedState("thank_you_label",e.target.value,"welcome_page")}}/>

                        <LanguageFormCol
                            label="Select a Language"
                            placeholder="Select a Language..."
                            value={this.state.welcome_page.select_language_label}
                            onChange={e => {this.setNestedState("select_language_label",e.target.value,"welcome_page")}}/>

                        <LanguageFormCol
                            label="Select a Server"
                            placeholder="server..."
                            value={this.state.welcome_page.select_server_label}
                            onChange={e => {this.setNestedState("select_server_label",e.target.value,"welcome_page")}}/>

                    </div>


                    <h5 className="mt-3 mb-3">Lesson Page Items</h5>
                    <div className="form-row">

                        <LanguageFormCol
                            label="Lessons"
                            placeholder="lessons..."
                            value={this.state.lesson_page.lessons_label}
                            onChange={e => {this.setNestedState("lessons_label",e.target.value,"lesson_page")}}/>

                        <LanguageFormCol
                            label="Lesson"
                            placeholder="lesson..."
                            value={this.state.lesson_page.lesson_label}
                            onChange={e => {this.setNestedState("lesson_label",e.target.value,"lesson_page")}}/>

                        <LanguageFormCol
                            label="Begin"
                            placeholder="begin..."
                            value={this.state.lesson_page.begin_label}
                            onChange={e => {this.setNestedState("begin_label",e.target.value,"lesson_page")}}/>

                        <LanguageFormCol
                            label="Story"
                            placeholder="story..."
                            value={this.state.lesson_page.story_label}
                            onChange={e => {this.setNestedState("story_label",e.target.value,"lesson_page")}}/>

                        <LanguageFormCol
                            label="Quiz"
                            placeholder="quiz..."
                            value={this.state.lesson_page.quiz_label}
                            onChange={e => {this.setNestedState("quiz_label",e.target.value,"lesson_page")}}/>

                        <LanguageFormCol
                            label="Download"
                            placeholder="download..."
                            value={this.state.lesson_page.download_label}
                            onChange={e => {this.setNestedState("download_label",e.target.value,"lesson_page")}}/>

                        <LanguageFormCol
                            label="Previous"
                            placeholder="previous..."
                            value={this.state.lesson_page.previous_label}
                            onChange={e => {this.setNestedState("previous_label",e.target.value,"lesson_page")}}/>

                        <LanguageFormCol
                            label="Next"
                            placeholder="next..."
                            value={this.state.lesson_page.next_label}
                            onChange={e => {this.setNestedState("next_label",e.target.value,"lesson_page")}}/>

                        <LanguageFormCol
                            label="Show hint"
                            placeholder="show hint..."
                            value={this.state.lesson_page.show_hint_label}
                            onChange={e => {this.setNestedState("show_hint_label",e.target.value,"lesson_page")}}/>

                        <LanguageFormCol
                            label="Hide hint"
                            placeholder="hide hint..."
                            value={this.state.lesson_page.hide_hint_label}
                            onChange={e => {this.setNestedState("hide_hint_label",e.target.value,"lesson_page")}}/>

                        <LanguageFormCol
                            label="Return to lesson"
                            placeholder="return to lesson..."
                            value={this.state.lesson_page.return_to_lesson_label}
                            onChange={e => {this.setNestedState("return_to_lesson_label",e.target.value,"lesson_page")}}/>

                        <LanguageFormCol
                            label="Quit"
                            placeholder="quit..."
                            value={this.state.lesson_page.quit_label}
                            onChange={e => {this.setNestedState("quit_label",e.target.value,"lesson_page")}}/>

                        <LanguageFormCol
                            label="Try again"
                            placeholder="try again..."
                            value={this.state.lesson_page.try_again_label}
                            onChange={e => {this.setNestedState("try_again_label",e.target.value,"lesson_page")}}/>

                        <LanguageFormCol
                            label="Correct"
                            placeholder="correct..."
                            value={this.state.lesson_page.correct_label}
                            onChange={e => {this.setNestedState("correct_label",e.target.value,"lesson_page")}}/>

                        <LanguageFormCol
                            label="Incorrect"
                            placeholder="incorrect..."
                            value={this.state.lesson_page.incorrect_label}
                            onChange={e => {this.setNestedState("incorrect_label",e.target.value,"lesson_page")}}/>

                        <LanguageFormCol
                            label="Result"
                            placeholder="result..."
                            value={this.state.lesson_page.result_label}
                            onChange={e => {this.setNestedState("result_label",e.target.value,"lesson_page")}}/>

                        <LanguageFormCol
                            label="Show english"
                            placeholder="show english..."
                            value={this.state.lesson_page.show_english_label}
                            onChange={e => {this.setNestedState("show_english_label",e.target.value,"lesson_page")}}/>

                        <LanguageFormCol
                            label="Hide english"
                            placeholder="hide english..."
                            value={this.state.lesson_page.hide_english_label}
                            onChange={e => {this.setNestedState("hide_english_label",e.target.value,"lesson_page")}}/>

                    </div>


                    <h5 className="mt-3 mb-3">Search Page Items</h5>
                    <div className="form-row">

                    <LanguageFormCol
                        label="Advanced Search"
                        placeholder="advanced search..."
                        value={this.state.search_page.advanced_search_label}
                        onChange={e => {this.setNestedState("advanced_search_label",e.target.value,"search_page")}}/>

                    <LanguageFormCol
                        label="Hide Advanced Search"
                        placeholder="hide advanced search..."
                        value={this.state.search_page.hide_advanced_label}
                        onChange={e => {this.setNestedState("hide_advanced_label",e.target.value,"search_page")}}/>

                    <LanguageFormCol
                        label="Topic"
                        placeholder="topic..."
                        value={this.state.search_page.topic_label}
                        onChange={e => {this.setNestedState("topic_label",e.target.value,"search_page")}}/>

                    <LanguageFormCol
                        label="Title"
                        placeholder="title..."
                        value={this.state.search_page.title_label}
                        onChange={e => {this.setNestedState("title_label",e.target.value,"search_page")}}/>

                    <LanguageFormCol
                        label="Dialect"
                        placeholder="dialect..."
                        value={this.state.search_page.dialect_label}
                        onChange={e => {this.setNestedState("dialect_label",e.target.value,"search_page")}}/>

                    <LanguageFormCol
                        label="Location"
                        placeholder="location..."
                        value={this.state.search_page.location_label}
                        onChange={e => {this.setNestedState("location_label",e.target.value,"search_page")}}/>

                    <LanguageFormCol
                        label="Introduction"
                        placeholder="intro..."
                        value={this.state.search_page.intro_label}
                        onChange={e => {this.setNestedState("intro_label",e.target.value,"search_page")}}/>

                    <LanguageFormCol
                        label="Limit"
                        placeholder="limit..."
                        value={this.state.search_page.limit_label}
                        onChange={e => {this.setNestedState("limit_label",e.target.value,"search_page")}}/>
                    </div>


                    <h5 className="mt-3 mb-3">Settings Page Items</h5>
                    <div className="form-row">
                        <LanguageFormCol
                            label="Dark Mode"
                            placeholder="dark mode..."
                            value={this.state.settings_page.dark_mode_label}
                            onChange={e => {this.setNestedState("dark_mode_label",e.target.value,"settings_page")}}/>

                        <LanguageFormCol
                            label="Language"
                            placeholder="language..."
                            value={this.state.settings_page.language_label}
                            onChange={e => {this.setNestedState("language_label",e.target.value,"settings_page")}}/>
                    </div>


                    <h5 className="mt-3 mb-3">Adventure Area Items</h5>
                    <div className="form-row">

                        <LanguageFormCol
                            label="Trade"
                            placeholder="trade..."
                            value={this.state.adventure_page.trade_label}
                            onChange={e => {this.setNestedState("trade_label",e.target.value,"adventure_page")}}/>

                        <LanguageFormCol
                            label="Progress"
                            placeholder="progress"
                            value={this.state.adventure_page.progress_label}
                            onChange={e => {this.setNestedState("progress_label",e.target.value,"adventure_page")}}/>

                    </div>
                    </form>
                    <button
                        className="btn btn-dark"
                        onClick={this.saveLanguage}
                        disabled={this.canSubmitForm() === false}
                    >Save Language</button>
                    <br></br>
                    <br></br>
                    <br></br>
               </div>
               }
            </div>
        )
    }
}