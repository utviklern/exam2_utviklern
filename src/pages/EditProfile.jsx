import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function EditProfile() {
  // states
  const [bio, setBio] = useState("");
  const [avatar, setAvatar] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [profileLoading, setProfileLoading] = useState(true);

  const navigate = useNavigate();
  const accessToken = localStorage.getItem("accessToken");
  const profileName = localStorage.getItem("profileName");
  const apiKey = import.meta.env.VITE_NOROFF_API_KEY;

  // henter profil
  useEffect(() => {
    async function fetchProfile() {
      setProfileLoading(true);
      try {
        const res = await fetch(
          `https://v2.api.noroff.dev/holidaze/profiles/${profileName}`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
              "X-Noroff-API-Key": apiKey,
            },
          }
        );
        if (!res.ok) throw new Error("Could not fetch profile");
        const data = await res.json();
        setBio(data.data.bio || "");
        setAvatar(data.data.avatar?.url || "");
      } catch (err) {
        setMessage(err.message);
      } finally {
        setProfileLoading(false);
      }
    }
    fetchProfile();
  }, [accessToken, profileName, apiKey]);

  // håndterer submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    try {
      const body = {
        bio,
        avatar: avatar ? { url: avatar, alt: "User avatar" } : undefined,
      };

      // oppdaterer profil
      const res = await fetch(
        `https://v2.api.noroff.dev/holidaze/profiles/${profileName}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
            "X-Noroff-API-Key": apiKey,
          },
          body: JSON.stringify(body),
        }
      );

      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.errors?.[0]?.message || "error updating profile");
      }

      window.scrollTo(0, 0);
      navigate("/profile");
    } catch (err) {
      setMessage(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (profileLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center text-xl">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center py-8 px-2 sm:px-4 md:px-8">
      <form
        onSubmit={handleSubmit}
        className="bg-card max-w-xl w-full rounded-2xl p-8 flex flex-col gap-3 shadow-xl"
      >
        <h1 className="text-center text-blue font-poppins font-bold text-xl mb-2">
          Edit profile
        </h1>

        {/* bio */}
        <label className="font-sans font-semibold">
          Bio
          <textarea
            name="bio"
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            rows={4}
            maxLength={1000}
            className="block w-full rounded-xl px-4 py-2 mt-1 mb-1 border-2 focus:outline-none focus:border-greenDark focus:ring-1 focus:ring-greenDark resize-none"
            placeholder="add bio here."
          />
          <div className="text-right text-xs text-gray-500">
            {bio.length} / 1000
          </div>
        </label>

        {/* avatar */}
        <label className="font-sans font-semibold">
          Avatar
          <input
            type="url"
            name="avatar"
            value={avatar}
            onChange={(e) => setAvatar(e.target.value)}
            className="block w-full rounded-full px-4 py-2 mt-1 mb-2 border-2 focus:outline-none focus:border-greenDark focus:ring-1 focus:ring-greenDark"
            placeholder="add avatar url here"
          />
        </label>

        {/* submit */}
        <button
          type="submit"
          disabled={loading}
          className="bg-green text-black w-full rounded-full py-2 font-semibold hover:bg-greenDark transition mt-2"
        >
          {loading ? "Updating profile.." : "Update profile"}
        </button>
        {message && (
          <div className="text-center mt-2 text-blue font-semibold">
            {message}
          </div>
        )}
      </form>
    </div>
  );
}
