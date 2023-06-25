import React, { useEffect, useState } from "react";

const Program = ({
  prog,
  editMode,
  handleProgramDelete,
  handleProgramEdit,
  categories,
}) => {
  const [color, setColor] = useState("#000");
  const [counter, setCounter] = useState(0);

  useEffect(() => {
    categories.forEach((cat) => {
      if (cat.name === prog.category) {
        setColor(cat.color);
      }
    });

    if (prog.counter) {
      setCounter(prog.counter);
    }
  }, [prog]);

  const handleDelete = () => {
    handleProgramDelete(prog);
  };

  const handleEdit = () => {
    handleProgramEdit(prog);
  };

  const handleCopy = () => {
    setCounter((prevState) => prevState + 1);
    navigator.clipboard.writeText(prog.filename);
  };

  const handleMinus = () => {
    setCounter((prevState) => prevState - 1);
  };

  return (
    <div className="greenBg program" style={{ border: `6px solid ${color}` }}>
      <div className="prog-header">
        {editMode && (
          <button onClick={handleEdit} className="edit-btn">
            EDT
          </button>
        )}
        <p>
          {prog.duration.minutes}:{prog.duration.seconds}
        </p>
        {editMode && (
          <button onClick={handleDelete} className="delete-btn">
            DEL
          </button>
        )}
      </div>
      {prog.info && (
        <span
          style={{ position: "absolute", top: "-2px", right: "5px" }}
          data-info={prog.info && prog.info}
          className="info-icon"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
          >
            <path d="M12 2c5.514 0 10 4.486 10 10s-4.486 10-10 10-10-4.486-10-10 4.486-10 10-10zm0-2c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm-.001 5.75c.69 0 1.251.56 1.251 1.25s-.561 1.25-1.251 1.25-1.249-.56-1.249-1.25.559-1.25 1.249-1.25zm2.001 12.25h-4v-1c.484-.179 1-.201 1-.735v-4.467c0-.534-.516-.618-1-.797v-1h3v6.265c0 .535.517.558 1 .735v.999z" />
          </svg>
        </span>
      )}
      <h2>{prog.filename}</h2>
      <div className="funcs">
        <button className="copy" onClick={handleCopy}>
          COPY
        </button>{" "}
        <span>
          <b>{counter}</b>
        </span>{" "}
        <button className="minus" onClick={handleMinus}>
          -
        </button>
      </div>
    </div>
  );
};

export default Program;
