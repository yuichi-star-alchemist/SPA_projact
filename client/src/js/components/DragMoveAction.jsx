import { useState } from 'react'


function DragMoveAction({ children }) {
  const [startCoordinate, setStartCoordinate] = useState()
  const [currentCoordinate, setCurrentCoordinate] = useState()
  


  const handleMouseDown = e => {
    setStartCoordinate({ x: e.clientX, y: e.clientY })
  }

  const handleMouseMove = e => {
    if (startCoordinate) {
      setCurrentCoordinate({ x: e.clientX, y: e.clientY })
      e.target.click()
    }
  }

  const handleMouseUp = () => {
    setStartCoordinate(null)
  }


  return (
    <div
      onMouseDown={ handleMouseDown }
      onMouseMove={ handleMouseMove }
      onMouseUp={ handleMouseUp }
      className="container drag-zone"
    >
      { children }
    </div>
  )
}

export default DragMoveAction