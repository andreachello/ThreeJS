import React from 'react';
import { useDrag, DragPreviewImage } from "react-dnd";

// we are going to render an image as an svg inside 
// the div for the item

const Item = ({item, position, inventoryType}) => {

    // create drag effect
    // create variable for reference (drag) and a method to 
    // determine if an item is dragging (isDragging)
    const [{isDragging}, drag, connectDragPreview] = useDrag({
        // describes data being dragged
        // the type, the id (item description we set in the state), position and the inventory type (to determine where that item
        // exists currently)
        item: {type:"item", id:item.item, position, inventoryType },
        // monitor when item is being dragged - use the
        // collect method which is a collecting function
        // it returns a plain object of the props to return
        // for injecting into the components
        // we pass in a monitor parameter which is a tiny
        // state dedicated to each dragged item
        collect: (monitor) => ({
            // we want to determine if we are dragging
            // the item or not - !! to turn it into a boolean
            // determine if it is true or false
            isDragging: !!monitor.isDragging(),
            // assign a reference to the drag
        })
    })

    // store item image
    const itemVisual = require(`../assets/items/${item.item}.svg`);

    // Connect the drag preview image to a reference in the useDrag hook and
    // image is the item visual
    // add a reference of drag in the parent div to the image
  return (
    <>
    <DragPreviewImage connect={connectDragPreview} src={itemVisual}/>
    <div ref={drag} style={{opacity: isDragging ? 0 : 1}}>
        <img src={itemVisual} alt={itemVisual} /> 
    </div>
    </>
  )
}

export default Item