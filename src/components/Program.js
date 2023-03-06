import React from "react";

const Program = ({ prog, editMode, handleProgramDelete }) => {
  const handleDelete = () => {
    handleProgramDelete(prog)
  };

  return (
    <div className="program" style={{ border: `6px solid red` }}>
      <div className="prog-header">
        {editMode && <button className="edit-btn">EDIT</button>}
        <p>
          {prog.duration.minutes}:{prog.duration.seconds}
        </p>
        {editMode && (
          <button onClick={handleDelete} className="delete-btn">
            DELETE
          </button>
        )}
      </div>

      <h2>{prog.filename}</h2>
      <div className="funcs">
        <button className="copy">COPY</button>{" "}
        <span>{/* <b>{prog.counter}</b> */}0</span>{" "}
        <button className="minus">-</button>
      </div>
    </div>
  );
};

export default Program;
