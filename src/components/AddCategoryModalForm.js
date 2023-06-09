import { useState } from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import TextField from "@mui/material/TextField";
import { ChromePicker } from "react-color";

const CategoryModal = ({ open, handleClose, handleSave }) => {
  const [name, setName] = useState("");
  const [color, setColor] = useState("#000000");

  const handleColorChange = (color) => {
    setColor(color.hex);
  };

  const handleNameChange = (event) => {
    setName(event.target.value);
  };

  const handleCancel = () => {
    setName("");
    setColor("#000000");
    handleClose();
  };

  const handleConfirm = () => {
    if (name) {
      handleSave({ name: name.trim(), color });
      setName("");
      setColor("#000000");
      handleClose();
    }
  };

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>Create New Category</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          label="Category Name"
          fullWidth
          value={name}
          onChange={handleNameChange}
          required
        />
        <ChromePicker color={color} onChange={handleColorChange} />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleCancel}>Cancel</Button>
        <Button onClick={handleConfirm}>Save</Button>
      </DialogActions>
    </Dialog>
  );
};

export default CategoryModal;
