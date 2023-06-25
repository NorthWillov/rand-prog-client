import React, { useState, useEffect } from "react";
import {
  TextField,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";

const EditProgModalForm = ({
  open,
  handleClose,
  handleSubmit,
  editInputs,
  categories,
}) => {
  const [filename, setFilename] = useState("");
  const [durationMinutes, setDurationMinutes] = useState(0);
  const [durationSeconds, setDurationSeconds] = useState(0);
  const [category, setCategory] = useState("");
  const [info, setInfo] = useState("");

  console.log(editInputs);

  useEffect(() => {
    setFilename(editInputs.fn);
    setDurationMinutes(editInputs.dur.minutes);
    setDurationSeconds(editInputs.dur.seconds);
    setCategory(editInputs.cat);
    setInfo(editInputs.info);
  }, []);

  const handleFormSubmit = (e) => {
    e.preventDefault();
    const duration = { minutes: durationMinutes, seconds: durationSeconds };
    handleSubmit({
      id: editInputs.id,
      filename: filename.trim(),
      duration,
      category,
      info,
    });
    setFilename("");
    setDurationMinutes(0);
    setDurationSeconds(0);
    setCategory("");
    setInfo("");
    handleClose();
  };

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>Edit File</DialogTitle>
      <DialogContent>
        <form onSubmit={handleFormSubmit}>
          <TextField
            autoFocus
            margin="dense"
            label="Name"
            type="text"
            value={filename}
            onChange={(e) => setFilename(e.target.value)}
            fullWidth
          />
          <TextField
            autoFocus
            margin="dense"
            label="Info"
            type="text"
            value={info}
            onChange={(e) => setInfo(e.target.value)}
            fullWidth
          />
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <TextField
              margin="dense"
              label="Duration (minutes)"
              type="number"
              value={durationMinutes}
              onChange={(e) => setDurationMinutes(e.target.value)}
              style={{ width: "50%" }}
            />
            <TextField
              margin="dense"
              label="Duration (seconds)"
              type="number"
              value={durationSeconds}
              onChange={(e) => setDurationSeconds(e.target.value)}
              style={{ width: "50%" }}
            />
          </div>
          <FormControl fullWidth>
            <InputLabel>Category</InputLabel>
            <Select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              fullWidth
            >
              {categories.map((cat) => (
                <MenuItem key={cat.name} value={cat.name}>
                  {cat.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <DialogActions>
            <Button onClick={handleClose}>Cancel</Button>
            <Button type="submit">Submit</Button>
          </DialogActions>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditProgModalForm;
