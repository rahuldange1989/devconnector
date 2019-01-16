const express = require("express");
const router = express.Router();
const passport = require("passport");

// -- Load validation
const validateProfileInput = require("../../validation/profile");
const validateExperienceInput = require("../../validation/experience");
const validateEducationInput = require("../../validation/education");

// -- Load Profile and User Model
const Profile = require("../../models/Profile");
const User = require("../../models/User");

// @route    GET  api/profile/test
// @desc     Tests profile routes
// @access   Public
router.get("/test", (req, res) => {
  res.json({ msg: "Profile works" });
});

// @route    GET  api/profile
// @desc     Ger current user's profile
// @access   Private
router.get(
  "/",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const errors = {};

    Profile.findOne({ user: req.user.id })
      .populate("user")
      .then(profile => {
        if (!profile) {
          errors.noprofile = "There is no profile for this user.";
          return res.status(404).json(errors);
        }
        res.json(profile);
      })
      .catch(error => {
        res.status(404).json(error);
      });
  }
);

// @route    GET  api/profile/all
// @desc     Ger all profiles
// @access   Public
router.get("/all", (req, res) => {
  const errors = {};

  Profile.find()
    .populate("user", ["name", "avatar"])
    .then(profiles => {
      if (!profiles) {
        errors.noprofile = "There are no profiles.";
        return res.status(404).json({ errors });
      }

      res.json(profiles);
    })
    .catch(err => {
      res.status(404).json(err);
    });
});

// @route    GET  api/profile/handle/:handle
// @desc     Get Profile y handle
// @access   Public
router.get("/handle/:handle", (req, res) => {
  const errors = {};

  Profile.findOne({ handle: req.params.handle })
    .populate("user", ["name", "avatar"])
    .then(profile => {
      if (!profile) {
        errors.noprofile = "There is no profile for this user.";
        return res.status(404).json(errors);
      }

      res.json(profile);
    })
    .catch(err => {
      res.status(404).json(err);
    });
});

// @route    GET  api/profile/user/:id
// @desc     Get Profile by user id
// @access   Public
router.get("/user/:id", (req, res) => {
  const errors = {};

  Profile.findOne({ user: req.params.id })
    .populate("user", ["name", "avatar"])
    .then(profile => {
      if (!profile) {
        errors.noprofile = "There is no profile for this user.";
        return res.status(404).json(errors);
      }

      res.json(profile);
    })
    .catch(err => {
      res.status(404).json({ noprofile: "There is no profile for this user." });
    });
});

// @route    POST  api/profile
// @desc     Create or edit user profile
// @access   Private
router.post(
  "/",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const { errors, isValid } = validateProfileInput(req.body);

    // -- Check validation
    if (!isValid) {
      return res.status(400).json(errors);
    }

    // -- Get fields
    const profileFields = {};
    profileFields.user = req.user.id;
    if (req.body.handle) profileFields.handle = req.body.handle;
    if (req.body.company) profileFields.company = req.body.company;
    if (req.body.website) profileFields.website = req.body.website;
    if (req.body.location) profileFields.location = req.body.location;
    if (req.body.bio) profileFields.bio = req.body.bio;
    if (req.body.status) profileFields.status = req.body.status;
    if (req.body.githubusername)
      profileFields.githubusername = req.body.githubusername;

    // -- split into array
    if (typeof req.body.skills != "undefined") {
      profileFields.skills = req.body.skills.split(",");
    }

    // -- Social
    profileFields.social = {};
    if (req.body.youtube) profileFields.social.youtube = req.body.youtube;
    if (req.body.facebook) profileFields.social.facebook = req.body.facebook;
    if (req.body.linkedin) profileFields.social.linkedin = req.body.linkedin;
    if (req.body.twitter) profileFields.social.twitter = req.body.twitter;
    if (req.body.instagram) profileFields.social.instagram = req.body.instagram;

    Profile.findOne({ user: req.user.id }).then(profile => {
      if (profile) {
        // -- Update
        Profile.findOneAndUpdate(
          { user: req.user.id },
          { $set: profileFields },
          { new: true }
        ).then(profile => res.json(profile));
      } else {
        // -- Create
        // -- Check if handle exists
        Profile.findOne({ handle: profileFields.handle }).then(profile => {
          if (profile) {
            errors.handle = "That handle already exists.";
            res.status(400).json(errors);
          }

          // -- Save Profile
          new Profile(profileFields)
            .save()
            .then(profile => res.json(profile))
            .catch(error => res.json(error));
        });
      }
    });
  }
);

// @route    POST  api/profile/experience
// @desc     Add experience to profile
// @access   Private
router.post(
  "/experience",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const { errors, isValid } = validateExperienceInput(req.body);

    if (!isValid) {
      res.status(400).json(errors);
    }

    Profile.findOne({ user: req.user.id }).then(profile => {
      const newExp = {
        title: req.body.title,
        company: req.body.company,
        location: req.body.location,
        from: req.body.from,
        to: req.body.to,
        current: req.body.current,
        description: req.body.description
      };

      // -- add to experience array of profile
      profile.experience.unshift(newExp);

      // -- save updated profile
      profile
        .save()
        .then(profile => res.json(profile))
        .catch(err => {
          res.status(404).json(err);
        });
    });
  }
);

// @route    POST  api/profile/education
// @desc     Add Education to profile
// @access   Private
router.post(
  "/education",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const { errors, isValid } = validateEducationInput(req.body);

    if (!isValid) {
      res.status(400).json(errors);
    }

    Profile.findOne({ user: req.user.id }).then(profile => {
      const newEdu = {
        school: req.body.school,
        degree: req.body.degree,
        fieldofstudy: req.body.fieldofstudy,
        from: req.body.from,
        to: req.body.to,
        current: req.body.current,
        description: req.body.description
      };

      // -- add to experience array of profile
      profile.education.unshift(newEdu);

      // -- save updated profile
      profile
        .save()
        .then(profile => res.json(profile))
        .catch(err => {
          res.status(404).json(err);
        });
    });
  }
);

// @route    POST  api/profile/education/:eduId
// @desc     Delete Education from profile
// @access   Private
router.delete(
  "/education/:eduId",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Profile.findOne({ user: req.user.id }).then(profile => {
      // -- Get remove index
      const removeIndex = profile.education
        .map(item => item.id)
        .indexOf(req.params.eduId);

      // -- delete education from array
      profile.education.splice(removeIndex, 1);

      // -- save updated profile
      profile
        .save()
        .then(profile => res.json(profile))
        .catch(err => {
          res.status(404).json(err);
        });
    });
  }
);

// @route    POST  api/profile/experience/:expId
// @desc     Delete experience from profile
// @access   Private
router.delete(
  "/experience/:expId",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Profile.findOne({ user: req.user.id }).then(profile => {
      // -- Get remove index
      const removeIndex = profile.experience
        .map(item => item.id)
        .indexOf(req.params.expId);

      // -- delete education from array
      profile.experience.splice(removeIndex, 1);

      // -- save updated profile
      profile
        .save()
        .then(profile => res.json(profile))
        .catch(err => {
          res.status(404).json(err);
        });
    });
  }
);

// @route    POST  api/profile
// @desc     Delete User and profile
// @access   Private
router.delete(
  "/",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Profile.findOneAndRemove({ user: req.user.id })
      .then(() => {
        User.findOneAndRemove({ _id: req.user.id })
          .then(() => {
            res.json({ success: true });
          })
          .catch(err => res.status(400).json(err));
      })
      .catch(err => res.status(400).json(err));
  }
);

module.exports = router;
