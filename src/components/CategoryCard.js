import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import Items from './Items'
import FormEdit from './FormEdit'
import { Card, Button, Ref } from 'semantic-ui-react'
import '../styles/categories.css'
import {
  deleteCategory,
  updateCategory,
  editData,
  itemsReorder,
  updateItemsInCategory,
} from '../actions'
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd'

function CategoryCard(props) {
  const {
    selectedCity,
    categories,
    dataToEdit,
    dispatch,
    isFetchingCategory,
    category,
    i,
  } = props

  function onDragEnd(result) {
    // REODERING
    const { destination, source, draggableId } = result

    if (!destination) {
      return
    }

    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return
    }

    const reorderedCategory = categories.filter(
      cat => cat._id === source.droppableId,
    )
    const reordedItemsArr = Array.from(reorderedCategory[0].items)
    const movedItem = reordedItemsArr.filter(item => item._id === draggableId)
    reordedItemsArr.splice(source.index, 1)
    reordedItemsArr.splice(destination.index, 0, movedItem[0])

    dispatch(
      updateItemsInCategory(
        selectedCity.city_id,
        reorderedCategory[0],
        reordedItemsArr,
      ),
    )
    dispatch(
      itemsReorder(reordedItemsArr, reorderedCategory, selectedCity.city_id),
    )
  }

  return (
    <Draggable draggableId={category._id} key={category._id} index={i}>
      {(provided, snapshot) => (
        <Ref innerRef={provided.innerRef}>
          <Card {...provided.draggableProps} fluid className="card_color">
            {category._id !== dataToEdit._id || dataToEdit.newCategory ? (
              <Card.Content
                className="header_color"
                style={{
                  opacity: isFetchingCategory ? 0.5 : 1,
                }}
              >
                <Button.Group size="mini" floated="right">
                  <Button
                    basic
                    color="green"
                    type="button"
                    content="Edit"
                    onClick={() => dispatch(editData(category))}
                  />
                  <Button
                    basic
                    color="red"
                    type="button"
                    content="Delete"
                    onClick={() =>
                      dispatch(deleteCategory(props.cityId, category._id))
                    }
                  />
                </Button.Group>
                <Card.Header {...provided.dragHandleProps}>
                  {category.category_price
                    ? `${i + 1}. ${category.category_name} - $${
                        category.category_price
                      }`
                    : `${i + 1}. ${category.category_name}`}
                </Card.Header>
              </Card.Content>
            ) : (
              <Card.Content>
                <FormEdit />
              </Card.Content>
            )}
            {/* Items in Category */}
            {category.items.length > 0 ? (
              <DragDropContext onDragEnd={onDragEnd}>
                <Droppable droppableId={category._id}>
                  {provided => (
                    <Ref innerRef={provided.innerRef}>
                      <Card.Content {...provided.droppableProps}>
                        {category.items.map((item, i) => (
                          <Items
                            {...provided.droppableProps}
                            item={item}
                            index={i}
                            key={i}
                            category={category}
                          />
                        ))}
                        {provided.placeholder}
                      </Card.Content>
                    </Ref>
                  )}
                </Droppable>
              </DragDropContext>
            ) : null}

            {category._id === dataToEdit.cat_id && !dataToEdit.newCategory ? (
              <Card.Content className="item_color">
                <FormEdit catId={dataToEdit.cat_id} />
              </Card.Content>
            ) : null}
            {category.url && (
              <Card.Content className="item_color">{category.url}</Card.Content>
            )}
            {!category.category_price && !category.url ? (
              <Card.Content>
                <Button
                  fluid
                  type="button"
                  content="Add Item"
                  onClick={() =>
                    dispatch(
                      editData({
                        newCategory: false,
                        cat_id: category._id,
                        item_name: '',
                        item_price: '',
                      }),
                    )
                  }
                />
              </Card.Content>
            ) : null}
          </Card>
        </Ref>
      )}
    </Draggable>
  )
}

CategoryCard.propTypes = {
  categories: PropTypes.array.isRequired,
  dispatch: PropTypes.func.isRequired,
  selectedCity: PropTypes.object.isRequired,
  dataToEdit: PropTypes.object.isRequired,
  category: PropTypes.object.isRequired,
  isFetchingCategory: PropTypes.bool.isRequired,
}

function mapStateToProps(state) {
  const { selectedCity, categoriesByCity, dataToEdit } = state
  const { isFetchingCategory, categories } = categoriesByCity[
    selectedCity.city_id
  ] || {
    isFetchingCategory: true,
    categories: [],
  }
  return {
    dataToEdit,
    categories,
    cityId: selectedCity.city_id,
    deleteCategory,
    isFetchingCategory,
    updateCategory,
    editData,
    selectedCity,
  }
}

export default connect(mapStateToProps)(CategoryCard)
