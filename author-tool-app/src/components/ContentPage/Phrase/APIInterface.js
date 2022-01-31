import axios from "axios";
import { getAuthorizationHeadersObject } from "../../Utils/authorization";

async function getElement(elementId) {
  let getPhraseURL = process.env.REACT_APP_BACKEND_PHRASE_CNT_URI + elementId;

  let phraseAPIResponse;
  try {
    phraseAPIResponse = await axios.request({
      method: "GET",
      url: getPhraseURL,
      headers: getAuthorizationHeadersObject().headers,
    });
  } catch (error) {
    return {
      errorStatus: error.response.status,
      errorMessage: "Ops, something went wrong. Please, refresh your page.",
    };
  }

  let text = phraseAPIResponse.data;
  return text;
}

function updatePhraseRequestObject(phraseObject) {
  const data = new FormData();
  data.append("media", phraseObject.audioFile);
  data.append("media", phraseObject.imageFile);
  data.append("cnt_table_name", phraseObject.cnt_table_name);
  data.append("morphemes", JSON.stringify(phraseObject.morphemes));
  return data;
}


async function addElement(props){
  let addPhraseUrl = process.env.REACT_APP_BACKEND_PHRASE_CNT_URI + "add/";

  let phraseBody = {
    cnt_page_id:props.cnt_page_id,
    cnt_table_name:props.cnt_table_name,
    morphemes:props.morphemes,
  }

  try{
    return (await axios.post(
        addPhraseUrl,
        phraseBody,
        getAuthorizationHeadersObject()
    )).data
  } catch (error){
    console.error(`ERROR ADDING NEW PHRASE ${error}`);
    return {
      errorStatus:error.response.status,
      errorMessage: error.response.body
    }
  }
}

async function updateElement(props) {
  let updatePhraseURL =
    process.env.REACT_APP_BACKEND_PHRASE_CNT_URI +
    "update/" +
    props.fullElement.phrase_id;
  let requestBody = updatePhraseRequestObject(props.fullElement);
  try {
    let updateResponse = await axios.post(
      updatePhraseURL,
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

function getAudioFileURL(props) {
  return (
    process.env.REACT_APP_BACKEND_PHRASE_CNT_URI +
    "/media/audio/" +
    props.element_id
  );
}

function getImageFileURL(props) {
  return (
    process.env.REACT_APP_BACKEND_PHRASE_CNT_URI +
    "/media/image/" +
    props.element_id
  );
}

async function downloadAudio(props) {
  return await downloadMedia(props, "Audio");
}

async function downloadImage(props) {
  return await downloadMedia(props, "Image");
}

async function downloadMedia(props, mediaType) {
  let downloadAudioURL = "";
  if (mediaType === "Audio") {
    downloadAudioURL = getAudioFileURL(props);
  } else if (mediaType === "Image") {
    downloadAudioURL = getImageFileURL(props);
  }

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

async function deleteImage(props) {
  return await deleteMedia(props, "Image");
}

async function deleteMedia(props, mediaType) {
  let deleteAudioURL = "";
  if (mediaType === "Audio") {
    deleteAudioURL = getAudioFileURL(props);
  } else if (mediaType === "Image") {
    deleteAudioURL = getImageFileURL(props);
  }

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

export default {
  downloadAudio,
  downloadImage,
  deleteAudio,
  deleteImage,
  addElement,
  updateElement,
  getElement,
};
