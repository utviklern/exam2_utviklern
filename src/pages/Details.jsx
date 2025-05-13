// importerer komponenter
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";

export default function VenueDetails() {
  // fetcher venue fra URL
  const { id } = useParams();

  // state for data og bookingvalg
  const [venue, setVenue] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedDates, setSelectedDates] = useState([null, null]);
  const [guests, setGuests] = useState(1);
  const [bookingError, setBookingError] = useState("");
  const [bookingSuccess, setBookingSuccess] = useState("");

  // auth
  const accessToken = localStorage.getItem("accessToken");
  const apiKey = import.meta.env.VITE_NOROFF_API_KEY;

  // fetcher data med bookings
  useEffect(() => {
    async function fetchVenue() {
      try {
        setLoading(true);
        const res = await fetch(
          `https://v2.api.noroff.dev/holidaze/venues/${id}?_bookings=true`
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

  // viser loading/ikke funnet
  if (loading) return <div className="text-center mt-12">Loading...</div>;
  if (!venue) return <div className="text-center mt-12">Venue not found</div>;

  // setter bilde og fallback om bilde mangler
  const imageUrl =
    venue.media?.[0]?.url ||
    "https://cdn.pixabay.com/photo/2017/11/10/04/47/image-2935360_1280.png";
  const imageAlt = venue.media?.[0]?.alt || venue.name;

  // for enklere tilgjengelighet
  const { name, price, location, description, maxGuests, meta = {} } = venue;
  const { wifi, parking, pets, breakfast, bedrooms = 1 } = meta;
  const bookings = venue.bookings || [];

  // fetcher alle bookede datoer som array
  function getBookedDates() {
    const dates = [];
    bookings.forEach((booking) => {
      const start = new Date(booking.dateFrom);
      const end = new Date(booking.dateTo);
      for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
        dates.push(new Date(d));
      }
    });
    return dates;
  }

  const bookedDates = getBookedDates();

  // regner ut antall dager og totalpris
  let days = 0;
  let totalPrice = 0;
  if (selectedDates[0] && selectedDates[1]) {
    days =
      Math.ceil(
        (selectedDates[1].setHours(0, 0, 0, 0) -
          selectedDates[0].setHours(0, 0, 0, 0)) /
          (1000 * 60 * 60 * 24)
      ) + 1;
    totalPrice = days * price;
  }

  // formaterer dato til dd/mm/yyyy
  function formatDate(date) {
    if (!date) return "";
    return date.toLocaleDateString("en-GB");
  }

  // håndterer booking av venue
  async function handleBooking() {
    setBookingError("");
    setBookingSuccess("");

    // Validering av input
    if (!selectedDates[0] || !selectedDates[1]) {
      setBookingError("select start and end date.");
      return;
    }
    if (guests < 1 || guests > maxGuests) {
      setBookingError(`Guests must be between 1 and ${maxGuests}.`);
      return;
    }

    // sender booking til API
    try {
      const res = await fetch("https://v2.api.noroff.dev/holidaze/bookings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
          "X-Noroff-API-Key": apiKey,
        },
        body: JSON.stringify({
          dateFrom: selectedDates[0].toISOString(),
          dateTo: selectedDates[1].toISOString(),
          guests,
          venueId: id,
        }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.errors?.[0]?.message || "Booking failed, try again later");
      }

      setBookingSuccess("Booking successful!");
    } catch (e) {
      setBookingError(e.message);
    }
  }

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
          <Facility
            icon="local_parking"
            value={parking ? "Parking available" : "No parking"}
          />
          <Facility
            icon="restaurant"
            value={breakfast ? "Breakfast available" : "No breakfast"}
          />
        </div>
      </div>

      {/* detaljer */}
      <div className="bg-white p-8 mt-8 max-w-3xl mx-auto">
        <h3 className="font-sans text-lg font-semibold text-center mb-2">
          Details
        </h3>
        <div className="text-gray-700">
          {description || "No description."}
        </div>
      </div>

      <hr className="my-12 border-gray-300" />

      {/* booking */}
      <div className="flex justify-center">
        <div>
          <h3 className="font-sans text-lg font-semibold text-center mb-4">
            Booking
          </h3>

          {/* hvis bruker er logget inn */}
          {accessToken && (
            <div className="text-center text-gray-700 font-sans mb-4">
              Select dates for booking
            </div>
          )}

          {/* kalender */}
          <Calendar
            selectRange
            value={selectedDates}
            onChange={setSelectedDates}
            tileDisabled={({ date }) =>
              bookedDates.some(
                (d) =>
                  d.getFullYear() === date.getFullYear() &&
                  d.getMonth() === date.getMonth() &&
                  d.getDate() === date.getDate()
              ) || date < new Date(new Date().setHours(0, 0, 0, 0))
            }
          />

          {/* bookingform */}
          {accessToken ? (
            <>
              <div className="flex flex-col items-center mt-4">
                {/* antall gjester */}
                <label className="flex items-center gap-1">
                  <span>Guests:</span>
                  <select
                    value={guests}
                    onChange={(e) => setGuests(Number(e.target.value))}
                    className="max-w-[80px] rounded px-2 py-1 border border-gray-300"
                  >
                    {Array.from({ length: maxGuests }, (_, i) => (
                      <option key={i + 1} value={i + 1}>
                        {i + 1}
                      </option>
                    ))}
                  </select>
                  <span className="text-xs text-gray-500">
                    (max {maxGuests})
                  </span>
                </label>

                {/* datoer og totalpris */}
                {selectedDates[0] && selectedDates[1] && (
                  <div className="mt-2 text-sm text-gray-700 font-sans text-center">
                    <div>
                      <span className="font-semibold">Date from:</span>{" "}
                      {formatDate(selectedDates[0])}
                      {"  "}
                      <span className="font-semibold ml-4">Date to:</span>{" "}
                      {formatDate(selectedDates[1])}
                    </div>
                    <div>
                      {days} {days === 1 ? "day" : "days"} selected &mdash;
                      Total:{" "}
                      <span className="font-semibold text-blue">
                        {totalPrice} NOK
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {/* booking knapp */}
              <div className="flex justify-center mt-4">
                <button
                  onClick={handleBooking}
                  className="bg-green text-black rounded-full px-10 py-3 text-lg hover:bg-greenDark font-semibold"
                >
                  Book
                </button>
              </div>

              {/* feilmeldinger */}
              {bookingError && (
                <div className="mt-4 text-center text-red font-sans font-semibold">
                  {bookingError}
                </div>
              )}
              {bookingSuccess && (
                <div className="mt-4 text-center text-green-700 font-sans font-semibold">
                  {bookingSuccess}
                </div>
              )}
            </>
          ) : (
            // hvis bruker ikke er logget inn
            <div className="mt-4 text-center text-red font-sans font-semibold">
              Sign in to book
            </div>
          )}
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
