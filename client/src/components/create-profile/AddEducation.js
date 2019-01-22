import React, { Component } from "react";
import TextFieldGroup from "../common/TextfieldGroup";
import TextAreaFieldGroup from "../common/TextAreaFieldGroup";
import { Link, withRouter } from "react-router-dom";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { addEducation } from "../../actions/profileActions";

class AddEducation extends Component {
  constructor() {
    super();
    this.state = {
      errors: {},
      school: "",
      degree: "",
      fieldofstudy: "",
      from: "",
      to: "",
      disabled: false,
      current: false,
      description: ""
    };

    this.onSubmit = this.onSubmit.bind(this);
    this.onChange = this.onChange.bind(this);
    this.onCurrentClick = this.onCurrentClick.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.errors) {
      this.setState({
        errors: nextProps.errors
      });
    }
  }

  onSubmit(e) {
    e.preventDefault();

    // -- create education object
    const educationData = {
      school: this.state.school,
      degree: this.state.degree,
      fieldofstudy: this.state.fieldofstudy,
      from: this.state.from,
      to: this.state.to,
      current: this.state.current,
      description: this.state.description
    };

    this.props.addEducation(educationData, this.props.history);
  }

  onChange(e) {
    this.setState({
      [e.target.name]: e.target.value
    });
  }

  onCurrentClick(e) {
    this.setState({
      disabled: !this.state.disabled,
      current: !this.state.current
    });
  }

  render() {
    return (
      <div className="add-education">
        <div className="container">
          <div className="row">
            <div className="col-md-8 m-auto">
              <Link to="/dashboard" className="btn btn-light">
                Go Back
              </Link>
              <h1 className="display-4 text-center">Add Your Education</h1>
              <p className="lead text-center">
                Add any school, college, etc that you have attended
              </p>
              <small className="d-block pb-3">* = required field</small>
              <form onSubmit={this.onSubmit}>
                <TextFieldGroup
                  type="text"
                  className="form-control form-control-lg"
                  placeholder="* School Or College"
                  name="school"
                  onChange={this.onChange}
                  value={this.state.school}
                  error={this.state.errors.school}
                />
                <TextFieldGroup
                  type="text"
                  className="form-control form-control-lg"
                  placeholder="* Degree Or Certificate"
                  name="degree"
                  onChange={this.onChange}
                  value={this.state.degree}
                  error={this.state.errors.degree}
                />
                <TextFieldGroup
                  type="text"
                  className="form-control form-control-lg"
                  placeholder="* Field Of Study"
                  name="fieldofstudy"
                  onChange={this.onChange}
                  value={this.state.fieldofstudy}
                  error={this.state.errors.fieldofstudy}
                />
                <h6>From Date</h6>
                <TextFieldGroup
                  type="date"
                  className="form-control form-control-lg"
                  name="from"
                  onChange={this.onChange}
                  value={this.state.from}
                  error={this.state.errors.from}
                />
                <h6>To Date</h6>
                <TextFieldGroup
                  type="date"
                  className="form-control form-control-lg"
                  name="to"
                  onChange={this.onChange}
                  value={this.state.to}
                  error={this.state.errors.to}
                  disabled={this.state.disabled ? "disabled" : ""}
                />
                <div className="form-check mb-4">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    name="current"
                    value={this.state.current}
                    id="current"
                    onChange={this.onCurrentClick}
                  />
                  <label className="form-check-label" for="current">
                    Current School/College
                  </label>
                </div>
                <TextAreaFieldGroup
                  className="form-control form-control-lg"
                  name="description"
                  onChange={this.onChange}
                  value={this.state.description}
                  error={this.state.errors.description}
                  info="Tell us about your experience and what you learned"
                />
                <input
                  type="submit"
                  value="submit"
                  className="btn btn-info btn-block mt-4"
                />
              </form>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

AddEducation.propTypes = {
  profile: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired,
  addEducation: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  profile: state.profile,
  errors: state.errors
});

export default connect(
  mapStateToProps,
  { addEducation }
)(withRouter(AddEducation));
