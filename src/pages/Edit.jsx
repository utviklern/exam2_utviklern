import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

export default function Edit() {
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

  // states for lasting, melding og tilgang
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [isVenueManager, setIsVenueManager] = useState(null);
  const [profileLoading, setProfileLoading] = useState(true);

  //  auth og api
  const accessToken = localStorage.getItem("accessToken");
  const profileName = localStorage.getItem("profileName");
  const apiKey = import.meta.env.VITE_NOROFF_API_KEY;
  const { id } = useParams();
  const navigate = useNavigate();

  // sjekker om man er venue manager og henter venue data
  useEffect(() => {
    async function fetchData() {
      setProfileLoading(true);
      try {
        // sjekker om man er venue manager
        const profileRes = await fetch(
          `https://v2.api.noroff.dev/holidaze/profiles/${profileName}`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
              "X-Noroff-API-Key": apiKey,
            },
          }
        );
        if (!profileRes.ok) throw new Error("Could not fetch profile");
        const profileData = await profileRes.json();
        setIsVenueManager(profileData.data.venueManager === true);

        // henter venue data
        const venueRes = await fetch(
          `https://v2.api.noroff.dev/holidaze/venues/${id}?_owner=true`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
              "X-Noroff-API-Key": apiKey,
            },
          }
        );
        if (!venueRes.ok) throw new Error("Could not fetch venue");
        const venueData = await venueRes.json();
        const venue = venueData.data;

        // // feilsøking
        // console.log('Venue owner:', venue.owner?.name);
        // console.log('Profile name:', profileName);
        
        if (!venue.owner || venue.owner.name.toLowerCase() !== profileName.toLowerCase()) {
          setMessage("You are not the owner of the venue");
          return;
        }

        // fyller ut form med venue data
        setName(venue.name);
        setMediaUrl(venue.media?.[0]?.url || "");
        setMediaAlt(venue.media?.[0]?.alt || "");
        setDescription(venue.description);
        setAddress(venue.location?.address || "");
        setCity(venue.location?.city || "");
        setZip(venue.location?.zip || "");
        setCountry(venue.location?.country || "");
        setPrice(venue.price?.toString() || "");
        setMaxGuests(venue.maxGuests?.toString() || "");
        setRating(venue.rating?.toString() || "");
        setWifi(venue.meta?.wifi || false);
        setParking(venue.meta?.parking || false);
        setBreakfast(venue.meta?.breakfast || false);
        setPets(venue.meta?.pets || false);
      } catch (err) {
        setMessage(err.message);
      } finally {
        setProfileLoading(false);
      }
    }
    fetchData();
  }, [accessToken, profileName, apiKey, id]);

  // håndterer radio-knapper
  function handleRadio(setter, value) {
    setter(value === "true");
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
        media: mediaUrl ? [{ url: mediaUrl, alt: mediaAlt }] : [],
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
      const res = await fetch(`https://v2.api.noroff.dev/holidaze/venues/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
          "X-Noroff-API-Key": apiKey,
        },
        body: JSON.stringify(body),
      });

      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.errors?.[0]?.message || "could not update venue");
      }

      setMessage("Venue updated successfully!");
      navigate("/profile");
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

  // hvis ikke venue manager eller ikke eier
  if (!isVenueManager || message === "You are not the owner of the venue") {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="bg-card rounded-2xl p-8 shadow-xl text-center max-w-md w-full">
          <h2 className="text-blue font-poppins font-bold text-xl mb-4">
            Not authorized
          </h2>
          <p className="text-lg">
            {message || "You must be a venue manager to edit venues."}
          </p>
        </div>
      </div>
    );
  }

  //  redigere venue
  return (
    <div className="min-h-screen bg-background flex items-center justify-center py-8 px-2 sm:px-4 md:px-8">
      <form
        onSubmit={handleSubmit}
        className="bg-card max-w-xl xl:max-w-2xl w-full rounded-2xl p-8 flex flex-col gap-3 shadow-xl"
      >
        <h1 className="text-center text-blue font-poppins font-bold text-xl mb-2">
          Edit venue
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
        <label className="font-sans font-semibold">
          image url
          <input
            name="mediaUrl"
            value={mediaUrl}
            onChange={(e) => setMediaUrl(e.target.value)}
            required
            className="block w-full rounded-full px-4 py-2 mt-1 mb-2 border-2 focus:outline-none focus:border-greenDark focus:ring-1 focus:ring-greenDark"
            placeholder="add image url here"
          />
        </label>
        {/* alt */}
        <label className="font-sans font-semibold">
          alt text
          <input
            name="mediaAlt"
            value={mediaAlt}
            onChange={(e) => setMediaAlt(e.target.value)}
            required
            className="block w-full rounded-full px-4 py-2 mt-1 mb-2 border-2 focus:outline-none focus:border-greenDark focus:ring-1 focus:ring-greenDark"
            placeholder="describe the image"
          />
        </label>
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
          {loading ? "Updating..." : "Update venue"}
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
