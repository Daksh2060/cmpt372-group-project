import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const SERVER = import.meta.env["VITE_SERVER"];

async function register(email: string, name: string, password: string) {
  const res = await fetch(`http://${SERVER}/users/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email: email, name: name, password: password }),
  });
  if (!res.ok) {
    const data = await res.json();
    throw new Error(data.error);
  }
  return;
}

const Register = () => {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const navigate = useNavigate();
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    register(email, name, password)
      .then(() => {
        navigate("/login");
      })
      .catch((error) => {
        if (error instanceof Error) {
          setErrorMessage(error.message); // Set error message state
        } else {
          setErrorMessage("An unexpected error occurred.");
        }
      });
  };
  return (
    <div>
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <label htmlFor="email">Email:</label>
        <input
          type="text"
          id="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
        />
        <div>
          <label htmlFor="name">Name:</label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(event) => setName(event.target.value)}
          />
        </div>
        <div>
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
          />
        </div>
        <button type="submit">Register</button>
        {errorMessage && <p>{errorMessage}</p>}
      </form>
    </div>
  );
};

export default Register;
