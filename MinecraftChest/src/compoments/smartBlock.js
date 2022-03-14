import React from 'react'
import Item from './item'
import { useDrop } from 'react-dnd'

const SmartBlock = ({inventoryType, item, position, moveItem}) => {
    // useDrop - will be the area where we drop our item - is it over the area
    // isOver - is the dragging over
    const [{isOver}, drop] = useDrop({
        // accept an item - we defined the type of item in the useDrag hook
        accept: "item",
        // specify a drop that executes a function
        // the place where the item is coming from is in this function
        drop: (item) => {
            // update immer state so as to move the order of where our items exist
            moveItem(item.position, position, item)
        },
        // collect allows to monitor if the state has changed, 
        // it allows certain commands such like isOver for when we are over
        // a specific block
        collect: (monitor) => ({
            isOver: !!monitor.isOver(),
        })
    })

    // set reference to drop
  return (
    <div className={`${isOver ? 'grid-item is-over' : 'grid-item'}`} ref={drop}> 
    {/* item.item to check if item exists 
        if item.item is true return item component,
        given we are returning 
        null for certain items 
    */}
        {item.item && (
        <Item 
            item={item}
            inventoryType={inventoryType}
            position={position} />
      )}
    </div>
  )
}

export default SmartBlock