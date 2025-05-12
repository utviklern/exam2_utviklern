import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

export default function VenueDetails() {
  const { id } = useParams();
  const [venue, setVenue] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchVenue() {
      try {
        setLoading(true);
        const res = await fetch(
          `https://v2.api.noroff.dev/holidaze/venues/${id}`
        );
        const json = await res.json();
        setVenue(json.data);
      } catch (e) {
        console.error("Error fetching venue:", e);
      } finally {
        setLoading(false);
      }
    }

    fetchVenue();
  }, [id]);

  if (loading) return <div className="text-center mt-12">Loading...</div>;
  if (!venue) return <div className="text-center mt-12">Venue not found</div>;

  const imageUrl =
    venue.media?.[0]?.url ||
    "https://cdn.pixabay.com/photo/2017/11/10/04/47/image-2935360_1280.png";
  const imageAlt = venue.media?.[0]?.alt || venue.name;

  const { name, price, location, description, maxGuests, meta = {} } = venue;
  const { wifi, parking, pets, breakfast, bedrooms = 1 } = meta;

  return (
    <div className="bg-background min-h-screen font-sans">
      {/* Header / img */}
      <div className="bg-white">
        <img
          src={imageUrl}
          alt={imageAlt}
          width={400}
          height={300}
          className="w-full h-96 object-cover"
          loading="lazy"
        />
        <div className="p-6">
          <h1 className="font-poppins text-xl font-bold mb-1">{name}</h1>
          <div className="text-gray-600 mb-2">
            {[location?.address, location?.city, location?.country]
              .filter(Boolean)
              .join(", ")}
          </div>
          <div className="font-bold mb-2 text-red">{price} NOK / night</div>
        </div>
      </div>

      {/* fasiliteter */}
      <div className="bg-white border-y border-gray-300 py-8 px-4 text-center">
        <h3 className="font-sans text-lg font-semibold mb-4">Facilities</h3>
        <div className="flex flex-col items-center gap-4 text-sm">
          <Facility icon="person" value={`${maxGuests} guest(s)`} />
          <Facility icon="bed" value={`${bedrooms} bedroom(s)`} />
          <Facility icon="pets" value={pets ? "Pets allowed" : "No pets"} />
          <Facility icon="wifi" value={wifi ? "Wifi available" : "No wifi"} />
          <Facility icon="local_parking" value={parking ? "Parking available" : "No parking"} />
          <Facility icon="restaurant" value={breakfast ? "Breakfast available" : "No breakfast"} />
        </div>
      </div>

      {/* detaljer */}
      <div className="bg-white  border-gray-300 p-8 mt-8 max-w-3xl mx-auto">
        <h3 className="font-sans text-lg font-semibold mb-2">Details</h3>
        <div className="text-gray-700">
          {description || "No description provided."}
        </div>
      </div>
    </div>
  );
}
// viser fasiliteter og detaljer

function Facility({ icon, value }) {
  return (
    <div className="flex items-center gap-2">
      <span className="material-symbols-outlined">{icon}</span>
      <span>{value}</span>
    </div>
  );
}
