import  React, {useRef, useState, useEffect} from "react"
import { toProperCase } from "./functions/formatValue";

const DynamicDiv = (props) => {

    const panelRef = React.useRef();
    const draggable = props.draggable || true
    const resizable = props.resizeable || true
    const width = props.width || "150px"
    const height = props.width || "150px"
    const top = props.width || 0.5*window.innerWidth
    const left = props.width ||  0.5*window.innerHeight
    const children = props.children

    const [position, setPosition] = React.useState({ x: left, y:top });
    const [isDragging, setIsDragging] = React.useState(false);
    const [offset, setOffset] = React.useState({ x: 0, y: 0 });
  
    const containerStyle = {
      position: "fixed",
      height: height,
      width: width,
      transform: "translate(-50%, -50%)",
      cursor: "move",
      zIndex: 9999,
      overflow: "hidden"
    };

    const [leftEdge, setLeftEdge] = useState(left)
    const [rightEdge, setRightEdge] = useState(left+width)
    const [topEdge, setTopEdge] = useState(top)
    const [bottomEdge, setBottomEdge] = useState(top+height)
  
    const handleMouseDown = (e) => {
      if (!draggable) return;
      setIsDragging(true);
      setOffset({
        x: e.clientX - position.x,
        y: e.clientY - position.y
      });
    };

    const handleMouseUp = (e) => {
        setIsDragging(false)
    };
  
    const handleMouseMove = (e) => {
      if (!isDragging || !draggable) return;
      setPosition({
        x: e.clientX - offset.x,
        y: e.clientY - offset.y
      });
    };

    const iconButtonStyle = {
      height: "30px",
      width: "30px",
      cursor: "pointer"
    }
  
    return (
      <div
        ref={panelRef}
        className="d-flex flex-column bg-light shadow border border-3 rounded-3"
        style={{
          ...containerStyle,
          left: position.x + "px",
          top: position.y + "px",
        }}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onMouseMove={handleMouseMove}
        onDoubleClick={handleMouseUp}
      >
        <div className="d-flex flex-wrap" style={{height: "95%", width: "100%", overflowY:"auto", overflowX: "hidden"}}>
          {children}
        </div>
      </div>
    );
  };

  export default DynamicDiv