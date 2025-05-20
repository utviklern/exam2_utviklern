import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../App";
import LoadingSpinner from "../components/LoadingSpinner";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState(null);
  const navigate = useNavigate();
  const { setIsLoggedIn } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);

  // Håndterer innsending av skjema
  async function handleSubmit(e) {
    e.preventDefault();
    setMessage(null);
    setLoading(true);

    try {
      const response = await fetch("https://v2.api.noroff.dev/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();

      // hvis feil
      if (!response.ok) {
        throw new Error(data.errors?.[0]?.message || "wrong email or password");
      }

      // Lagrer access token og navn i local storage
      localStorage.setItem("accessToken", data.data.accessToken);
      localStorage.setItem("profileName", data.data.name);
      setIsLoggedIn(true);
      navigate("/profile");
    } catch (err) {
      setMessage(err.message);
    } finally {
      setLoading(false);
    }
  }

  if (loading) return <LoadingSpinner />;

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-page-mobile sm:px-page mt-page-mobile sm:mt-page">
      <div className="bg-card p-8 rounded-xl shadow-md sm:shadow-xl w-full max-w-md sm:max-w-lg md:max-w-xl mx-auto relative border-2 border-gray-300">
        <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-black/5 rounded-xl"></div>
        <div className="relative z-10">
          <h1 className="font-poppins text-xl sm:text-2xl md:text-3xl font-bold text-center text-blue mb-2">
            Welcome!
          </h1>
          <p className="text-center mb-6 text-base sm:text-lg">Login to your account</p>
          {/* Feil */}
          {message && (
            <div className="mb-4 text-sm text-center text-red font-sans">
              {message}
            </div>
          )}
          {/* selve skjema */}
          <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6 font-sans">
            <div>
              <label className="text-primaryText block mb-1 text-sm sm:text-base">Email</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                className="w-full px-4 py-2 border-2 rounded-full bg-white text-primaryText text-base sm:text-lg placeholder:text-placeholder focus:outline-none focus:border-greenDark focus:ring-1 focus:ring-greenDark"
                placeholder="Example@stud.noroff.no"
              />
            </div>
            <div>
              <label className="text-primaryText block mb-1 text-sm sm:text-base">Password</label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                className="w-full px-4 py-2 border-2 rounded-full bg-white text-primaryText text-base sm:text-lg placeholder:text-placeholder focus:outline-none focus:border-greenDark focus:ring-1 focus:ring-greenDark"
                placeholder="********"
              />
            </div>
            <button
              type="submit"
              className="w-full py-2 bg-green text-black rounded-full hover:bg-greenDark"
            >
              log in
            </button>
          </form>
          <p className="text-xs sm:text-sm text-center mt-4">
            Dont have an account?{" "}
            <Link to="/register" className="text-red hover:underline">
              sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
