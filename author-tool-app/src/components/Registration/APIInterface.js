import axios from "axios";

async function registerUser(props) {
  var loginURL = process.env.REACT_APP_BACKEND_ACCESS_CONTROL_URI + "register";
  let requestBody = {
    email: props.fullElement.email,
    username: props.fullElement.username,
    password: props.fullElement.password,
  };

  try {
    let response = await axios.post(loginURL, requestBody);
    return response;
  } catch (error) {
    return {
      errorStatus: error.response.status,
      errorMessage: "The registration failed.",
    };
  }
}

export default {
  registerUser,
};
