import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Cookies from "universal-cookie";
import AddProgModalForm from "./AddProgModalForm";
import EditProgModalForm from "./EditProgModalForm";
import CategoryModal from "./AddCategoryModalForm";
import Program from "./Program";
const cookies = new Cookies();

const Dashboard = () => {
  const [palette, setPalette] = useState({ tvPrograms: [], categories: [] });
  const [editMode, setEditMode] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [editInputs, setEditInputs] = useState({
    id: "",
    fn: "",
    dur: { minutes: 0, seconds: 0 },
    category: "",
  });

  const token = cookies.get("TOKEN");
  const navigate = useNavigate();

  useEffect(() => {
    const getData = async () => {
      try {
        const res = await axios.get("http://localhost:5000/fetch-palette", {
          headers: { Authorization: `Bearer ${token}` },
        });
        console.log("RES:", res);

        if (res.data) {
          setPalette(res.data);
        }
      } catch (err) {
        console.log(err);
      }
    };

    getData();
  }, []);

  const handleLogout = async () => {
    try {
      const response = await axios.post("http://localhost:5000/logout");
      if (response.data.success) {
        cookies.remove("TOKEN");
        navigate("/");
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleEdit = () => {
    setEditMode(!editMode);
  };

  const handleProgramDelete = async (prog) => {
    try {
      const res = await axios.delete(
        `http://localhost:5000/${palette._id}/programs/${prog._id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const updatedProgs = palette.tvPrograms.filter((p) => p._id !== prog._id);
      setPalette({ ...palette, tvPrograms: updatedProgs });
    } catch (error) {
      console.log(error);
    }
  };

  const handleProgramEdit = (prog) => {
    handleEditModalOpen();
    setEditInputs({
      id: prog._id,
      fn: prog.filename,
      dur: { minutes: prog.duration.minutes, seconds: prog.duration.seconds },
      cat: prog.category,
    });
  };

  const handleProgramEditSubmit = async (updProg) => {
    try {
      const axiosInstance = axios.create({
        baseURL: `http://localhost:5000`,
        headers: { Authorization: `Bearer ${token}` },
      });

      await axiosInstance.put(`/${palette._id}/edit/${updProg.id}`, {
        updProg,
      });

      const updTvProgs = palette.tvPrograms.map((p) => {
        if (p._id === updProg.id) {
          return {
            ...p,
            filename: updProg.filename,
            duration: updProg.duration,
            category: updProg.category,
          };
        }
        return p;
      });
      setPalette({ ...palette, tvPrograms: updTvProgs });
    } catch (error) {
      console.log(error);
    }
  };

  const handleCategorySubmit = async (newCategory) => {
    try {
      const axiosInstance = axios.create({
        baseURL: `http://localhost:5000`,
        headers: { Authorization: `Bearer ${token}` },
      });

      await axiosInstance.post(`/${palette._id}/insert-new-category`, {
        newCategory,
      });
    } catch (error) {
      console.log(error);
    }
  };

  const handleInsert = async (newProg) => {
    try {
      const axiosInstance = axios.create({
        baseURL: `http://localhost:5000`,
        headers: { Authorization: `Bearer ${token}` },
      });

      await axiosInstance.post(`/${palette._id}/programs`, { newProg });

      const updatedProgs = [...palette.tvPrograms, newProg];
      setPalette({ ...palette, tvPrograms: updatedProgs });
    } catch (error) {
      console.log(error);
    }
  };

  const handleCategoryModalOpen = () => {
    setIsCategoryModalOpen(true);
  };

  const handleCategoryModalClose = () => {
    setIsCategoryModalOpen(false);
  };

  const handleAddModalOpen = () => {
    setIsAddModalOpen(true);
  };

  const handleAddModalClose = () => {
    setIsAddModalOpen(false);
  };

  const handleEditModalOpen = () => {
    setIsEditModalOpen(true);
  };

  const handleEditModalClose = () => {
    setIsEditModalOpen(false);
    setEditInputs({
      id: "",
      fn: "",
      dur: { minutes: 0, seconds: 0 },
      category: "",
    });
  };

  return (
    <>
      {palette.tvPrograms.length > 0 && (
        <div className="programs">
          {palette.tvPrograms.map((prog) => (
            <Program
              key={prog.filename}
              prog={prog}
              categories={palette.categories}
              editMode={editMode}
              handleProgramDelete={handleProgramDelete}
              handleProgramEdit={handleProgramEdit}
            />
          ))}
        </div>
      )}
      <AddProgModalForm
        open={isAddModalOpen}
        handleClose={handleAddModalClose}
        handleSubmit={handleInsert}
        categories={palette.categories}
      />
      {isEditModalOpen && (
        <EditProgModalForm
          open={isEditModalOpen}
          handleClose={handleEditModalClose}
          handleSubmit={handleProgramEditSubmit}
          editInputs={editInputs}
        />
      )}
      <CategoryModal
        open={isCategoryModalOpen}
        handleClose={handleCategoryModalClose}
        handleSave={handleCategorySubmit}
      />
      <button onClick={handleLogout}>Вийти</button>
      <button onClick={handleEdit}>Редагувати</button>
      <button onClick={handleAddModalOpen}>Додати</button>
      <button onClick={handleCategoryModalOpen}>Додати Нову Категорію</button>
    </>
  );
};

export default Dashboard;
