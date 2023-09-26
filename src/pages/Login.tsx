import { useState, useContext, useRef, useEffect } from "react";
import Input from "../components/Input";
import { UserContext } from "../context";
import { useNavigate } from "react-router-dom";
import Button from "../components/Button";

import Message from "../components/Message";
import "./Login.css";

export default function Login() {
  const { login } = useContext(UserContext);
  const unsernameInput = useRef<HTMLInputElement | null>(null);
  const navigate = useNavigate();
  const [username, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleLogin = async () => {
    setErrorMessage("");
    const result = await login(username, password);
    console.log(username, password);
    console.log("result:", result.toString);
    if (result === true) {
      navigate("/");
    } else {
      setErrorMessage(result);
    }
  };
  useEffect(() => {
    if (unsernameInput.current) {
      unsernameInput.current.focus();
    }
  }, []);

  return (
    <form
      className="container"
      onSubmit={(e) => {
        e.preventDefault();
        handleLogin();
      }}
    >
      {errorMessage && <Message variant="error" message={errorMessage} />}
      <Input
        ref={unsernameInput}
        name="username"
        placeholder="Username"
        value={username}
        onChange={(e) => {
          setUserName(e.target.value);
          setErrorMessage("");
        }}
      />
      <Input
        name="password"
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => {
          setPassword(e.target.value);
          setErrorMessage("");
        }}
      />
      <Button type="submit" disabled={!username || !password}>
        Login
      </Button>
    </form>
  );
}
