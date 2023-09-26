import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import Input from "../components/Input";
import Button from "../components/Button";
import Message from "../components/Message";
import { UserContext } from "../context";
import "./Login.css";

export default function SignUp() {
  const { register } = useContext(UserContext);
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSignUp = async () => {
    setErrorMessage("");
    if (password !== confirmPassword) {
      setErrorMessage("Passwords do not match");
      return;
    }
    const result = await register(username, password);
    if (result === true) {
      navigate("/");
    } else {
      setErrorMessage(result);
    }
  };
  return (
    <form
      className="container"
      onSubmit={(e) => {
        e.preventDefault();
        handleSignUp();
      }}
    >
      {errorMessage && <Message variant="error" message={errorMessage} />}
      <Input
        name="username"
        placeholder="Username"
        value={username}
        onChange={(e) => {
          setErrorMessage("");
          setUsername(e.target.value);
        }}
      />
      <Input
        name="password"
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => {
          setErrorMessage("");
          setPassword(e.target.value);
        }}
      />
      <Input
        name="confirmPassword"
        type="password"
        placeholder="Confirm Password"
        value={confirmPassword}
        onChange={(e) => {
          setErrorMessage("");
          setConfirmPassword(e.target.value);
        }}
      />
      <Button
        type="submit"
        disabled={!username || !password || !confirmPassword}
      >
        Sign Up
      </Button>
    </form>
  );
}
