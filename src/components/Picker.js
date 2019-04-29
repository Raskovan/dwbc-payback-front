import React, { Component } from "react";
import PropTypes from "prop-types";
import { withRouter } from 'react-router-dom'

class Picker extends Component {
  render() {
    const { value, onChange, options } = this.props;
    return (
      <span>
        <h1>{value.city_name}</h1>
        <select onChange={e => onChange(e.target.value)} >
        <option>Select City</option>
          {options.map(option => (
            <option value={option.city_id} key={option._id}>
              {option.city_name}
            </option>
          ))}
        </select>
      </span>
    );
  }
}

Picker.propTypes = {
  options: PropTypes.arrayOf(PropTypes.object.isRequired).isRequired,
  value: PropTypes.object.isRequired,
  onChange: PropTypes.func.isRequired
};

export default withRouter(Picker)
