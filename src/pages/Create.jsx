import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import LoadingSpinner from "../components/LoadingSpinner";
import Modal from "../components/Modal";

export default function Create() {
  // states for felt
  const [name, setName] = useState("");
  const [mediaUrl, setMediaUrl] = useState("");
  const [mediaAlt, setMediaAlt] = useState("");
  const [description, setDescription] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [zip, setZip] = useState("");
  const [country, setCountry] = useState("");
  const [price, setPrice] = useState("");
  const [maxGuests, setMaxGuests] = useState("");
  const [rating, setRating] = useState("");
  const [wifi, setWifi] = useState(false);
  const [parking, setParking] = useState(false);
  const [breakfast, setBreakfast] = useState(false);
  const [pets, setPets] = useState(false);
  const [media, setMedia] = useState([{ url: "", alt: "" }]);

  // states for lasting, melding og tilgang
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [isVenueManager, setIsVenueManager] = useState(null);
  const [profileLoading, setProfileLoading] = useState(true);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  //  auth og api
  const accessToken = localStorage.getItem("accessToken");
  const profileName = localStorage.getItem("profileName");
  const apiKey = import.meta.env.VITE_NOROFF_API_KEY;
  const navigate = useNavigate();

  // sjekker om man er venue manager
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
        setIsVenueManager(data.data.venueManager === true);
      } catch (err) {
        setIsVenueManager(false);
      } finally {
        setProfileLoading(false);
      }
    }
    fetchProfile();
  }, [accessToken, profileName, apiKey]);

  useEffect(() => {
    if (!accessToken || !profileName) {
      navigate("/login");
      return;
    }
    window.scrollTo(0, 0);
  }, [accessToken, profileName, navigate]);

  // håndterer radio-knapper
  function handleRadio(setter, value) {
    setter(value === "true");
  }

  function addImageField() {
    setMedia([...media, { url: "", alt: "" }]);
  }

  function removeImageField(idx) {
    setMedia(media.filter((_, i) => i !== idx));
  }

  function updateImageField(idx, field, value) {
    const newMedia = [...media];
    newMedia[idx][field] = value;
    setMedia(newMedia);
  }

  // håndterer sumbitt
  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    try {
      // request body
      const body = {
        name,
        media: media.filter(img => img.url.trim() !== ""),
        description,
        location: {
          address,
          city,
          zip,
          country,
        },
        price: Number(price),
        maxGuests: Number(maxGuests),
        rating: rating ? Number(rating) : 0,
        meta: {
          wifi,
          parking,
          breakfast,
          pets,
        },
      };
      // sender request til api
      const res = await fetch("https://v2.api.noroff.dev/holidaze/venues", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
          "X-Noroff-API-Key": apiKey,
        },
        body: JSON.stringify(body),
      });

      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.errors?.[0]?.message || "could not create venue");
      }

      setShowSuccessModal(true);
    } catch (err) {
      setMessage(err.message);
    } finally {
      setLoading(false);
    }
  }

  if (profileLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center text-xl">
        Loading...
      </div>
    );
  }

  if (loading) return <LoadingSpinner />;

  // hvis ikke venue manager
  if (!isVenueManager) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="bg-card rounded-2xl p-8 shadow-xl text-center max-w-md w-full">
          <h2 className="text-blue font-poppins font-bold text-xl mb-4">
            Not authorized
          </h2>
          <p className="text-lg">
            You must be a <span className="font-bold">venue manager</span> to
            create a new venue.
          </p>
        </div>
      </div>
    );
  }

  //  opprette nytt venue
  return (
    <div className="min-h-screen bg-background flex items-center justify-center py-8 px-2 sm:px-4 md:px-8">
      <form
        onSubmit={handleSubmit}
        className="bg-card max-w-xl xl:max-w-2xl w-full rounded-2xl p-8 flex flex-col gap-3 shadow-xl"
      >
        <h1 className="text-center text-blue font-poppins font-bold text-xl mb-2">
          Create new venue
        </h1>
        {/* tittel */}
        <label className="font-sans font-semibold">
          Title
          <input
            name="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="block w-full rounded-full px-4 py-2 mt-1 mb-2 border-2 focus:outline-none focus:border-greenDark focus:ring-1 focus:ring-greenDark"
            placeholder="title"
          />
        </label>
        {/* img */}
        <div className="mb-2">
          <span className="font-sans font-semibold">Images</span>
          {media.map((img, idx) => (
            <div key={idx} className="flex flex-col sm:flex-row gap-2 mb-2">
              <input
                type="text"
                placeholder="img url"
                value={img.url}
                onChange={(e) => updateImageField(idx, "url", e.target.value)}
                className="flex-1 rounded-full px-4 py-2 border-2 focus:outline-none focus:border-greenDark focus:ring-1 focus:ring-greenDark"
                required={idx === 0}
              />
              <input
                type="text"
                placeholder="describe the image"
                value={img.alt}
                onChange={(e) => updateImageField(idx, "alt", e.target.value)}
                className="flex-1 rounded-full px-4 py-2 border-2 focus:outline-none focus:border-greenDark focus:ring-1 focus:ring-greenDark"
                required={idx === 0}
              />
              {media.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeImageField(idx)}
                  className="text-red font-bold px-2"
                >
                  &times;
                </button>
              )}
            </div>
          ))}
          {media.length < 5 && (
            <button
              type="button"
              onClick={addImageField}
              className="bg-green text-black px-2 py-1 rounded-full text-xs font-semibold mt-1 hover:bg-greenDark"
            >
              Add another image
            </button>
          )}
          {media.length >= 5 && (
            <div className="text-xs text-red mt-1">only 5 images allowed</div>
          )}
        </div>
        {/* beskrivelse */}
        <label className="font-sans font-semibold">
          Description
          <textarea
            name="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            rows={4}
            maxLength={1000}
            className="block w-full rounded-xl px-4 py-2 mt-1 mb-1 border-2 focus:outline-none focus:border-greenDark focus:ring-1 focus:ring-greenDark resize-none"
            placeholder=""
          />
          <div className="text-right text-xs text-gray-500">
            {description.length} / 1000
          </div>
        </label>
        {/* adresse */}
        <label className="font-sans font-semibold">
          address
          <input
            name="address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            required
            className="block w-full rounded-full px-4 py-2 mt-1 mb-2 border-2 focus:outline-none focus:border-greenDark focus:ring-1 focus:ring-greenDark"
            placeholder="e.g bredalsmarken 15"
          />
        </label>
        <label className="font-sans font-semibold">
          city
          <input
            name="city"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            required
            className="block w-full rounded-full px-4 py-2 mt-1 mb-2 border-2 focus:outline-none focus:border-greenDark focus:ring-1 focus:ring-greenDark"
            placeholder="e.g bergen"
          />
        </label>
        <label className="font-sans font-semibold">
          zip
          <input
            name="zip"
            value={zip}
            onChange={(e) => setZip(e.target.value)}
            required
            className="block w-full rounded-full px-4 py-2 mt-1 mb-2 border-2 focus:outline-none focus:border-greenDark focus:ring-1 focus:ring-greenDark"
            placeholder="e.g 5383"
          />
        </label>
        <label className="font-sans font-semibold">
          Country
          <input
            name="country"
            value={country}
            onChange={(e) => setCountry(e.target.value)}
            required
            className="block w-full rounded-full px-4 py-2 mt-1 mb-2 border-2 focus:outline-none focus:border-greenDark focus:ring-1 focus:ring-greenDark"
            placeholder="e.g norway"
          />
        </label>
        {/* fasiliteter */}
        <div className="flex flex-col gap-2">
          <span className="font-sans font-semibold">Parking available?</span>
          <div className="flex gap-4">
            <label
              className={`flex-1 text-center cursor-pointer border rounded-full py-2 transition
                ${
                  parking
                    ? "bg-green text-black font-bold border-green"
                    : "bg-white text-black border-gray-400"
                }`}
            >
              <input
                type="radio"
                name="parking"
                value="true"
                checked={parking === true}
                onChange={(e) => handleRadio(setParking, e.target.value)}
                className="sr-only"
              />
              yes
            </label>
            <label
              className={`flex-1 text-center cursor-pointer border rounded-full py-2 transition
                ${
                  parking === false
                    ? "bg-red text-white font-bold border-red"
                    : "bg-white text-black border-gray-400"
                }`}
            >
              <input
                type="radio"
                name="parking"
                value="false"
                checked={parking === false}
                onChange={(e) => handleRadio(setParking, e.target.value)}
                className="sr-only"
              />
              no
            </label>
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <span className="font-sans font-semibold">Pets allowed?</span>
          <div className="flex gap-4">
            <label
              className={`flex-1 text-center cursor-pointer border rounded-full py-2 transition
                ${
                  pets
                    ? "bg-green text-black font-bold border-green"
                    : "bg-white text-black border-gray-400"
                }`}
            >
              <input
                type="radio"
                name="pets"
                value="true"
                checked={pets === true}
                onChange={(e) => handleRadio(setPets, e.target.value)}
                className="sr-only"
              />
              yes
            </label>
            <label
              className={`flex-1 text-center cursor-pointer border rounded-full py-2 transition
                ${
                  pets === false
                    ? "bg-red text-white font-bold border-red"
                    : "bg-white text-black border-gray-400"
                }`}
            >
              <input
                type="radio"
                name="pets"
                value="false"
                checked={pets === false}
                onChange={(e) => handleRadio(setPets, e.target.value)}
                className="sr-only"
              />
              no
            </label>
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <span className="font-sans font-semibold">Wifi available?</span>
          <div className="flex gap-4">
            <label
              className={`flex-1 text-center cursor-pointer border rounded-full py-2 transition
                ${
                  wifi
                    ? "bg-green text-black font-bold border-green"
                    : "bg-white text-black border-gray-400"
                }`}
            >
              <input
                type="radio"
                name="wifi"
                value="true"
                checked={wifi === true}
                onChange={(e) => handleRadio(setWifi, e.target.value)}
                className="sr-only"
              />
              yes
            </label>
            <label
              className={`flex-1 text-center cursor-pointer border rounded-full py-2 transition
                ${
                  wifi === false
                    ? "bg-red text-white font-bold border-red"
                    : "bg-white text-black border-gray-400"
                }`}
            >
              <input
                type="radio"
                name="wifi"
                value="false"
                checked={wifi === false}
                onChange={(e) => handleRadio(setWifi, e.target.value)}
                className="sr-only"
              />
              no
            </label>
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <span className="font-sans font-semibold">breakfast available?</span>
          <div className="flex gap-4">
            <label
              className={`flex-1 text-center cursor-pointer border rounded-full py-2 transition
                ${
                  breakfast
                    ? "bg-green text-black font-bold border-green"
                    : "bg-white text-black border-gray-400"
                }`}
            >
              <input
                type="radio"
                name="breakfast"
                value="true"
                checked={breakfast === true}
                onChange={(e) => handleRadio(setBreakfast, e.target.value)}
                className="sr-only"
              />
              yes
            </label>
            <label
              className={`flex-1 text-center cursor-pointer border rounded-full py-2 transition
                ${
                  breakfast === false
                    ? "bg-red text-white font-bold border-red"
                    : "bg-white text-black border-gray-400"
                }`}
            >
              <input
                type="radio"
                name="breakfast"
                value="false"
                checked={breakfast === false}
                onChange={(e) => handleRadio(setBreakfast, e.target.value)}
                className="sr-only"
              />
              no
            </label>
          </div>
        </div>
        {/* pris/gjester/rating */}
        <label className="font-sans font-semibold">
          Price
          <input
            name="price"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            type="number"
            min="1"
            required
            className="block w-full rounded-full px-4 py-2 mt-1 mb-2 border-2 focus:outline-none focus:border-greenDark focus:ring-1 focus:ring-greenDark"
            placeholder="e.g 200"
          />
        </label>
        <label className="font-sans font-semibold">
          max guests
          <input
            name="maxGuests"
            value={maxGuests}
            onChange={(e) => setMaxGuests(e.target.value)}
            type="number"
            min="1"
            required
            className="block w-full rounded-full px-4 py-2 mt-1 mb-2 border-2 focus:outline-none focus:border-greenDark focus:ring-1 focus:ring-greenDark"
            placeholder="e.g 3"
          />
        </label>
        <label className="font-sans font-semibold">
          rating (1-5)
          <input
            name="rating"
            value={rating}
            onChange={(e) => setRating(e.target.value)}
            type="number"
            min="1"
            max="5"
            required
            className="block w-full rounded-full px-4 py-2 mt-1 mb-2 border-2 focus:outline-none focus:border-greenDark focus:ring-1 focus:ring-greenDark"
            placeholder="e.g 4"
          />
        </label>
        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className="bg-green text-black w-full rounded-full py-2 font-semibold hover:bg-greenDark transition mt-2"
        >
          {loading ? "Creating..." : "Create venue"}
        </button>
        {message && (
          <div className="text-center mt-2 text-blue font-semibold">
            {message}
          </div>
        )}
      </form>

      {/* Success Modal */}
      <Modal
        isOpen={showSuccessModal}
        onClose={() => {
          setShowSuccessModal(false);
          window.scrollTo(0, 0);
          navigate("/profile");
        }}
        onConfirm={() => {
          setShowSuccessModal(false);
          window.scrollTo(0, 0);
          navigate("/profile");
        }}
        title="Venue Created!"
        message="Your venue has been created successfully. You can view it in your profile."
        showCancel={false}
      />
    </div>
  );
}
