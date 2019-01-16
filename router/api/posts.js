const express = require("express");
const router = express.Router();
const passport = require("passport");

// -- import validations
const validatePostInput = require("../../validation/post");

// -- import models
const PostModel = require("../../models/Post");
const UserModel = require("../../models/User");
const ProfileModel = require("../../models/Profile");

// @route    GET  api/posts/test
// @desc     Tests posts routes
// @access   Public
router.get("/test", (req, res) => {
  res.json({ msg: "Posts works" });
});

// @route    GET  api/posts/
// @desc     Get Posts
// @access   Public
router.get("/", (req, res) => {
  PostModel.find()
    .sort({ date: -1 })
    .then(posts => {
      res.json(posts);
    })
    .catch(err => {
      res.status(404).json({ nopostsfound: "No posts found." });
    });
});

// @route    GET  api/posts/:id
// @desc     Get Post by id
// @access   Public
router.get("/:postId", (req, res) => {
  PostModel.findById(req.params.postId)
    .then(post => {
      if (!post) {
        return res
          .status(404)
          .json({ nopostfound: "No post found with that id." });
      }

      res.json(post);
    })
    .catch(err => {
      res.status(404).json({ nopostfound: "No post found with that id." });
    });
});

// @route    POST  api/posts/
// @desc     Create Post
// @access   Private
router.post(
  "/",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const { errors, isValid } = validatePostInput(req.body);

    // -- check validation
    if (!isValid) {
      return res.status(400).json(errors);
    }

    const newPost = PostModel({
      text: req.body.text,
      name: req.body.name,
      avatar: req.body.avatar,
      user: req.user.id
    });

    newPost
      .save()
      .then(post => {
        res.json(post);
      })
      .catch(err => {
        res.status(400).json(err);
      });
  }
);

// @route    DELETE  api/posts/:id
// @desc     Delete Post by id
// @access   Private
router.delete(
  "/:id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    PostModel.findById(req.params.id)
      .then(post => {
        // -- check for post owner
        if (post.user.toString() !== req.user.id) {
          return res
            .status(401)
            .json({ notauthorized: "User not authorized." });
        }

        // -- Delete
        post
          .remove()
          .then(() => res.json({ success: true }))
          .catch(err => {
            res.status(404).json({ postnotfound: "Post not found." });
          });
      })
      .catch(err => {
        res.status(404).json({ postnotfound: "Post not found." });
      });
  }
);

// @route    POST  api/posts/like/:id
// @desc     Like Post
// @access   Private
router.post(
  "/like/:id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    PostModel.findById(req.params.id)
      .then(post => {
        if (
          post.likes.filter(post => post.user.toString() === req.user.id)
            .length > 0
        ) {
          return res
            .status(400)
            .json({ alreadyliked: "User already liked this post." });
        }

        // -- add user id to likes array
        post.likes.unshift({ user: req.user.id });

        // -- save post
        post
          .save()
          .then(post => {
            res.json(post);
          })
          .catch(err => {
            res.status(400).json(err);
          });
      })
      .catch(err => {
        res.status(404).json({ postnotfound: "Post not found." });
      });
  }
);

// @route    POST  api/posts/unlike/:id
// @desc     Unlike Post
// @access   Private
router.post(
  "/unlike/:id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    PostModel.findById(req.params.id)
      .then(post => {
        if (
          post.likes.filter(post => post.user.toString() === req.user.id)
            .length === 0
        ) {
          return res
            .status(400)
            .json({ notliked: "User have not yet liked this post." });
        }

        // -- Get remove Index
        const removeIndex = post.likes
          .map(post => post.user.toString())
          .indexOf(req.user.id);

        // -- splice from array
        post.likes.splice(removeIndex, 1);

        // -- save post
        post
          .save()
          .then(post => {
            res.json(post);
          })
          .catch(err => {
            res.status(400).json(err);
          });
      })
      .catch(err => {
        res.status(404).json({ postnotfound: "Post not found." });
      });
  }
);

// @route    POST  api/posts/comment/:id
// @desc     Comment on Post
// @access   Private
router.post(
  "/comment/:id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const { errors, isValid } = validatePostInput(req.body);

    if (!isValid) {
      return res.status(400).json(errors);
    }

    PostModel.findById(req.params.id)
      .then(post => {
        const newComment = {
          text: req.body.text,
          name: req.body.name,
          avatar: req.body.avatar,
          user: req.user.id
        };

        // -- add to comments array
        post.comments.unshift(newComment);

        // -- save post
        post
          .save()
          .then(post => {
            res.json(post);
          })
          .catch(err => {
            res.status(400).json(err);
          });
      })
      .catch(err => {
        res.status(404).json({ postnotfound: "Post not found." });
      });
  }
);

// @route    DELETE  api/posts/comment/:postId/:commentId
// @desc     Delete a comment by id
// @access   Private
router.delete(
  "/comment/:postId/:commentId",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    PostModel.findById(req.params.postId)
      .then(post => {
        // -- check if comment exists.
        if (
          post.comments.filter(
            comment => comment._id.toString() === req.params.commentId
          ).length === 0
        ) {
          res.status(404).json({ commentnotfound: "Comment does not exists." });
        }

        // -- Get remove index
        const removeIndex = post.comments
          .map(comment => comment._id.toString())
          .indexOf(req.params.commentId);

        // -- remove from comment array
        post.comments.splice(removeIndex, 1);

        // -- save post
        post
          .save()
          .then(post => {
            res.json(post);
          })
          .catch(err => {
            res.status(400).json(err);
          });
      })
      .catch(err => {
        res.status(404).json({ postnotfound: "Post not found." });
      });
  }
);

module.exports = router;
