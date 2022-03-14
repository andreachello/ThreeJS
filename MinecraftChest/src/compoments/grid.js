import React from 'react'
import SmartBlock from './smartBlock'
// React Drag and Drop
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'

const Grid = ({chestState, updateChestState, inventoryType}) => {

    // Update the immer state
    const updateItem = (blockFrom, blockTo, item) => {
        // if dragging to new inventory type:
        if(item.inventoryType != inventoryType) {
            // update immer state
            // draft state --> make edits to the state here
            updateChestState((draft) => {
                // update the item inventory type - set old to null set new to new
                // item -> get the item in the inventoryType of the from and to blocks
                // set the item to null/new - item.id is the item itself
                // get dragged item's current inventoryType 
                draft[item.inventoryType][blockFrom].item = null;
                // get the inventory type that is dynamically passed
                draft[inventoryType][blockTo].item = item.id;
            }) 
        } 
        // update from the same inventory type
        else {
            updateChestState((draft) => {
                // use inventoryType instead of the dragged current inventory type
                draft[inventoryType][blockFrom].item = null;
                draft[inventoryType][blockTo].item = item.id;
            }) 
        }
    }

    //function will grab where our blocks are coming from and 
    // going to and store them in a variable for their id
    const moveItem = (from, to, item) => {
        // the position is given to us as a string "x,y" so we replace
        // the comma with an empty string and add it to the block keyword 
        // this will mimic the key from our state (block00, block01, etc.)
        const blockFrom = `block${from.replaceAll(",", "")}`
        const blockTo = `block${to.replaceAll(",", "")}`
        updateItem(blockFrom, blockTo, item)
    }

    // Get the position of the blocks - X and Y positions
    // Take an item parameter
    const getXYPosition = (i) => {
        // i mod 9 because we have 9 items in each row
        const x = i % 9; // Rows
        const y  = Math.floor(i/9) //Columns
        return{x,y};
    }

    // Set the X and Y into a Block String - return X & Y of the block in an array string
    // create a get position function taking in i as a parameter
    const getPosition = (i) => {
        const {x,y} = getXYPosition(i)
        // set XY into an arry
        const block = [x,y]
        // return string literal for that block
        return `${block}`;
    }

  return (
    <DndProvider backend={HTML5Backend}>
        <div className='grid'>
        {/* List the grid items according to 
        the number of keys within the state by inventoryType passed */}
            {Object.keys(chestState[inventoryType]).map(function (key, index) {
                return (
                    <div key={index}>
                        {/* pass the chest state by inventory type
                        and the key associated to the individual 
                        grid block in this loop*/}
                        <SmartBlock 
                            inventoryType={inventoryType}
                            item={chestState[inventoryType][key]}
                            position={getPosition(index)}
                            moveItem={moveItem}    />
                    </div>
                )
            })}
        </div>
    </DndProvider>
  )
}

export default Grid