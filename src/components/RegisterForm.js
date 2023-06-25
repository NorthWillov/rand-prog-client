import React, { useState } from "react";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import { styled } from "@mui/system";
import baseURL from "../apiConfig";
import axios from "axios";
import Loader from "./Loader";
import { useNavigate } from "react-router-dom";

const RegisterWrapper = styled("div")({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  minHeight: "100vh",
});

const RegisterFormContainer = styled("form")({
  display: "flex",
  flexDirection: "column",
  width: "100%",
  maxWidth: "400px",
  padding: "1rem",
  border: "1px solid #ccc",
  borderRadius: "5px",
});

const RegisterButton = styled(Button)({
  margin: "1rem 0",
});

const RegisterForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleEmailChange = (event) => {
    setEmail(event.target.value);
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsLoading(true);

    const configuration = {
      method: "post",
      url: `${baseURL}/register`,
      data: {
        email,
        password,
      },
    };

    // make the API call
    try {
      const res = await axios(configuration);
      setIsLoading(false);
      navigate("/dashboard");
    } catch (err) {
      console.log(err);
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <Loader />;
  }

  const handleLogin = () => {
    navigate("/");
  };

  return (
    <RegisterWrapper>
      <Typography variant="h4" align="center" gutterBottom>
        Register
      </Typography>
      <RegisterFormContainer onSubmit={handleSubmit}>
        <TextField
          label="Email"
          variant="outlined"
          margin="normal"
          type="email"
          value={email}
          onChange={handleEmailChange}
          required
        />
        <TextField
          label="Password"
          variant="outlined"
          margin="normal"
          type="password"
          value={password}
          onChange={handlePasswordChange}
          required
        />
        <RegisterButton
          fullWidth
          variant="contained"
          color="primary"
          type="submit"
        >
          Register
        </RegisterButton>
        <RegisterButton
          fullWidth
          variant="outlined"
          color="primary"
          onClick={handleLogin}
        >
          Login
        </RegisterButton>
      </RegisterFormContainer>
    </RegisterWrapper>
  );
};

export default RegisterForm;
