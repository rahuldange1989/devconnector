import React, { Component } from "react";
import { Link } from "react-router-dom";
import ProfileHeader from "./ProfileHeader";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import {
  getProfileByHandle,
  getProfileByUserId
} from "../../actions/profileActions";
import Spinner from "../common/Spinner";
import ProfileAbout from "./ProfileAbout";
import ProfileCreds from "./ProfileCreds";
import ProfileGithub from "./ProfileGithub";
import isEmpty from "../../validation/is-empty";

class Profile extends Component {
  componentDidMount() {
    if (this.props.match.params.handle) {
      this.props.getProfileByHandle(this.props.match.params.handle);
    }

    if (this.props.match.params.userId) {
      this.props.getProfileByUserId(this.props.match.params.userId);
    }

    if (this.props.match.params.postUserId) {
      this.props.getProfileByUserId(this.props.match.params.postUserId);
    }
  }

  render() {
    const { profile, loading } = this.props.profile;
    var content;

    if (profile === null || loading) {
      content = <Spinner />;
    } else if (isEmpty(profile)) {
      this.props.history.push("/not-found");
    } else {
      content = (
        <div>
          {/* Profile Header */}
          <ProfileHeader key={`${profile._id}01`} profile={profile} />
          {/* Profile About */}
          <ProfileAbout key={`${profile._id}02`} profile={profile} />
          {/* Profile Creds */}
          <ProfileCreds key={`${profile._id}03`} profile={profile} />
          {profile.githubusername ? (
            <ProfileGithub username={profile.githubusername} />
          ) : null}
        </div>
      );
    }

    return (
      <div className="profile">
        <div className="container">
          <div className="row">
            <div className="col-md-12">
              <div className="row">
                <div className="col-6">
                  <Link
                    to={
                      this.props.match.params.postUserId
                        ? "/feed"
                        : this.props.match.params.userId
                        ? `/post/${this.props.match.params.postId}`
                        : "/profiles"
                    }
                    className="btn btn-light mb-3 float-left"
                  >
                    {this.props.match.params.postUserId
                      ? "Back to Feed"
                      : this.props.match.params.userId
                      ? "Back to Post"
                      : "Back to Profiles"}
                  </Link>
                </div>
              </div>
              {content}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

Profile.propTypes = {
  profile: PropTypes.object.isRequired,
  getProfileByHandle: PropTypes.func.isRequired,
  getProfileByUserId: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  profile: state.profile
});

export default connect(
  mapStateToProps,
  { getProfileByHandle, getProfileByUserId }
)(Profile);
