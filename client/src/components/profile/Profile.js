import React, { Component } from "react";
import { Link } from "react-router-dom";
import ProfileHeader from "./ProfileHeader";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { getProfileByHandle } from "../../actions/profileActions";
import Spinner from "../common/Spinner";
import ProfileAbout from "./ProfileAbout";
import ProfileCreds from "./ProfileCreds";
import ProfileGithub from "./ProfileGithub";

class Profile extends Component {
  componentDidMount() {
    if (this.props.match.params.handle) {
      this.props.getProfileByHandle(this.props.match.params.handle);
    }
  }

  render() {
    const { profile, loading } = this.props.profile;
    var content;

    if (profile === null || loading) {
      content = <Spinner />;
    } else {
      content = (
        <div>
          {/* Profile Header */}
          <ProfileHeader key={profile._id} profile={profile} />
          {/* Profile About */}
          <ProfileAbout key={profile._id} profile={profile} />
          {/* Profile Creds */}
          <ProfileCreds key={profile._id} profile={profile} />
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
                    to="/profiles"
                    className="btn btn-light mb-3 float-left"
                  >
                    Back To Profiles
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
  getProfileByHandle: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  profile: state.profile
});

export default connect(
  mapStateToProps,
  { getProfileByHandle }
)(Profile);
