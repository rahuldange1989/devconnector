import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import {
  getCurrentProfile,
  deleteAccount,
  deleteEducationFromProfile,
  deleteExperienceFromProfile
} from "../../actions/profileActions";
import Spinner from "../common/Spinner";
import { Link } from "react-router-dom";
import ProfileActions from "./ProfileActions";
import Moment from "react-moment";

class Dashboard extends Component {
  componentDidMount() {
    this.props.getCurrentProfile();
  }

  onDeleteAccountClick(e) {
    e.preventDefault();
    this.props.deleteAccount();
  }

  deleteExperience(id) {
    this.props.deleteExperienceFromProfile(id);
  }

  deleteEducation(id) {
    this.props.deleteEducationFromProfile(id);
  }

  render() {
    const { user } = this.props.auth;
    const { profile, loading } = this.props.profile;
    let dashboardContent;

    if (profile === null || loading) {
      dashboardContent = <Spinner />;
    } else {
      // -- chekc if loggeed in user has profile data
      if (Object.keys(profile).length > 0) {
        const experienceContent = profile.experience.map(currentExp => (
          <tr key={currentExp._id}>
            <td>{currentExp.company}</td>
            <td>{currentExp.title}</td>
            <td>
              <Moment format="DD-MM-YYYY">{currentExp.from}</Moment> -{" "}
              {currentExp.current ? (
                "Now"
              ) : (
                <Moment format="DD-MM-YYYY">{currentExp.to}</Moment>
              )}
            </td>
            <td>
              <button
                onClick={this.deleteExperience.bind(this, currentExp._id)}
                className="btn btn-danger"
              >
                Delete
              </button>
            </td>
          </tr>
        ));

        const educationContent = profile.education.map(currentEdu => (
          <tr key={currentEdu._id}>
            <td>{currentEdu.school}</td>
            <td>{currentEdu.degree}</td>
            <td>
              <Moment format="DD-MM-YYYY">{currentEdu.from}</Moment> -{" "}
              {currentEdu.current ? (
                "Now"
              ) : (
                <Moment format="DD-MM-YYYY">{currentEdu.to}</Moment>
              )}
            </td>
            <td>
              <button
                onClick={this.deleteEducation.bind(this, currentEdu._id)}
                className="btn btn-danger"
              >
                Delete
              </button>
            </td>
          </tr>
        ));

        dashboardContent = (
          <div>
            <p className="lead text-muted">
              Welcome <Link to={`/profile/${profile.handle}`}>{user.name}</Link>
            </p>
            <ProfileActions />
            {/* Experience */}
            <div>
              <h4 className="mb-2">Experience Credentials</h4>
              <table className="table">
                <thead>
                  <tr>
                    <th>Company</th>
                    <th>Title</th>
                    <th>Years</th>
                    <th />
                  </tr>
                </thead>
                <tbody>{experienceContent}</tbody>
              </table>
            </div>
            {/* Education */}
            <div style={{ marginTop: "30px" }}>
              <h4 className="mb-2">Education Credentials</h4>
              <table className="table">
                <thead>
                  <tr>
                    <th>School</th>
                    <th>Degree</th>
                    <th>Years</th>
                    <th />
                  </tr>
                </thead>
                <tbody>{educationContent}</tbody>
              </table>
            </div>
            <div style={{ marginBottom: "60px" }} />
            <button
              onClick={this.onDeleteAccountClick.bind(this)}
              className="btn btn-danger"
            >
              Delete My Account
            </button>
          </div>
        );
      } else {
        // -- User is logged in but has no profile
        dashboardContent = (
          <div>
            <p className="lead text-muted">Welcome {user.name}</p>
            <p>You have not yet setup a profile, please add some info:</p>
            <Link to="/create-profile" className="btn btn-lg btn-info">
              Create Profile
            </Link>
          </div>
        );
      }
    }

    return (
      <div className="dashboard">
        <div className="container">
          <div className="row">
            <div className="col-md-12">
              <h3 className="display-6">Dashboard</h3>
              {dashboardContent}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

Dashboard.propTypes = {
  profile: PropTypes.object.isRequired,
  auth: PropTypes.object.isRequired,
  getCurrentProfile: PropTypes.func.isRequired,
  deleteAccount: PropTypes.func.isRequired,
  deleteEducationFromProfile: PropTypes.func.isRequired,
  deleteExperienceFromProfile: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  profile: state.profile,
  auth: state.auth
});

export default connect(
  mapStateToProps,
  {
    getCurrentProfile,
    deleteAccount,
    deleteEducationFromProfile,
    deleteExperienceFromProfile
  }
)(Dashboard);
