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

const EditProgModalForm = ({ open, handleClose, handleSubmit, editInputs }) => {
  const [filename, setFilename] = useState("");
  const [durationMinutes, setDurationMinutes] = useState(0);
  const [durationSeconds, setDurationSeconds] = useState(0);
  const [category, setCategory] = useState("");

  useEffect(() => {
    setFilename(editInputs.fn);
    setDurationMinutes(editInputs.dur.minutes);
    setDurationSeconds(editInputs.dur.seconds);
    setCategory(editInputs.cat);
  }, []);

  const handleFormSubmit = (e) => {
    e.preventDefault();
    const duration = { minutes: durationMinutes, seconds: durationSeconds };
    handleSubmit({
      id: editInputs.id,
      filename,
      duration,
      category,
    });
    setFilename("");
    setDurationMinutes(0);
    setDurationSeconds(0);
    setCategory("");
    handleClose();
  };

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>Редагувати Файл</DialogTitle>
      <DialogContent>
        <form onSubmit={handleFormSubmit}>
          <TextField
            autoFocus
            margin="dense"
            label="Назва Файлу"
            type="text"
            value={filename}
            onChange={(e) => setFilename(e.target.value)}
            fullWidth
          />
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <TextField
              margin="dense"
              label="Тривалість (хвилини)"
              type="number"
              value={durationMinutes}
              onChange={(e) => setDurationMinutes(e.target.value)}
              style={{ width: "50%" }}
            />
            <TextField
              margin="dense"
              label="Тривалість (секунди)"
              type="number"
              value={durationSeconds}
              onChange={(e) => setDurationSeconds(e.target.value)}
              style={{ width: "50%" }}
            />
          </div>
          <FormControl fullWidth>
            <InputLabel>Категорія</InputLabel>
            <Select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              fullWidth
            >
              <MenuItem value="News">News</MenuItem>
              <MenuItem value="Sports">Sports</MenuItem>
              <MenuItem value="Entertainment">Entertainment</MenuItem>
              <MenuItem value="Documentary">Documentary</MenuItem>
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
