import React, { useState } from "react";
import { Button, Modal, TextField } from "@mui/material";

const AddUnusedProgramsModal = ({ open, handleClose, handleAdd }) => {
  const [programName, setProgramName] = useState("");
  const [unusedPrograms, setUnusedPrograms] = useState([]);

  const handleProgramNameChange = (event) => {
    setProgramName(event.target.value);
  };

  const handleAddProgram = () => {
    const trimmedProgramName = programName.trim();
    if (trimmedProgramName !== "") {
      // Logic to handle adding program name
      handleAdd(trimmedProgramName);
      // Reset program name input field
      setProgramName("");
    }
  };

  const handleDeleteProgram = (program) => {
    // Logic to handle deleting a program from the unused programs list
    const updatedPrograms = unusedPrograms.filter((p) => p !== program);
    setUnusedPrograms(updatedPrograms);
  };

  return (
    <div>
      <Modal open={open} onClose={handleClose}>
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            backgroundColor: "#fff",
            boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
            padding: "2rem",
            borderRadius: "8px",
            width: "400px",
            maxWidth: "90vw",
          }}
        >
          <h2 style={{ marginBottom: "1rem" }}>Add Unused Programs</h2>
          <TextField
            label="Program Name"
            value={programName}
            onChange={handleProgramNameChange}
            fullWidth
            margin="normal"
          />
          {unusedPrograms.length > 0 && (
            <ul style={{ marginTop: "1rem" }}>
              {unusedPrograms.map((program) => (
                <li key={program} style={{ marginBottom: "0.5rem" }}>
                  {program}
                  <Button
                    variant="contained"
                    color="secondary"
                    onClick={() => handleDeleteProgram(program)}
                    style={{ marginLeft: "0.5rem" }}
                  >
                    Delete
                  </Button>
                </li>
              ))}
            </ul>
          )}
          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              marginTop: "1rem",
            }}
          >
            <Button
              variant="contained"
              color="primary"
              onClick={handleAddProgram}
              style={{ marginRight: "1rem" }}
            >
              Add
            </Button>
            <Button variant="contained" onClick={handleClose}>
              Cancel
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default AddUnusedProgramsModal;
