import React from "react";

const Toolbar = ({ addElement, exportImage, exportPDF }) => {
  return (
    <div className="toolbar">
      <button onClick={() => addElement("text")}>Add Text</button>
      <button onClick={() => addElement("shape")}>Add Shape</button>
      <button onClick={exportImage}>Export PNG</button>
      <button onClick={exportPDF}>Export PDF</button>
    </div>
  );
};

export default Toolbar;
