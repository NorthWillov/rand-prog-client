import React, { useEffect, useState } from "react";
import axios from "axios";
import Loader from "./Loader";
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
  const [isLoading, setIsLoading] = useState(false);
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
    setIsLoading(true);
    const getData = async () => {
      try {
        const res = await axios.get(`${baseURL}/fetch-palette`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setIsLoading(false);

        if (res.data) {
          setPalette(res.data);
          setUnusedPrograms(res.data.unusedProgs);
        }
      } catch (err) {
        console.log(err);
        setIsLoading(false);
      }
    };

    getData();
  }, []);

  const handleLogout = async () => {
    setIsLoading(true);
    try {
      const response = await axios.post(`${baseURL}/logout`);
      setIsLoading(false);
      if (response.data.success) {
        cookies.remove("TOKEN");
        navigate("/");
      }
    } catch (error) {
      console.error(error);
      setIsLoading(false);
    }
  };

  const handleEdit = () => {
    setEditMode(!editMode);
  };

  const handleProgramDelete = async (prog) => {
    setIsLoading(true);
    try {
      const res = await axios.delete(
        `${baseURL}/${palette._id}/programs/${prog._id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setIsLoading(false);
      const updatedProgs = palette.tvPrograms.filter((p) => p._id !== prog._id);
      setPalette({ ...palette, tvPrograms: updatedProgs });
    } catch (error) {
      console.log(error);
      setIsLoading(false);
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
    setIsLoading(true);
    try {
      const axiosInstance = axios.create({
        baseURL,
        headers: { Authorization: `Bearer ${token}` },
      });

      await axiosInstance.put(`/${palette._id}/edit/${updProg.id}`, {
        updProg,
      });
      setIsLoading(false);

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
      setIsLoading(false);
    }
  };

  const handleCategorySubmit = async (newCategory) => {
    setIsLoading(true);
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

      setIsLoading(false);
      setPalette({
        ...palette,
        categories: res.data.categories,
      });
    } catch (error) {
      console.log(error);
      setIsLoading(false);
    }
  };

  const handleInsert = async (newProg) => {
    setIsLoading(true);
    try {
      const axiosInstance = axios.create({
        baseURL,
        headers: { Authorization: `Bearer ${token}` },
      });

      const res = await axiosInstance.post(`/${palette._id}/programs`, {
        newProg,
      });

      setIsLoading(false);
      setPalette(res.data);
      console.log(res);
    } catch (error) {
      console.log(error);
      setIsLoading(false);
    }
  };

  const handleCategoryDelete = async (categoryId) => {
    setIsLoading(true);
    try {
      const axiosInstance = axios.create({
        baseURL,
        headers: { Authorization: `Bearer ${token}` },
      });

      const res = await axiosInstance.delete(
        `/${palette._id}/delete-category/${categoryId}`
      );

      setIsLoading(false);
      setPalette(res.data);
      console.log(res);
    } catch (error) {
      console.log(error);
      setIsLoading(false);
    }
  };

  const handleTrashAdd = async (unusedProgName) => {
    setIsLoading(true);
    try {
      const axiosInstance = axios.create({
        baseURL,
        headers: { Authorization: `Bearer ${token}` },
      });

      const res = await axiosInstance.post(
        `/${palette._id}/add-unused-program`,
        { unusedProgName }
      );

      setIsLoading(false);
      setUnusedPrograms([...unusedPrograms, unusedProgName]);
    } catch (error) {
      console.log(error);
      setIsLoading(false);
    }
  };

  const deleteTrashProgram = async (program) => {
    setIsLoading(true);
    try {
      const res = await axios.delete(
        `${baseURL}/${palette._id}/delete-unused-program`,
        {
          headers: { Authorization: `Bearer ${token}` },
          data: { unusedProgName: program },
        }
      );
      setIsLoading(false);
    } catch (error) {
      console.log(error);
      setIsLoading(false);
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

  if (isLoading) {
    return <Loader />;
  }

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
