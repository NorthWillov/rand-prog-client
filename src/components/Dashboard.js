import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Cookies from "universal-cookie";
import Program from "./Program";
const cookies = new Cookies();

const Dashboard = () => {
  const [palette, setPalette] = useState({ tvPrograms: [] });
  const [editMode, setEditMode] = useState(false);

  const token = cookies.get("TOKEN");
  const navigate = useNavigate();

  useEffect(() => {
    const getPalette = async () => {
      try {
        const res = await axios.get(
          "https://rand-prog-server.onrender.com/fetch-palette",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setPalette(res.data);
      } catch (err) {
        console.log(err);
      }
    };

    getPalette();
  }, []);

  const handleLogout = async () => {
    try {
      const response = await axios.post(
        "https://rand-prog-server.onrender.com/logout"
      );
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
        `https://rand-prog-server.onrender.com/${palette._id}/programs/${prog._id}`,
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

  return (
    <>
      {console.log(palette)}
      <div className="programs">
        {palette.tvPrograms.map((prog) => (
          <Program
            key={prog._id}
            prog={prog}
            editMode={editMode}
            handleProgramDelete={handleProgramDelete}
          />
        ))}
      </div>
      <button onClick={handleLogout}>LOGOUT</button>
      <button onClick={handleEdit}>EDIT</button>
    </>
  );
};

export default Dashboard;
