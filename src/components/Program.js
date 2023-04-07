import React, { useEffect, useState } from "react";

const Program = ({
  prog,
  editMode,
  handleProgramDelete,
  handleProgramEdit,
  categories,
}) => {
  const [color, setColor] = useState("#000");

  useEffect(() => {
    categories.forEach((cat) => {
      if (cat.name === prog.category) {
        setColor(cat.color);
      }
    });
  }, []);

  const handleDelete = () => {
    handleProgramDelete(prog);
  };

  const handleEdit = () => {
    handleProgramEdit(prog);
  };

  return (
    <div className="program" style={{ border: `6px solid ${color}` }}>
      <div className="prog-header">
        {editMode && (
          <button onClick={handleEdit} className="edit-btn">
            РЕД
          </button>
        )}
        <p>
          {prog.duration.minutes}:{prog.duration.seconds}
        </p>
        {editMode && (
          <button onClick={handleDelete} className="delete-btn">
            ВИД
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
