import axios from "axios";

async function login(props) {
  var loginURL = process.env.REACT_APP_BACKEND_ACCESS_CONTROL_URI + "login";
  let requestBody = {
    email: props.fullElement.email,
    password: props.fullElement.password,
  };

  try {
    let loginResponse = await axios.post(loginURL, requestBody);
    return loginResponse;
  } catch (error) {
    return {
      errorStatus: error.response.status,
      errorMessage:
        "Your login failed. Please, verify both email and password.",
    };
  }
}

export default {
  login,
};
