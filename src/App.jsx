import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function App() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [view, setView] = useState("login");
  const navigate = useNavigate();

  // Redirect if already logged in
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) navigate("/home", { replace: true });
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (view === "register" && (!username || !email || !password)) {
      setMessage("All fields are required");
      return;
    }

    if (view === "login" && (!email || !password)) {
      setMessage("All fields are required");
      return;
    }

    try {
      // 🔥 Your Render backend API
      const endpoint =
        view === "login"
          ? "https://screen-recorder-backend-8ujt.onrender.com/api/auth/login"
          : "https://screen-recorder-backend-8ujt.onrender.com/api/auth/register";

      const body =
        view === "login"
          ? { email, password }
          : { username, email, password };

      const res = await axios.post(endpoint, body);

      if (res.data.success) {
        if (view === "register") {
          setMessage("Registered successfully. Please login.");
          setView("login");
          setEmail("");
          setPassword("");
          setUsername("");
          return;
        }

        localStorage.setItem("token", res.data.token);
        localStorage.setItem("userId", res.data.user?.id);

        navigate("/home", { replace: true });
      } else {
        setMessage(res.data.message);
      }
    } catch (err) {
      setMessage("Server error");
      console.log(err.message);
    }
  };

  return (
    <div className="flex flex-col md:flex-row h-screen w-screen">
      {/* LEFT SIDE */}
      <div className="flex-1 bg-gradient-to-br from-[#1e3c72] to-[#2a5298] flex flex-col justify-center items-center text-white px-6 py-12">
        <h1 className="text-4xl font-semibold mb-3 text-center">
          Welcome to the Screen Recorder App
        </h1>
        <img
          src="./home_screen_image.png"
          alt="Screen Recorder"
          className="w-36 sm:w-44 mb-6"
        />
        <p className="text-lg opacity-90 text-center">Secure Login / Register</p>
      </div>

      {/* RIGHT SIDE */}
      <div className="flex-1 bg-gradient-to-br from-purple-700 via-purple-600 to-purple-500 flex justify-center items-center p-6 sm:p-10">
        <div className="w-full max-w-md bg-white/15 backdrop-blur-xl border border-white/20 p-8 rounded-xl shadow-2xl">
          
          {/* Toggle Buttons */}
          <div className="flex mb-6">
            <button
              onClick={() => setView("login")}
              className={`flex-1 py-2 rounded-l-md font-semibold transition ${
                view === "login"
                  ? "bg-white text-purple-700"
                  : "bg-white/20 text-white hover:bg-white/30"
              }`}
            >
              Login
            </button>

            <button
              onClick={() => setView("register")}
              className={`flex-1 py-2 rounded-r-md font-semibold transition ${
                view === "register"
                  ? "bg-white text-purple-700"
                  : "bg-white/20 text-white hover:bg-white/30"
              }`}
            >
              Register
            </button>
          </div>

          {/* FORM */}
          <form className="flex flex-col gap-4 sm:gap-5" onSubmit={handleSubmit}>
            {view === "register" && (
              <div>
                <label className="text-white mb-1 block">Username</label>
                <input
                  type="text"
                  placeholder="Enter Username"
                  className="w-full px-3 py-2 rounded-md bg-white/25 text-white placeholder-white/70 focus:bg-white/40 outline-none transition"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </div>
            )}

            <div>
              <label className="text-white mb-1 block">Email</label>
              <input
                type="email"
                placeholder="Enter Email"
                className="w-full px-3 py-2 rounded-md bg-white/25 text-white placeholder-white/70 focus:bg-white/40 outline-none transition"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div>
              <label className="text-white mb-1 block">Password</label>
              <input
                type="password"
                placeholder="Enter Password"
                className="w-full px-3 py-2 rounded-md bg-white/25 text-white placeholder-white/70 focus:bg-white/40 outline-none transition"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <button
              type="submit"
              className="w-full bg-black/50 hover:bg-black/70 transition text-white font-semibold py-2 rounded-md shadow-md"
            >
              {view === "login" ? "Login" : "Register"}
            </button>
          </form>

          {/* MESSAGE */}
          {message && (
            <p className="text-yellow-200 mt-3 text-center font-medium text-sm sm:text-base">
              {message}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
