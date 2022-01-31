import axios from "axios";
import { getAuthorizationHeadersObject } from "../../Utils/authorization";

async function getElement() {
  let getRequestsURL =
    process.env.REACT_APP_BACKEND_ACCESS_CONTROL_URI + "users/active";

  let usersAPIResponse;
  try {
    usersAPIResponse = await axios.request({
      method: "GET",
      url: getRequestsURL,
      headers: getAuthorizationHeadersObject().headers,
    });
  } catch (error) {
    return {
      errorStatus: error.response.status,
      errorMessage: "Ops, something went wrong. Please, refresh your page.",
    };
  }

  let users = usersAPIResponse.data;
  return users;
}

async function updateRole(email, role) {
  let postRequestURL =
    process.env.REACT_APP_BACKEND_ACCESS_CONTROL_URI + "user/updateRole";

  try {
    let requestsAPIResponse = await axios.post(
      postRequestURL,
      { email: email, role: role },
      getAuthorizationHeadersObject()
    );
    return requestsAPIResponse;
  } catch (error) {
    return {
      errorStatus: error.response.status,
      errorMessage: "Ops, something went wrong. Please, try again.",
    };
  }
}

async function deleteUser(email) {
  let deleteURL = process.env.REACT_APP_BACKEND_ACCESS_CONTROL_URI + "user";

  try {
    let deleteAPIResponse = await axios.request({
      method: "DELETE",
      data: { email: email },
      url: deleteURL,
      headers: getAuthorizationHeadersObject().headers,
    });
    return deleteAPIResponse;
  } catch (error) {
    return {
      errorStatus: error.response.status,
      errorMessage: "Ops, something went wrong. Please, try again.",
    };
  }
}

async function checkAuthorization(){
  let verifyUrl = process.env.REACT_APP_BACKEND_ACCESS_CONTROL_URI + "/verify-jwt-integration";

  try{
    return await axios.get(verifyUrl,getAuthorizationHeadersObject());
  } catch (error){
    return {
      errorStatus: error.response.status,
      errorMessage: `ERROR: ${error.response.data}`
    }
  }
}


export default {
  getElement,
  updateRole,
  deleteUser,
  checkAuthorization,
};
