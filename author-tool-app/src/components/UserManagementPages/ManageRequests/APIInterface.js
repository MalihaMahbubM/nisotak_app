import axios from "axios";
import { getAuthorizationHeadersObject } from "../../Utils/authorization";

async function getElement() {
  let getRequestsURL =
    process.env.REACT_APP_BACKEND_ACCESS_CONTROL_URI + "users/inactive";

  let requestsAPIResponse;
  try {
    requestsAPIResponse = await axios.request({
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

  let requests = requestsAPIResponse.data;
  return requests;
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

export default {
  getElement,
  updateRole,
};
