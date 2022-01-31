import axios from "axios";
import { getAuthorizationHeadersObject } from "../Utils/authorization";

function updateQuestionRequestObject(question) {
  let originalFilename = "";
  if (question.instructions.audio !== undefined)
    originalFilename = question.instructions.audio.file_name;

  const data = new FormData();
  data.append("audio", question.audioFile);
  data.append("originalFilename", originalFilename);
  data.append("pg_table_name", question.pg_table_name);
  data.append("instructions", JSON.stringify(question.instructions));
  data.append("options", JSON.stringify(question.options));

  return data;
}

async function updateQuestion(props) {
  let updateQuestionURL =
    process.env.REACT_APP_BACKEND_MC_QUESTION_URI +
    "update/" +
    props.question.question_id;
  let requestBody = updateQuestionRequestObject(props.question);

  try {
    let updateResponse = await axios.post(
      updateQuestionURL,
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

async function addQuestion(props) {
  let addQuestionUrl = process.env.REACT_APP_BACKEND_MC_QUESTION_URI + "add"
  let questionBody = {
    pg_table_name:props.pg_table_name,
    instructions:props.instructions,
    options:props.options,
    lesson_id: props.lesson_id,
  }

  try{
    return (await axios.post(addQuestionUrl, questionBody, getAuthorizationHeadersObject())).data
  } catch(error) {
    return {
      errorStatus: error.response.status,
      errorMessage: "Ops, something went wrong. Please, try again.",
    };  }

}

async function getQuestion(props) {
  let getQuestionURL =
    process.env.REACT_APP_BACKEND_MC_QUESTION_URI + props.question_id;

  let questionResponse;
  try {
    questionResponse = await axios.request({
      method: "GET",
      url: getQuestionURL,
      headers: getAuthorizationHeadersObject().headers,
    });
  } catch (error) {
    return {
      errorStatus: error.response.status,
      errorMessage: "Ops, something went wrong. Please, refresh your page.",
    };
  }

  let question = questionResponse.data;
  if (question.instructions === undefined) {
    question.instructions = {
      text_cree: "",
      text_eng: "",
    };
  }

  return question;
}

async function downloadAudio(props) {
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

function getAudioFileURL(props) {
  const baseURL =
    process.env.REACT_APP_BACKEND_MC_QUESTION_URI +
    "media/audio/" +
    props.question_id;
  if (props.option_id === undefined) {
    return baseURL;
  } else {
    return baseURL + "/" + props.option_id;
  }
}

function updateOptionRequestObject(props) {

  let originalFilename = "";
  if (props.option.audio !== undefined)
    originalFilename = props.option.audio.file_name;

  const data = new FormData();
  data.append("audio", props.audioFile);
  data.append("originalFilename", originalFilename);
  data.append("option", JSON.stringify(props.option));

  return data;
}

async function updateAnswerOption(props) {
  let updateQuestionURL =
    process.env.REACT_APP_BACKEND_MC_QUESTION_URI +
    "update/" +
    props.question_id +
    "/answerOption/";

  //Note - this appears to be an empty body... Same for props. I'm unsure of why - this is just how it is...
  let requestBody = updateOptionRequestObject(props);


  try {
    let updateResponse = await axios.post(
      updateQuestionURL,
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

export default {
  getQuestion,
  addQuestion,
  updateQuestion,
  downloadAudio,
  deleteAudio,
  updateAnswerOption,
};
