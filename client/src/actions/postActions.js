import axios from "axios";
import {
  ADD_POST,
  GET_ERRORS,
  POST_LOADING,
  GET_POSTS,
  DELETE_POSTS,
  GET_POST
} from "./types";

// -- Add Post
export const addPost = postData => dispatch => {
  // -- clear gloabal error state
  dispatch({
    type: GET_ERRORS,
    payload: {}
  });

  axios
    .post("/api/posts", postData)
    .then(result => {
      dispatch({
        type: ADD_POST,
        payload: result.data
      });
    })
    .catch(err => {
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      });
    });
};

// -- Get Posts
export const getPosts = () => dispatch => {
  // -- Start Loading
  dispatch(setPostLoading());

  axios
    .get("/api/posts")
    .then(result => {
      dispatch({
        type: GET_POSTS,
        payload: result.data
      });
    })
    .catch(err => {
      dispatch({
        type: GET_POSTS,
        payload: null
      });
    });
};

// -- Get Post by id
export const getPost = id => dispatch => {
  // -- Start Loading
  dispatch(setPostLoading());

  axios
    .get(`/api/posts/${id}`)
    .then(result => {
      dispatch({
        type: GET_POST,
        payload: result.data
      });
    })
    .catch(err => {
      dispatch({
        type: GET_POST,
        payload: null
      });
    });
};

// -- Delete Post
export const deletePost = id => dispatch => {
  axios
    .delete(`/api/posts/${id}`)
    .then(result => {
      dispatch({
        type: DELETE_POSTS,
        payload: id
      });
    })
    .catch(err => {
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      });
    });
};

// -- Add Post Like
export const addLikePost = id => dispatch => {
  axios
    .post(`/api/posts/like/${id}`)
    .then(result => {
      dispatch(getPosts());
    })
    .catch(err => {
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      });
    });
};

// -- Remove Post Like
export const removeLikePost = id => dispatch => {
  axios
    .post(`/api/posts/unlike/${id}`)
    .then(result => {
      dispatch(getPosts());
    })
    .catch(err => {
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      });
    });
};

// -- Add comment
export const addComment = (postId, commentData) => dispatch => {
  // -- clear gloabal error state
  dispatch({
    type: GET_ERRORS,
    payload: {}
  });

  axios
    .post(`/api/posts/comment/${postId}`, commentData)
    .then(result => {
      dispatch({
        type: GET_POST,
        payload: result.data
      });
    })
    .catch(err => {
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      });
    });
};

// -- Delete comment
export const deleteComment = (postId, commentId) => dispatch => {
  axios
    .delete(`/api/posts/comment/${postId}/${commentId}`)
    .then(result => {
      dispatch({
        type: GET_POST,
        payload: result.data
      });
    })
    .catch(err => {
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      });
    });
};

// -- set post loading
export const setPostLoading = () => {
  return {
    type: POST_LOADING
  };
};
