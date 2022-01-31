import axios from 'axios'
import {getAuthorizationHeadersObject} from "../../Utils/authorization";
import {AdventurePage, LessonPage, SearchPage, SettingsPage, SideMenu, WelcomePage} from "./LanguageSpec";

/**
 * Calls for the addition of a new language to the database
 * @param newLanguage - The language to add
 * @return {Promise<{errorMessage: string, errorStatus: ((code: number) => any) | number}|AxiosResponse<any>>}
 */
async function addLanguage(newLanguage){
    let addLanguageUrl = process.env.REACT_APP_BACKEND_ACCESS_CONTROL_URI + 'languages/add';
    let newLangBody = {
        name:newLanguage.name,
        location:newLanguage.location,
        author:newLanguage.author,
        knowledge_source:newLanguage.knowledge_source,
        side_menu:newLanguage.side_menu,
        welcome_page:newLanguage.welcome_page,
        lesson_page:newLanguage.lesson_page,
        search_page:newLanguage.search_page,
        settings_page:newLanguage.settings_page,
        adventure_page:newLanguage.adventure_page
    }

    try{
        return (await axios.post(
            addLanguageUrl,
            newLangBody,
            getAuthorizationHeadersObject()
        )).data;
    } catch (error){
        return {
            errorStatus: error.response.status,
            errorMessage: `Error: ${error.response.data}`
        }
    }
}

/**
 * Calls for the update of an existing language to be the given language
 * @param existingLanguage - the language that was modified.
 * @return {Promise<{errorMessage: string, errorStatus: ((code: number) => any) | number}|AxiosResponse<any>>}
 */
async function updateLanguage(existingLanguage){
    let updateLanguageUrl = process.env.REACT_APP_BACKEND_ACCESS_CONTROL_URI + "languages/update/" + existingLanguage._id

    let langBody = {
        name:existingLanguage.name,
        location:existingLanguage.location,
        author:existingLanguage.author,
        knowledge_source:existingLanguage.knowledge_source,
        side_menu:existingLanguage.side_menu,
        welcome_page:existingLanguage.welcome_page,
        lesson_page:existingLanguage.lesson_page,
        search_page:existingLanguage.search_page,
        settings_page:existingLanguage.settings_page,
        adventure_page:existingLanguage.adventure_page
    }

    try {
      return await axios.post(
          updateLanguageUrl,
          langBody,
          getAuthorizationHeadersObject()
      );
    } catch (error){
        return {
            errorStatus: error.response.status,
            errorMessage: `Error: ${error.response.data}`
        }
    }
}

/**
 * Calls for the retrieval of a single language
 * @param languageId - the ID of the language to get.
 * @return {Promise<{errorMessage: string, errorStatus: ((code: number) => any) | number}|AxiosResponse<any>>}
 */
async function getLanguage(languageId){
    let getLanguageUrl = process.env.REACT_APP_BACKEND_ACCESS_CONTROL_URI + "languages/" + languageId
    try {
        return await axios.get(getLanguageUrl,getAuthorizationHeadersObject())
    } catch (error){
        return{
            errorStatus: error.response.status,
            errorMessage: `Error: ${error.response.data}`
        }
    }
}

/**
 * calls for the retrieval all of the languages
 * @var verbosity - set to low for this use case.
 * @return {Promise<{errorMessage: string, errorStatus: ((code: number) => any) | number}|AxiosResponse<any>>}
 */
async function getAllLanguages(){
    let getLanguagesUrl = process.env.REACT_APP_BACKEND_ACCESS_CONTROL_URI + "languages"
    try {

        let header = getAuthorizationHeadersObject()
        header.headers['verbosity'] = 'low';
        return await axios.request({
            method: "GET",
            url: getLanguagesUrl,
            headers: header.headers
        });

    } catch (error){
        return {
            errorStatus: error.response.status,
            errorMessage: `Error: ${error.response.data}`
        }
    }
}

/**
 * Calls for the deletion a language
 * @param langId - the ID of the language to delete.
 * @return {Promise<{errorMessage: string, errorStatus: ((code: number) => any) | number}|AxiosResponse<any>>}
 */
async function deleteLanguage(langId){
    let deleteUrl = process.env.REACT_APP_BACKEND_ACCESS_CONTROL_URI + "languages/" + langId

    try{
        return await axios.request({
            method: 'DELETE',
            url: deleteUrl,
            headers: getAuthorizationHeadersObject().headers
        });
    } catch (error){
        return {
            errorStatus: error.response.status,
            errorMessage: `Error: ${error.response.data}`
        }
    }
}


async function changePublished(props){
    try{
        let publishURL = process.env.REACT_APP_BACKEND_ACCESS_CONTROL_URI+ 'languages/publish/' + props.lang_id;
        return (await axios.post(
            publishURL,
            props,
            getAuthorizationHeadersObject()
        )).data;

    }catch (error){
        console.error(`FAILED TO CHANGE PUBLISH: ${JSON.stringify(error)}`);
        return{
            errorStatus: error.response.status,
            errorMessage: error.response
        }
    }
}


export default {
    addLanguage,
    getAllLanguages,
    deleteLanguage,
    getLanguage,
    updateLanguage,
    changePublished,
}