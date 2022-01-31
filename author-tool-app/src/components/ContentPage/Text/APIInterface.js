import axios from "axios";
import { getAuthorizationHeadersObject } from "../../Utils/authorization";

async function getElement(elementId) {
  let getTextURL = process.env.REACT_APP_BACKEND_TEXT_CNT_URI + elementId;

  let textAPIResponse;
  try {
    textAPIResponse = await axios.request({
      method: "GET",
      url: getTextURL,
      headers: getAuthorizationHeadersObject().headers,
    });
  } catch (error) {
    return {
      errorStatus: error.response.status,
      errorMessage: "Ops, something went wrong. Please, refresh your page.",
    };
  }

  let text = textAPIResponse.data;
  return text;
}

function updateTextRequestObject(textObject) {
  const data = new FormData();
  data.append("media", textObject.audioFile);
  data.append("media", textObject.imageFile);
  data.append("cnt_table_name", textObject.cnt_table_name);
  data.append("text_cree", textObject.text_cree);
  data.append("text_english", textObject.text_english);
  return data;
}

async function updateElement(props) {
  let updateTextURL =
    process.env.REACT_APP_BACKEND_TEXT_CNT_URI +
    "update/" +
    props.fullElement.text_id;
  let requestBody = updateTextRequestObject(props.fullElement);

  try {
    let updateResponse = await axios.post(
      updateTextURL,
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

async function addElement(props){
  let addTextURL =
      process.env.REACT_APP_BACKEND_TEXT_CNT_URI +
      "add/";

  let addBody = {
    cnt_page_id: props.cnt_pg_id, // NOTE - THIS WAS NOT ME , THEY INTRODUCED THE INCONSISTANCY ORGINALLY
    text_cree: props.text_cree,
    text_english:props.text_english,
    cnt_table_name:props.cnt_table_name,
    audio: props.audio,
    image: props.image,

  }
  try{
    return (await axios.post(
        addTextURL,
        addBody,
        getAuthorizationHeadersObject()
    )).data;
  } catch (error){
    return {
      errorStatus:error.response.status,
      errorMessage: error.response.body
    }
  }

}

function getAudioFileURL(props) {
  return (
    process.env.REACT_APP_BACKEND_TEXT_CNT_URI +
    "/media/audio/" +
    props.element_id
  );
}

function getImageFileURL(props) {
  return (
    process.env.REACT_APP_BACKEND_TEXT_CNT_URI +
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
  updateElement,
  addElement,
  getElement,
};
