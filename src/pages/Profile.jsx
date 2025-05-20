import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";

// Fallback hvis biler ikke er tilgjengelig
const fallbackAvatar =
  "https://cdn.pixabay.com/photo/2017/11/10/05/48/user-2935527_960_720.png";
const fallbackVenueImage =
  "https://cdn.pixabay.com/photo/2017/11/10/04/47/image-2935360_1280.png";

// dato
function formatDate(dateStr) {
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-GB");
}

export default function Profile() {
  // states
  const [user, setUser] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [venues, setVenues] = useState([]);
  const [activeTab, setActiveTab] = useState("bookings");
  const [isVenueManager, setIsVenueManager] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const navigate = useNavigate();
  const accessToken = localStorage.getItem("accessToken");
  const profileName = localStorage.getItem("profileName");
  const apiKey = import.meta.env.VITE_NOROFF_API_KEY;

  // Fetcher brukerdata og booking
  useEffect(() => {
    if (!accessToken || !profileName) return navigate("/login");

    const headers = {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
      "X-Noroff-API-Key": apiKey,
    };

    async function fetchData() {
      try {
        setLoading(true);

        // Fetcher profil
        const profileRes = await fetch(
          `https://v2.api.noroff.dev/holidaze/profiles/${profileName}`,
          { headers }
        );

        if (profileRes.status === 401) {
          const data = await profileRes.json();
          const isApiKeyError = data?.message?.includes("API key");

          if (!isApiKeyError) {
            localStorage.clear();
            return navigate("/login");
          }
          throw new Error("error apu key.");
        }

        if (!profileRes.ok) throw new Error("error fetching profile.");
        const profileData = await profileRes.json();
        setUser(profileData.data);
        setIsVenueManager(profileData.data.venueManager);

        // Fetcher booking
        const bookingsRes = await fetch(
          `https://v2.api.noroff.dev/holidaze/profiles/${profileName}/bookings?_venue=true`,
          { headers }
        );

        if (!bookingsRes.ok) throw new Error("error fetching bookings.");
        const bookingsData = await bookingsRes.json();
        setBookings(bookingsData.data);

        // hvis venue manager, vises venues
        if (profileData.data.venueManager) {
          const venuesRes = await fetch(
            `https://v2.api.noroff.dev/holidaze/profiles/${profileName}/venues?_bookings=true`,
            { headers }
          );
          const venuesData = await venuesRes.json();
          setVenues(venuesData.data);
        }
      } catch (err) {
        setError(err.message);
        console.error("Fetch error:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [accessToken, profileName, apiKey, navigate]);

  // booking cancel
  async function handleCancelBooking(bookingId) {
    if (!window.confirm("Are you sure you want to cancel the booking?")) return;

    try {
      const headers = {
        Authorization: `Bearer ${accessToken}`,
        "X-Noroff-API-Key": apiKey,
      };

      await fetch(`https://v2.api.noroff.dev/holidaze/bookings/${bookingId}`, {
        method: "DELETE",
        headers,
      });

      setBookings((prev) => prev.filter((b) => b.id !== bookingId));
    } catch (err) {
      console.error("Error cancelling booking:", err);
    }
  }

  // Delete venue
  async function handleDeleteVenue(venueId) {
    if (!window.confirm("Are you sure you want to delete this venue?")) return;

    try {
      const headers = {
        Authorization: `Bearer ${accessToken}`,
        "X-Noroff-API-Key": apiKey,
      };

      await fetch(`https://v2.api.noroff.dev/holidaze/venues/${venueId}`, {
        method: "DELETE",
        headers,
      });

      setVenues((prev) => prev.filter((v) => v.id !== venueId));
    } catch (err) {
      console.error("Error deleting:", err);
    }
  }

  // Loading
  if (loading)
    return (
      <div className="min-h-screen flex justify-center items-center">
        loading...
      </div>
    );

  // Error
  if (error)
    return (
      <div className="min-h-screen flex justify-center items-center text-red-500">
        {error}
      </div>
    );

  // ikke innlogget
  if (!user)
    return (
      <div className="min-h-screen flex justify-center items-center">
        please login
      </div>
    );

  // booking cards
  const bookingCards = [];
  for (let i = 0; i < bookings.length; i++) {
    const booking = bookings[i];
    bookingCards.push(
      <div
        key={booking.id}
        className="bg-card p-4 rounded-xl shadow-md sm:shadow-xl border-2 border-gray-300 relative overflow-hidden flex flex-col font-sans"
      >
        <Link
          to={`/venues/${booking.venue?.id}`}
          className="hover:shadow-2xl transition cursor-pointer flex flex-col flex-1"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-black/5 rounded-xl pointer-events-none"></div>
          <div className="relative z-10 flex flex-col flex-1">
            <img
              src={booking.venue?.media?.[0]?.url || fallbackVenueImage}
              alt={booking.venue?.media?.[0]?.alt || booking.venue?.name}
              width={300}
              height={200}
              className="w-full h-40 object-cover rounded-t-xl mb-2"
              loading="lazy"
            />
          </div>
          <div className="p-4 flex flex-col flex-1">
            <div className="flex justify-between items-center mb-1">
              <span className="font-poppins font-bold text-base truncate">
                {booking.venue?.name}
              </span>
            </div>
            <div className="text-xs text-gray-500 mb-2">
              {booking.venue?.location?.city},{" "}
              {booking.venue?.location?.country}
            </div>
            <div className="flex justify-between items-center mb-2">
              <div className="text-xs text-gray-700">
                <div>From: {formatDate(booking.dateFrom)}</div>
                <div>To: {formatDate(booking.dateTo)}</div>
              </div>
              <div className="text-sm text-gray-600">
                Guests: {booking.guests}
              </div>
            </div>
          </div>
        </Link>

        <button
          onClick={() => handleCancelBooking(booking.id)}
          className="bg-red text-white rounded-full py-1.5 px-4 text-sm font-semibold hover:bg-redDark transition mt-auto"
        >
          Cancel booking
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <main className="flex-1 flex flex-col items-center px-page-mobile sm:px-page pt-8 pb-16 font-sans">
        <section className="w-full max-w-2xl flex flex-col items-center mb-8">
          <div className="w-40 h-40 rounded-full overflow-hidden border-4 border-green shadow-lg mb-4">
            <img
              src={user.avatar?.url || fallbackAvatar}
              alt={user.avatar?.alt || user.name}
              className="w-full h-full object-cover"
            />
          </div>
          <h1 className="font-poppins text-2xl font-bold text-primaryText mb-2 text-center">
            Hi, {user.name}!
          </h1>
          {user.bio && (
            <p className="text-gray-600 text-center mb-4">{user.bio}</p>
          )}

          <button className="bg-green text-primaryText px-6 py-2 rounded-full font-semibold hover:bg-greenDark transition mb-2">
            Edit profile
          </button>

          <hr className="w-full border-t-2 border-gray-300 my-4" />
          {/* hvis venue manager, vises venues meny, ellers vises bare bookings meny */}
          <div className="flex gap-20 font-semibold mb-8">
            <button
              className={
                activeTab === "bookings"
                  ? "underline text-black"
                  : "text-gray-500"
              }
              onClick={() => setActiveTab("bookings")}
            >
              Your bookings
            </button>
            {isVenueManager && (
              <button
                className={
                  activeTab === "venues"
                    ? "underline text-black"
                    : "text-gray-500"
                }
                onClick={() => setActiveTab("venues")}
              >
                Your venues
              </button>
            )}
          </div>
          {isVenueManager && (
            <Link
              to="/create"
              className="bg-green text-black px-6 py-2 rounded-full font-semibold hover:bg-greenDark transition mb-4 block text-center"
            >
              Create venue
            </Link>
          )}
        </section>

        <section className="w-full max-w-6xl">
          {activeTab === "bookings" ? (
            bookings.length === 0 ? (
              <div className="text-center text-gray-600">No bookings found</div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 justify-center">
                {bookingCards}
              </div>
            )
          ) : venues.length === 0 ? (
            <div className="text-center text-gray-600">
              You got no venues yet
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 justify-center">
              {(() => {
                const venueElements = [];
                for (let i = 0; i < venues.length; i++) {
                  const venue = venues[i];
                  venueElements.push(
                    <div
                      key={venue.id}
                      className="bg-card p-4 rounded-xl shadow-md sm:shadow-xl border-2 border-gray-300 overflow-hidden flex flex-col"
                    >
                      <Link
                        to={`/venues/${venue.id}`}
                        className="block hover:shadow-2xl transition cursor-pointer"
                      >
                        <img
                          src={venue.media?.[0]?.url || fallbackVenueImage}
                          alt={venue.media?.[0]?.alt || venue.name}
                          className="w-full h-40 object-cover rounded-xl mb-2"
                        />
                      </Link>
                      <h3 className="text-lg font-bold font-poppins mb-1 truncate">
                        {venue.name}
                      </h3>
                      <p className="text-sm text-gray-500 mb-2">
                        {venue.location?.city}, {venue.location?.country}
                      </p>
                      <p className="text-sm text-placeholder font-semibold">
                        Booking overview
                      </p>
                      <div className="w-full h-auto mt-2 border rounded-xl p-2 bg-white space-y-2 max-h-32 overflow-y-auto text-sm">
                        {venue.bookings && venue.bookings.length > 0 ? (
                          (() => {
                            const bookingElements = [];
                            for (let j = 0; j < venue.bookings.length; j++) {
                              const b = venue.bookings[j];
                              bookingElements.push(
                                <div
                                  key={b.id}
                                  className="border-b pb-1 last:border-0"
                                >
                                  <p className="text-gray-800 font-medium">
                                    {b.customer?.name}
                                  </p>
                                  <p className="text-gray-500 text-xs">
                                    {formatDate(b.dateFrom)} →{" "}
                                    {formatDate(b.dateTo)}
                                  </p>
                                </div>
                              );
                            }
                            return bookingElements;
                          })()
                        ) : (
                          <p className="text-gray-400 italic">
                            No bookings yet
                          </p>
                        )}
                      </div>
                      <div className="flex gap-4 mt-4">
                        <Link
                          to={`/venues/${venue.id}/edit`}
                          className="flex-1 bg-green text-black py-1 rounded-full font-semibold hover:bg-greenDark transition text-center"
                        >
                          Edit
                        </Link>
                        <button
                          onClick={() => handleDeleteVenue(venue.id)}
                          className="flex-1 bg-red text-white py-1 rounded-full font-semibold hover:bg-redDark transition"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  );
                }
                return venueElements;
              })()}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
