import React, { useState } from "react";
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

const AddProgModalForm = ({ open, handleClose, handleSubmit, categories }) => {
  const [filename, setFilename] = useState("");
  const [durationMinutes, setDurationMinutes] = useState(0);
  const [durationSeconds, setDurationSeconds] = useState(0);
  const [category, setCategory] = useState("");
  const [info, setInfo] = useState("");

  const handleFormSubmit = (e) => {
    e.preventDefault();
    const duration = { minutes: durationMinutes, seconds: durationSeconds };
    handleSubmit({ filename, duration, category, info });
    setFilename("");
    setDurationMinutes(0);
    setDurationSeconds(0);
    setCategory("");
    setInfo("");
    handleClose();
  };

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>Add New File</DialogTitle>
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
            required
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
              required
            />
            <TextField
              margin="dense"
              label="Duration (seconds)"
              type="number"
              value={durationSeconds}
              onChange={(e) => setDurationSeconds(e.target.value)}
              style={{ width: "50%" }}
              required
            />
          </div>
          <FormControl fullWidth>
            <InputLabel>Category</InputLabel>
            <Select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              fullWidth
              required
            >
              {categories.map((cat) => (
                <MenuItem key={cat.name} value={cat.name}>
                  {cat.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <DialogActions>
            <Button style={{ marginRight: "20px" }} onClick={handleClose}>
              Cancel
            </Button>
            <Button type="submit">Add</Button>
          </DialogActions>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddProgModalForm;
