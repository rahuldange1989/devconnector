import axios from "axios";
import {
  GET_PROFILE,
  GET_PROFILES,
  GET_ERRORS,
  PROFILE_LOADING,
  CLEAR_CURRENT_PROFILE,
  SET_CURRENT_USER
} from "./types";

// -- get current profile
export const getCurrentProfile = () => dispatch => {
  dispatch(setProfileLoading());
  axios
    .get("/api/profile")
    .then(result => {
      dispatch({
        type: GET_PROFILE,
        payload: result.data
      });
    })
    .catch(err => {
      dispatch({
        type: GET_PROFILE,
        payload: null
      });
    });
};

// -- get profiles
export const getProfiles = () => dispatch => {
  dispatch(setProfileLoading());
  axios
    .get("/api/profile/all")
    .then(result => {
      dispatch({
        type: GET_PROFILES,
        payload: result.data
      });
    })
    .catch(err => {
      dispatch({
        type: GET_PROFILES,
        payload: {}
      });
    });
};

// -- get profile by handle
export const getProfileByUserId = userId => dispatch => {
  dispatch(setProfileLoading());
  axios
    .get(`/api/profile/user/${userId}`)
    .then(result => {
      dispatch({
        type: GET_PROFILE,
        payload: result.data
      });
    })
    .catch(err => {
      dispatch({
        type: GET_PROFILE,
        payload: {}
      });
    });
};

// -- get profile by handle
export const getProfileByHandle = handle => dispatch => {
  dispatch(setProfileLoading());
  axios
    .get(`/api/profile/handle/${handle}`)
    .then(result => {
      dispatch({
        type: GET_PROFILE,
        payload: result.data
      });
    })
    .catch(err => {
      dispatch({
        type: GET_PROFILE,
        payload: {}
      });
    });
};

// -- create profile
export const createProfile = (profileData, history) => dispatch => {
  axios
    .post("/api/profile", profileData)
    .then(result => {
      dispatch({
        type: GET_ERRORS,
        payload: {}
      });
      history.push("/dashboard");
    })
    .catch(err => {
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      });
    });
};

// -- Add Experience to Profile
export const addExperience = (expData, history) => dispatch => {
  axios
    .post("/api/profile/experience", expData)
    .then(result => {
      dispatch({
        type: GET_ERRORS,
        payload: {}
      });
      history.push("/dashboard");
    })
    .catch(err => {
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      });
    });
};

// -- Add Education to Profile
export const addEducation = (eduData, history) => dispatch => {
  axios
    .post("/api/profile/education", eduData)
    .then(result => {
      dispatch({
        type: GET_ERRORS,
        payload: {}
      });
      history.push("/dashboard");
    })
    .catch(err => {
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      });
    });
};

// -- Delete Experience
export const deleteExperienceFromProfile = id => dispatch => {
  if (window.confirm("Are you sure you want to delete experience data?")) {
    axios
      .delete(`/api/profile/experience/${id}`)
      .then(result => {
        dispatch({
          type: GET_PROFILE,
          payload: result.data
        });
      })
      .catch(err => {
        dispatch({
          type: GET_ERRORS,
          payload: err.response.data
        });
      });
  }
};

// -- Delete Education
export const deleteEducationFromProfile = id => dispatch => {
  if (window.confirm("Are you sure you want to delete education data?")) {
    axios
      .delete(`/api/profile/education/${id}`)
      .then(result => {
        dispatch({
          type: GET_PROFILE,
          payload: result.data
        });
      })
      .catch(err => {
        dispatch({
          type: GET_ERRORS,
          payload: err.response.data
        });
      });
  }
};

// -- Delete Account and profile
export const deleteAccount = () => dispatch => {
  if (window.confirm("Are you sure? This can NOT be be undone!")) {
    axios
      .delete("/api/profile")
      .then(result => {
        dispatch({
          type: SET_CURRENT_USER,
          payload: {}
        });
      })
      .catch(err => {
        dispatch({
          type: GET_ERRORS,
          payload: err.response.data
        });
      });
  }
};

// -- profile loading
export const setProfileLoading = () => {
  return {
    type: PROFILE_LOADING
  };
};

// -- clear profile
export const clearCurrentProfile = () => {
  return {
    type: CLEAR_CURRENT_PROFILE
  };
};
