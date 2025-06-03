import { useState } from "react";
import { useNavigate } from "react-router";
export default function SignUp() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

const navigate=useNavigate();
  function sendData(e) {
    e.preventDefault();

    // Send the data
    fetch("http://localhost:5000/signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name, email, password }),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log("Signup successful:", data);
        navigate("/home");

      })
      .catch((error) => {
        console.error("Error during signup:", error);
      });
  }

  return (
    <div className="flex justify-center items-center h-screen">
      <div className="flex justify-center p-4 items-center h-1/2 bg-gray-100 w-1/2 drop-shadow-lg">
        <form onSubmit={sendData} className="flex flex-col space-y-4">
          <input
            type="text"
            placeholder="Enter your name"
            className="w-full p-4 rounded-lg"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <input
            type="email"
            placeholder="Enter your email"
            className="w-full p-4 rounded-lg"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            className="w-full p-4 rounded-lg"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <div className="flex flex-col space-y-2 items-center">
            <button
              type="submit"
              className="w-44 bg-blue-500 p-2 text-white rounded-lg"
            >
              Sign-Up
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
