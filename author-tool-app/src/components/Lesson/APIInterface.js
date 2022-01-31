import axios from "axios";
import { getAuthorizationHeadersObject } from "../Utils/authorization";

async function getAllLessons() {
  const getLessonsUrl = process.env.REACT_APP_BACKEND_LESSON_URI;

  let lessonsResponse;
  try {
    lessonsResponse = await axios.request({
      method: "GET",
      url: getLessonsUrl,
      headers: getAuthorizationHeadersObject().headers,
    });
  } catch (error) {
    return {
      errorStatus: error.response.status,
      errorMessage: "Ops, something went wrong. Please, refresh your page.",
    };
  }

  const lessons = lessonsResponse.data;
  return lessons;
}

async function addLesson(lesson) {
  const addLessonUrl = process.env.REACT_APP_BACKEND_LESSON_URI + "add";

  try {
    const response = await axios.post(
      addLessonUrl,
      lesson,
      getAuthorizationHeadersObject()
    );
    return response.data;
  } catch (error) {
    return {
      errorStatus: error.response.status,
      errorMessage: "Ops, something went wrong. Please, refresh your page.",
    };
  }
}

async function deleteLesson(lessonId) {
  let deleteURL = process.env.REACT_APP_BACKEND_LESSON_URI + lessonId;

  try {
    let deleteResponse = await axios.request({
      method: "DELETE",
      url: deleteURL,
      headers: getAuthorizationHeadersObject().headers,
    });
    return deleteResponse;
  } catch (error) {
    return {
      errorStatus: error.response.status,
    };
  }
}

async function getElement(elementId) {
  let lessonGetUrl = process.env.REACT_APP_BACKEND_LESSON_URI + elementId;

  let lessonAPIResponse;
  try {
    lessonAPIResponse = await axios.request({
      method: "GET",
      url: lessonGetUrl,
      headers: getAuthorizationHeadersObject().headers,
    });
  } catch (error) {
    return {
      errorStatus: error.response.status,
      errorMessage: "Ops, something went wrong. Please, refresh your page.",
    };
  }

  let lesson = lessonAPIResponse.data;
  return lesson;
}

async function getContentTableNames(pagesArray) {
  let newPagesArray = pagesArray;
  for (var i = 0; i < pagesArray.length; i++) {
    let contentCallURL;
    if (pagesArray[i].pg_type === "Content Page") {
      contentCallURL =
        process.env.REACT_APP_BACKEND_CONTENT_PAGE_URI + pagesArray[i].pg_id;
    } else if (pagesArray[i].pg_type === "Multiple Choice Question") {
      contentCallURL =
        process.env.REACT_APP_BACKEND_MC_QUESTION_URI + pagesArray[i].pg_id;
    }
    try {
      let content = await axios.request({
        method: "GET",
        url: contentCallURL,
        headers: getAuthorizationHeadersObject().headers,
      });
      newPagesArray[i].pg_table_name = content.data.pg_table_name;
    } catch (error) {
      return {
        errorStatus: error.response.status,
        errorMessage: "Ops, something went wrong. Please, try again.",
      };
    }
  }
  return newPagesArray;
}

function updateLessonRequestObject(lessonObject) {
  const data = new FormData();
  data.append("audio", lessonObject.audioFile);
  data.append("title_cree", lessonObject.title_cree);
  data.append("title_eng", lessonObject.title_eng);
  data.append("intro_cree", lessonObject.intro_cree);
  data.append("intro_eng", lessonObject.intro_eng);
  data.append("topic_cree", lessonObject.topic_cree);
  data.append("topic_eng", lessonObject.topic_eng);
  data.append("location", lessonObject.location);
  data.append("dialect", lessonObject.dialect);
  data.append("knowledge_source", lessonObject.knowledge_source);
  data.append("level", lessonObject.level);
  data.append("difficulty", lessonObject.difficulty);
  data.append("pages", JSON.stringify(lessonObject.pages));
  return data;
}

async function updateElement(props) {
  let updateLesonURL =
    process.env.REACT_APP_BACKEND_LESSON_URI +
    "update/" +
    props.fullElement.lesson_id;
  let requestBody = updateLessonRequestObject(props.fullElement);

  try {
    let updateResponse = await axios.post(
      updateLesonURL,
      requestBody,
      getAuthorizationHeadersObject()
    );
    return updateResponse;
  } catch (error) {
    return {
      errorStatus: error.response.status,
      errorMessage: "Ops, something went wrong. Please, try again.",
    };
  }
}

function getContentBaseURL(contentType) {
  if (contentType === "Content Page") {
    return process.env.REACT_APP_BACKEND_CONTENT_PAGE_URI;
  } else if (contentType === "Multiple Choice Question") {
    return process.env.REACT_APP_BACKEND_MC_QUESTION_URI;
  }
}

async function createContent(lessonId, contentType) {
  let createURL = getContentBaseURL(contentType) + "add";
  const requestBody = { lesson_id: lessonId };

  try {
    let createResponse = await axios.post(
      createURL,
      requestBody,
      getAuthorizationHeadersObject()
    );
    return createResponse;
  } catch (error) {
    return {
      errorStatus: error.response.status,
      errorMessage: "Ops, something went wrong. Please, try again.",
    };
  }
}

async function deleteContent(contentId, contentType) {
  let deleteURL = getContentBaseURL(contentType) + contentId;

  try {
    let deleteResponse = await axios.request({
      method: "DELETE",
      url: deleteURL,
      headers: getAuthorizationHeadersObject().headers,
    });
    return deleteResponse;
  } catch (error) {
    return {
      errorStatus: error.response.status,
    };
  }
}

function getAudioFileURL(props) {
  return (
    process.env.REACT_APP_BACKEND_LESSON_URI +
    "media/audio/" +
    props.element_id
  );
}

async function downloadAudio(props) {
  return await downloadMedia(props, "Audio");
}

async function downloadMedia(props, mediaType) {
  let downloadAudioURL = getAudioFileURL(props);

  try {
    let fileResponse = await axios.request({
      method: "GET",
      url: downloadAudioURL,
      headers: getAuthorizationHeadersObject().headers,
      responseType: "blob",
    });
    return fileResponse;
  } catch (error) {
    return {
      errorStatus: error.response.status,
    };
  }
}

async function deleteAudio(props) {
  return await deleteMedia(props, "Audio");
}

async function deleteMedia(props, mediaType) {
  let deleteAudioURL = getAudioFileURL(props);

  try {
    let deleteResponse = await axios.request({
      method: "DELETE",
      url: deleteAudioURL,
      headers: getAuthorizationHeadersObject().headers,
    });
    return deleteResponse;
  } catch (error) {
    return {
      errorStatus: error.response.status,
    };
  }
}

async function changePublished(props){
  try{
    let publishURL = process.env.REACT_APP_BACKEND_LESSON_URI + 'publish/' + props.lesson_id;
    console.log(`Was Called to publish: ${JSON.stringify(props)}`);
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
  getAllLessons,
  addLesson,
  deleteLesson,
  getElement,
  getContentTableNames,
  updateElement,
  createContent,
  deleteContent,
  downloadAudio,
  changePublished,
  deleteAudio,
};
