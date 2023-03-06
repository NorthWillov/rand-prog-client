import React from "react";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import axios from "axios";
import Loader from "./Loader";

const RegisterForm = () => {
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(false);
  const [registered, setRegistered] = React.useState(false);

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
      url: "https://rand-prog-server.onrender.com/register",
      data: {
        email,
        password,
      },
    };

    // make the API call
    try {
      const res = await axios(configuration);
      setIsLoading(false);
      setRegistered(true);
    } catch (err) {
      console.log(err);
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <Loader />;
  }

  return (
    <form onSubmit={handleSubmit}>
      <TextField
        label="Email"
        type="email"
        variant="outlined"
        margin="normal"
        fullWidth
        value={email}
        onChange={handleEmailChange}
      />
      <TextField
        label="Password"
        type="password"
        variant="outlined"
        margin="normal"
        fullWidth
        value={password}
        onChange={handlePasswordChange}
      />
      <Button type="submit" variant="contained" color="primary">
        Register
      </Button>
    </form>
  );
};

export default RegisterForm;
