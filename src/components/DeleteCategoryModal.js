import React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";

const CategoryDeleteModal = ({
  open,
  handleClose,
  handleCategoryDelete,
  categories,
  tvPrograms,
}) => {
  const handleDelete = (categoryId) => {
    try {
      handleCategoryDelete(categoryId);
      handleClose();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>Delete Category</DialogTitle>
      <DialogContent>
        {categories.map((category) => (
          <Box
            key={category._id}
            display="flex"
            alignItems="center"
            justifyContent="space-between"
            marginBottom="10px"
          >
            <Typography variant="body1">{category.name}</Typography>
            <Button
              disabled={
                tvPrograms.find((prog) => prog.category === category.name)
                  ? true
                  : false
              }
              variant="outlined"
              color="secondary"
              onClick={() => handleDelete(category._id)}
            >
              Delete
            </Button>
          </Box>
        ))}
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="primary">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CategoryDeleteModal;
