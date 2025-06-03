import { useState } from "react";
import { useNavigate } from "react-router-dom"; // Corrected import

export default function LogIn() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  function Log() {
    fetch("http://localhost:5000/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ email, password })
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.message === "Login successful") {
          navigate("/home");
        } else {
          alert(data.message); // Show error if login failed
        }
      })
      .catch(console.error);
  }

  return (
    <div className="flex justify-center items-center h-screen">
      <div className="flex justify-center p-4 items-center h-1/2 bg-gray-100 w-1/2 drop-shadow-lg">
        <section className="flex flex-col space-y-4">
          <input
            type="text"
            placeholder="Enter your email"
            className="w-full p-4 rounded-lg"
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            className="w-full p-4 rounded-lg"
            onChange={(e) => setPassword(e.target.value)}
          />
          <section className="flex flex-col space-y-2 items-center">
            <button
              className="w-44 bg-blue-500 p-2 text-white rounded-lg"
              onClick={Log}
            >
              LogIn
            </button>
            <p>
              Don’t have an account?{" "}
              <span
                className="text-blue-500 cursor-pointer"
                onClick={() => navigate("/signup")}
              >
                Sign-Up
              </span>
            </p>
          </section>
        </section>
      </div>
    </div>
  );
}
