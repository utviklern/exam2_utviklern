import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import LoadingSpinner from "../components/LoadingSpinner";
import Modal from "../components/Modal";

export default function Register() {
  // Skjemadata
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    avatar: "",
    venueManager: null,
  });

  // Feilmeldinger og loading state
  const [message, setMessage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errorField, setErrorField] = useState(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    setErrorField(null);

    // Sjekker om det er en gyldig e-post
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setMessage(" enter a valid @stud.noroff.no email address.");
      setErrorField("email");
      setLoading(false);
      return;
    }

    // Sjekker noroff mail
    if (!formData.email.endsWith("@stud.noroff.no")) {
      setMessage("Email must end with '@stud.noroff.no'.");
      setErrorField("email");
      setLoading(false);
      return;
    }

    // Sjekker lengde på passord
    if (formData.password.length < 8) {
      setMessage("Password must be at least 8 characters.");
      setErrorField("password");
      setLoading(false);
      return;
    }

    // Sjekker om man er venue manager
    if (formData.venueManager === null) {
      setMessage("select if youre going to rent out or not.");
      setErrorField("venueManager");
      setLoading(false);
      return;
    }

    // Lager objekt for API
    const user = {
      name: formData.name,
      email: formData.email,
      password: formData.password,
      avatar: formData.avatar
        ? { url: formData.avatar, alt: "User avatar" }
        : {
            url: "https://cdn.pixabay.com/photo/2017/11/10/05/48/user-2935527_960_720.png",
            alt: "Default user avatar, credit: raphaelsilva at pixabay.com",
          },
      venueManager: formData.venueManager,
    };

    try {
      // Registrerer bruker
      const res = await fetch("https://v2.api.noroff.dev/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(user),
      });

      const data = await res.json();

      // Håndterer feil fra API
      if (!res.ok) {
        const errMsg = data.errors?.[0]?.message || "Registration failed.";
        if (
          errMsg.toLowerCase().includes("email") ||
          errMsg.toLowerCase().includes("name") ||
          errMsg === "Profile already exists"
        ) {
          throw new Error("Username or email is already in use");
        }
        throw new Error(errMsg);
      }

      setShowSuccessModal(true);
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
          <h1 className="font-poppins text-xl sm:text-2xl md:text-3xl font-bold text-center text-blue mb-6">
            Create your account
          </h1>

          {/* feilmelding */}
          {message && (
            <div className="mb-4 text-sm text-center text-red font-sans">
              {message}
            </div>
          )}

          {/* Skjema for å registrering */}
          <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6 font-sans">
            {/* brukernavn */}
            <div>
              <label className="text-primaryText block mb-1 text-sm sm:text-base">Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                required
                className={`w-full px-4 py-2 border-2 rounded-full bg-white text-primaryText text-base sm:text-lg placeholder:text-placeholder focus:outline-none focus:border-greenDark focus:ring-1 focus:ring-greenDark ${
                  errorField === "name" ? "border-red" : ""
                }`}
                placeholder="Example"
              />
            </div>

            {/* mail field */}
            <div>
              <label className="text-primaryText block mb-1 text-sm sm:text-base">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={(e) => {
                  setFormData({ ...formData, email: e.target.value });
                  setErrorField(null);
                  setMessage(null);
                }}
                required
                className={`w-full px-4 py-2 border-2 rounded-full bg-white text-primaryText text-base sm:text-lg placeholder:text-placeholder focus:outline-none focus:border-greenDark focus:ring-1 focus:ring-greenDark ${
                  errorField === "email" ? "border-red" : ""
                }`}
                placeholder="example@stud.noroff.no"
              />
            </div>

            {/* Passord field */}
            <div>
              <label className="text-primaryText block mb-1 text-sm sm:text-base">Password</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
                required
                className={`w-full px-4 py-2 border-2 rounded-full bg-white text-primaryText text-base sm:text-lg placeholder:text-placeholder focus:outline-none focus:border-greenDark focus:ring-1 focus:ring-greenDark ${
                  errorField === "password" ? "border-red" : ""
                }`}
                placeholder="********"
              />
            </div>

            {/* Avatar field */}
            <div>
              <label className="text-primaryText block mb-1 text-sm sm:text-base">
                Avatar (optional, can be set later)
              </label>
              <input
                type="url"
                name="avatar"
                value={formData.avatar}
                onChange={(e) =>
                  setFormData({ ...formData, avatar: e.target.value })
                }
                className={`w-full px-4 py-2 border-2 rounded-full bg-white text-primaryText text-base sm:text-lg placeholder:text-placeholder focus:outline-none focus:border-greenDark focus:ring-1 focus:ring-greenDark ${
                  errorField === "avatar" ? "border-red" : ""
                }`}
                placeholder="Paste img-url here"
              />
            </div>

            {/* Venue manager knapper*/}
            <div>
              <label className="text-primaryText block mb-2 text-sm sm:text-base">
                Are you going to rent out? <span className="text-red">*</span>
              </label>
              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, venueManager: true })}
                  className={`w-1/2 py-2 rounded-full border ${
                    formData.venueManager === true
                      ? "bg-black text-white"
                      : "bg-white text-black"
                  } ${errorField === "venueManager" ? "border-red" : ""}`}
                >
                  Yes
                </button>
                <button
                  type="button"
                  onClick={() =>
                    setFormData({ ...formData, venueManager: false })
                  }
                  className={`w-1/2 py-2 rounded-full border ${
                    formData.venueManager === false
                      ? "bg-black text-white"
                      : "bg-white text-black"
                  } ${errorField === "venueManager" ? "border-red" : ""}`}
                >
                  No
                </button>
              </div>
            </div>

            {/* Submit button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-2 bg-green text-black rounded-full hover:bg-greenDark"
            >
              {loading ? "Creating..." : "Create account"}
            </button>
          </form>

          {/* Login link */}
          <p className="text-xs sm:text-sm text-center mt-4">
            Already have an account?{" "}
            <Link to="/login" className="text-red hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </div>

      {/* Success Modal */}
      <Modal
        isOpen={showSuccessModal}
        onClose={() => {
          setShowSuccessModal(false);
          navigate("/login");
        }}
        onConfirm={() => {
          setShowSuccessModal(false);
          navigate("/login");
        }}
        title="Account created!"
        message="Your account has been created. You can now log in."
        showCancel={false}
      />
    </div>
  );
}
