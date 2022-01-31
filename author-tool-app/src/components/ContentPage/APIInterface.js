import axios from "axios";
import { getAuthorizationHeadersObject } from "../Utils/authorization";

async function getElement(elementId) {
  let getContentPageURL =
    process.env.REACT_APP_BACKEND_CONTENT_PAGE_URI + elementId;

  let contentPageAPIResponse;
  try {
    contentPageAPIResponse = await axios.request({
      mehtod: "GET",
      url: getContentPageURL,
      headers: getAuthorizationHeadersObject().headers,
    });
  } catch (error) {
    return {
      errorStatus: error.response.status,
      errorMessage: "Ops, something went wrong. Please, refresh your page.",
    };
  }

  let contentPage = contentPageAPIResponse.data;
  return contentPage;
}

async function getContentTableNames(contentArray) {
  let newContentArray = contentArray;
  for (let i = 0; i < contentArray.length; i++) {
    let contentCallURL;
    if (contentArray[i].content_type === "Phrase") {
      contentCallURL =
        process.env.REACT_APP_BACKEND_PHRASE_CNT_URI +
        contentArray[i].content_id;
    } else if (contentArray[i].content_type === "Text") {
      contentCallURL =
        process.env.REACT_APP_BACKEND_TEXT_CNT_URI + contentArray[i].content_id;
    }

    try {
      let content = await axios.request({
        method: "GET",
        url: contentCallURL,
        headers: getAuthorizationHeadersObject().headers,
      });
      newContentArray[i].cnt_table_name = content.data.cnt_table_name;
    } catch (error) {
      return {
        errorStatus: error.response.status,
        errorMessage: "Ops, something went wrong. Please, refresh your page.",
      };
    }
  }
  return newContentArray;
}

async function addContentPage(contentPage){
  let addContentPageUrl = process.env.REACT_APP_BACKEND_CONTENT_PAGE_URI + "add";
  try{
    return (await axios.post(
        addContentPageUrl,
        contentPage,
        getAuthorizationHeadersObject()
    )).data
  } catch (error){
    console.error(`ERROR ADDING CONTENT PAGE: ${error}`)
    return {
      errorStatus: error.response.status,
      errorMessage: error.response.body,
    }
  }
}


async function saveContent(props) {
  let contPagePostURL =
    process.env.REACT_APP_BACKEND_CONTENT_PAGE_URI +
    "update/" +
    props.contentPage_id;

  let pageUpdateReqBody = {
    pg_table_name: props.pg_table_name,
    content: props.content,
  };

  try {
    let response = await axios.post(
      contPagePostURL,
      pageUpdateReqBody,
      getAuthorizationHeadersObject()
    );
    return response;
  } catch (error) {
    return {
      errorStatus: error.response.status,
      errorMessage: "Ops, something went wrong. Please, refresh your page.",
    };
  }
}

async function addContent(props) {
  let addContentUrl;
  let nextRedirectPage =
    "/lesson/" + props.lesson_id + "/contentPage/" + props.contentPage_id;
  if (props.type === "Text") {
    addContentUrl = process.env.REACT_APP_BACKEND_TEXT_CNT_URI + "add";
    nextRedirectPage = nextRedirectPage + "/text/";
  } else if (props.type === "Phrase") {
    addContentUrl = process.env.REACT_APP_BACKEND_PHRASE_CNT_URI + "add";
    nextRedirectPage = nextRedirectPage + "/phrase/";
  }

  let getAddContentReqBody = {
    cnt_page_id: props.contentPage_id,
  };

  try {
    const response = await axios.post(
      addContentUrl,
      getAddContentReqBody,
      getAuthorizationHeadersObject()
    );
    return { redirectPage: `${nextRedirectPage}${response.data}` };
  } catch (error) {
    return {
      errorStatus: error.response.status,
      errorMessage: "Ops, something went wrong. Please, refresh your page.",
    };
  }
}

async function deleteContent(props) {
  let contPageDeleteURL;
  if (props.content_type === "Text") {
    contPageDeleteURL =
      process.env.REACT_APP_BACKEND_TEXT_CNT_URI + props.content_id;
  } else if (props.content_type === "Phrase") {
    contPageDeleteURL =
      process.env.REACT_APP_BACKEND_PHRASE_CNT_URI + props.content_id;
  }

  try {
    let deleteResponse = await axios.request({
      method: "DELETE",
      url: contPageDeleteURL,
      headers: getAuthorizationHeadersObject().headers,
    });
    return deleteResponse;
  } catch (error) {
    return {
      errorStatus: error.response.status,
      errorMessage: "Ops, something went wrong. Please, refresh your page.",
    };
  }
}

export default {
  getElement,
  getContentTableNames,
  saveContent,
  addContentPage,
  deleteContent,
};
