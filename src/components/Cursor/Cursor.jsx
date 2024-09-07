import React, { useState } from "react";
import "./Cursor.css";

const Cursor = () => {
  const [cursorx, setcursorx] = useState();
  const [cursory, setcursory] = useState();
  window.addEventListener("mousemove", (e) => {
    setcursorx(e.pageX);
    setcursory(e.pageY);
  });
  return (
    <div className="custom-cursor">
      <div
        style={{ left: cursorx - 20 + "px", top: cursory - 20 + "px" }}
        className="bigcircle custom-cursor"
      ></div>
      <div
        style={{ left: cursorx + "px", top: cursory + "px" }}
        className="smallcircle"
      ></div>
    </div>
  );
};

export default Cursor;
