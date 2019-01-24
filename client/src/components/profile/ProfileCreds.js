import React, { Component } from "react";
import PropTypes from "prop-types";
import isEmpty from "../../validation/is-empty";
import Moment from "react-moment";

class ProfileCreds extends Component {
  render() {
    const { experience, education } = this.props.profile;

    return (
      <div className="row">
        <div className="col-md-6">
          <h3 className="text-center text-info">Experience</h3>
          <ul className="list-group">
            {experience.map((exp, index) => (
              <li key={exp._id} className="list-group-item">
                <h4>{exp.company}</h4>
                <p>
                  <Moment format="MMM YYYY">{exp.from}</Moment> -{" "}
                  {isEmpty(exp.to) ? (
                    "Current"
                  ) : (
                    <Moment format="MMM YYYY">{exp.to}</Moment>
                  )}
                </p>
                <p>
                  <strong>Position:</strong> {exp.title}
                </p>
                <p>
                  <strong>Description:</strong> {exp.description}
                </p>
              </li>
            ))}
          </ul>
        </div>
        {/* Education */}
        <div className="col-md-6">
          <h3 className="text-center text-info">Education</h3>
          <ul className="list-group">
            {education.map((edu, index) => (
              <li key={index} className="list-group-item">
                <h4>{edu.school}</h4>
                <p>
                  <Moment format="MMM YYYY">{edu.from}</Moment> -{" "}
                  {isEmpty(edu.to) ? (
                    "Current"
                  ) : (
                    <Moment format="MMM YYYY">{edu.to}</Moment>
                  )}
                </p>
                <p>
                  <strong>Degree:</strong> {edu.degree}
                </p>
                <p>
                  <strong>Description:</strong> {edu.description}
                </p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    );
  }
}

ProfileCreds.propTypes = {
  profile: PropTypes.object.isRequired
};

export default ProfileCreds;
