import React, { Component } from "react";
import PropTypes from "prop-types";

export default class Items extends Component {
  render() {
    return (
      <ul>
        {this.props.items.map((item, i) => (
          (item.item_price) ?
            <li key={i}>{item.item_name} - ${item.item_price} <button>Edit</button><button>Delete</button></li> :
            <li key={i}>{item.item_name} <button>Edit</button><button>Delete</button></li>
        ))}
      </ul>
    );
  }
}

Items.propTypes = {
  items: PropTypes.array.isRequired
};
