import { useState, useEffect } from "react";
import { styled } from "@mui/system";
import { Button, TextField, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Cookies from "universal-cookie";
import Loader from "./Loader";

const cookies = new Cookies();

const LoginWrapper = styled("div")({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  minHeight: "100vh",
});

const LoginForm = styled("form")({
  display: "flex",
  flexDirection: "column",
  width: "100%",
  maxWidth: "400px",
  padding: "1rem",
  border: "1px solid #ccc",
  borderRadius: "5px",
});

const LoginButton = styled(Button)({
  margin: "1rem 0",
});

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [logged, setLogged] = useState(false);

  const token = cookies.get("TOKEN");
  const navigate = useNavigate();

  useEffect(() => {
    if (token) {
      navigate("/dashboard");
    }
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsLoading(true);

    const configuration = {
      method: "post",
      url: "https://rand-prog-server.onrender.com/login",
      data: {
        email,
        password,
      },
    };

    // make the API call
    try {
      const res = await axios(configuration);
      setIsLoading(false);

      cookies.set("TOKEN", res.data.token, {
        path: "/",
      });

      setLogged(true);
      navigate("/dashboard");
    } catch (err) {
      console.log(err);
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <Loader />;
  }

  return (
    <LoginWrapper>
      <Typography variant="h4" align="center" gutterBottom>
        Login
      </Typography>
      <LoginForm onSubmit={handleSubmit}>
        <TextField
          label="Email"
          variant="outlined"
          margin="normal"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <TextField
          label="Password"
          variant="outlined"
          margin="normal"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <LoginButton variant="contained" color="primary" type="submit">
          Login
        </LoginButton>
      </LoginForm>
    </LoginWrapper>
  );
};

export default Login;
