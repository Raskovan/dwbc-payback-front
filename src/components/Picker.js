import React, { Component } from "react";
import PropTypes from "prop-types";
import { withRouter } from 'react-router-dom'

class Picker extends Component {
  render() {
    const { city, onChange, options } = this.props;
    return (
			<span>
				<h1>{city.city_name}</h1>
				<select
					value={city.city_id}
					onChange={onChange}>
					<option value=''>Select city...</option>
					{options.map(option => (
						<option value={option.city_id} key={option._id}>
							{option.city_name}
						</option>
					))}
				</select>
			</span>
		)
  }
}

Picker.propTypes = {
  options: PropTypes.arrayOf(PropTypes.object.isRequired).isRequired,
  onChange: PropTypes.func.isRequired
};

export default withRouter(Picker)
