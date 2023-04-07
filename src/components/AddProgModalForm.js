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

  const handleFormSubmit = (e) => {
    e.preventDefault();
    const duration = { minutes: durationMinutes, seconds: durationSeconds };
    handleSubmit({ filename, duration, category });
    setFilename("");
    setDurationMinutes(0);
    setDurationSeconds(0);
    setCategory("");
    handleClose();
  };

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>Додати Новий Файл</DialogTitle>
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
              {categories.map((cat) => (
                <MenuItem key={cat.name} value={cat.name}>
                  {cat.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <DialogActions>
            <Button style={{ marginRight: "20px" }} onClick={handleClose}>
              Скасувати
            </Button>
            <Button type="submit">Додати</Button>
          </DialogActions>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddProgModalForm;
