import React, { Component } from "react";
import PropTypes from "prop-types";
import Items from './Items'


export default class Categories extends Component {
  render() {
    return (
      <ul>
        {this.props.categories.map((category, i) => (
          <div key= { i }>
            { (category.category_price) ?
              <li>{category.category_name} - ${category.category_price} <button>Edit</button><button>Delete</button><button>Add Item</button></li> : 
              <li>{category.category_name} <button>Edit</button><button>Delete</button><button>Add Item</button> </li>
            }
            <Items items={category.items} />
          </div>
        ))}
        <button>Add Category</button>
      </ul>
    );
  }
}

Categories.propTypes = {
  categories: PropTypes.array.isRequired
};
