import React, { Component } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { getProfiles } from "../../actions/profileActions";
import Spinner from "../common/Spinner";
import ProfileItem from "./ProfileItem";

class Profiles extends Component {
  componentDidMount() {
    this.props.getProfiles();
  }

  render() {
    const { profiles, loading } = this.props.profile;
    var profilesContent;

    if (profiles === null || loading) {
      profilesContent = <Spinner />;
    } else {
      if (profiles.length === 0) {
        profilesContent = <h4>Profiles are not added.</h4>;
      } else {
        profilesContent = profiles.map(profile => (
          <ProfileItem key={profile._id} profile={profile} />
        ));
      }
    }

    return (
      <div className="profiles">
        <div className="container">
          <div className="row">
            <div className="col-md-12">
              <h1 className="display-6 text-center">Developer Profiles</h1>
              <p className="lead text-center">
                Browse and connect with developers
              </p>
              {profilesContent}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

Profiles.propTypes = {
  profile: PropTypes.object.isRequired,
  getProfiles: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  profile: state.profile
});

export default connect(
  mapStateToProps,
  { getProfiles }
)(Profiles);
