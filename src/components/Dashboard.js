import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Cookies from "universal-cookie";
import AddProgModalForm from "./AddProgModalForm";
import EditProgModalForm from "./EditProgModalForm";
import CategoryModal from "./AddCategoryModalForm";
import AddUnusedProgramsModal from "./AddUnusedProgramsModal";
import DeleteCategoryModal from "./DeleteCategoryModal";
import XmlForm from "./XmlForm";
import Program from "./Program";
import ModalXmlForm from "./ModalXmlForm";
import baseURL from "../apiConfig";
const cookies = new Cookies();

const Dashboard = () => {
  const [palette, setPalette] = useState({ tvPrograms: [], categories: [] });
  const [editMode, setEditMode] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [isUnusedProgramsOpen, setIsUnusedProgramsOpen] = useState(false);
  const [isCategoryDeleteModalOpen, setIsCategoryDeleteModalOpen] =
    useState(false);
  const [unusedPrograms, setUnusedPrograms] = useState([]);
  const [isModalXmlForm, setIsModalXmlForm] = useState(false);
  const [editInputs, setEditInputs] = useState({
    id: "",
    fn: "",
    dur: { minutes: 0, seconds: 0 },
    category: "",
    info: "",
  });

  const token = cookies.get("TOKEN");
  const navigate = useNavigate();

  useEffect(() => {
    const getData = async () => {
      try {
        const res = await axios.get(`${baseURL}/fetch-palette`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        console.log("RES:", res);

        if (res.data) {
          setPalette(res.data);
          setUnusedPrograms(res.data.unusedProgs);
        }
      } catch (err) {
        console.log(err);
      }
    };

    getData();
  }, []);

  const handleLogout = async () => {
    try {
      const response = await axios.post(`${baseURL}/logout`);
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
        `${baseURL}/${palette._id}/programs/${prog._id}`,
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
      info: prog.info,
    });
  };

  const handleProgramEditSubmit = async (updProg) => {
    try {
      const axiosInstance = axios.create({
        baseURL,
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
            info: updProg.info,
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
        baseURL,
        headers: { Authorization: `Bearer ${token}` },
      });

      const res = await axiosInstance.post(
        `/${palette._id}/insert-new-category`,
        {
          newCategory,
        }
      );
      console.log(res.data);
      setPalette({
        ...palette,
        categories: res.data.categories,
      });
    } catch (error) {
      console.log(error);
    }
  };

  const handleInsert = async (newProg) => {
    try {
      const axiosInstance = axios.create({
        baseURL,
        headers: { Authorization: `Bearer ${token}` },
      });

      const res = await axiosInstance.post(`/${palette._id}/programs`, {
        newProg,
      });

      setPalette(res.data);
      console.log(res);
    } catch (error) {
      console.log(error);
    }
  };

  const handleCategoryDelete = async (categoryId) => {
    try {
      const axiosInstance = axios.create({
        baseURL,
        headers: { Authorization: `Bearer ${token}` },
      });

      const res = await axiosInstance.delete(
        `/${palette._id}/delete-category/${categoryId}`
      );

      setPalette(res.data);
      console.log(res);
    } catch (error) {
      console.log(error);
    }
  };

  const handleTrashAdd = async (unusedProgName) => {
    try {
      const axiosInstance = axios.create({
        baseURL,
        headers: { Authorization: `Bearer ${token}` },
      });

      const res = await axiosInstance.post(
        `/${palette._id}/add-unused-program`,
        { unusedProgName }
      );

      setUnusedPrograms([...unusedPrograms, unusedProgName]);
    } catch (error) {
      console.log(error);
    }
  };

  const deleteTrashProgram = async (program) => {
    try {
      const res = await axios.delete(
        `${baseURL}/${palette._id}/delete-unused-program`,
        {
          headers: { Authorization: `Bearer ${token}` },
          data: { unusedProgName: program },
        }
      );
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

  const handleCategoryDeleteModalOpen = () => {
    setIsCategoryDeleteModalOpen(true);
  };

  const handleCategoryDeleteModalClose = () => {
    setIsCategoryDeleteModalOpen(false);
  };

  const handleUnusedProgramsOpen = () => {
    setIsUnusedProgramsOpen(true);
  };

  const handleUnusedProgramsClose = () => {
    setIsUnusedProgramsOpen(false);
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
      info: "",
    });
  };

  return (
    <>
      {palette.tvPrograms.length > 0 && (
        <div className="programs">
          {palette.tvPrograms
            .sort((a, b) => a.category.localeCompare(b.category))
            .map((prog) => (
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
          categories={palette.categories}
        />
      )}
      <CategoryModal
        open={isCategoryModalOpen}
        handleClose={handleCategoryModalClose}
        handleSave={handleCategorySubmit}
      />
      <DeleteCategoryModal
        tvPrograms={palette.tvPrograms}
        open={isCategoryDeleteModalOpen}
        handleClose={handleCategoryDeleteModalClose}
        handleCategoryDelete={handleCategoryDelete}
        categories={palette.categories}
      />
      <AddUnusedProgramsModal
        open={isUnusedProgramsOpen}
        handleClose={handleUnusedProgramsClose}
        handleAdd={handleTrashAdd}
        unusedProgs={unusedPrograms}
        setUnusedPrograms={setUnusedPrograms}
        deleteTrashProgram={deleteTrashProgram}
      />
      <div className="main-menu-btns">
        <button onClick={handleLogout}>Logout</button>
        <button onClick={handleEdit}>Edit</button>
        <button onClick={handleAddModalOpen}>Add file</button>
        <button onClick={handleCategoryModalOpen}>Create new category</button>
        <button onClick={handleCategoryDeleteModalOpen}>Delete category</button>
        <button onClick={handleUnusedProgramsOpen}>Add trash</button>
      </div>

      <div className="rest">
        <XmlForm
          setPalette={setPalette}
          palette={palette}
          unusedProgs={unusedPrograms}
        />
        <button
          onClick={() => setIsModalXmlForm(!isAddModalOpen)}
          className="glow"
          type="button"
        >
          Tryb rozszerzony
        </button>
        {isModalXmlForm && (
          <ModalXmlForm setIsModalXmlForm={setIsModalXmlForm} />
        )}
      </div>
    </>
  );
};

export default Dashboard;
