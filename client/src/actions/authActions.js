import { GET_ERRORS, SET_CURRENT_USER } from "./types";
import axios from "axios";
import setAuthToken from "../util/setAuthToken";
import jwt_decode from "jwt-decode";

// -- Register User
export const registerUser = (userData, history) => dispatch => {
  axios
    .post("/api/users/register", userData)
    .then(result => {
      history.push("/login");
    })
    .catch(err => {
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      });
    });
};

// -- Login - get user token
export const loginUser = userData => dispatch => {
  axios
    .post("/api/users/login", userData)
    .then(result => {
      // -- save to local storage
      const { token } = result.data;

      // -- set token to local storage
      localStorage.setItem("jwtToken", token);

      // -- set token to auth header
      setAuthToken(token);

      // -- decode token to get users data
      const decoded = jwt_decode(token);

      // -- set current user
      dispatch(setCurrentUser(decoded));
    })
    .catch(err => {
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      });
    });
};

// -- set logged in user
export const setCurrentUser = decoded => {
  return {
    type: SET_CURRENT_USER,
    payload: decoded
  };
};

// -- set log user out
export const logoutUser = () => dispatch => {
  // -- remove token from local storage
  localStorage.removeItem("jwtToken");

  // -- remove auth header for future request
  setAuthToken(false);

  // -- set current user to empty object which will set authenticated false
  dispatch(setCurrentUser({}));
};
