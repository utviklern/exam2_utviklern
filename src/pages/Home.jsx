import React, { useEffect, useState } from "react";
import VenueCard from "../components/VenueCard";
import SearchBar from "../components/SearchBar";
import { useNavigate, Link } from "react-router-dom";
import LoadingSpinner from "../components/LoadingSpinner";

export default function Home() {
  const [venues, setVenues] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [isLastPage, setIsLastPage] = useState(false);
  const [allVenues, setAllVenues] = useState([]);
  const navigate = useNavigate();

  const LIMIT = 12; // antall venues per side

  // Henter første 12 venues når siden lastes
  useEffect(() => {
    loadVenues(1, true);
  }, []);

  // Henter venues fra api
  async function loadVenues(currentPage = 1, reset = false) {
    setLoading(true);
    try {
      const response = await fetch(
        `https://v2.api.noroff.dev/holidaze/venues?sort=created&sortOrder=desc&limit=${LIMIT}&page=${currentPage}`
      );
      const result = await response.json();
      const newVenues = result.data || [];

      const all = reset ? newVenues : [...allVenues, ...newVenues];
      const uniqueVenues = Array.from(new Map(all.map(v => [v.id, v])).values());
      setAllVenues(uniqueVenues);
      setVenues(uniqueVenues);

      // Sjekker om dette er siste side
      setIsLastPage(result.meta?.isLastPage);
      setPage(currentPage);
    } catch (error) {
      console.error("Failed to load venues:", error);
    } finally {
      setLoading(false);
    }
  }

  function handleSearch(query) {
    const q = query.trim();
    if (q) {
      navigate(`/venues?search=${encodeURIComponent(q)}`);
    }
  }

  if (loading) return <LoadingSpinner />;

  return (
    <div className="mt-page px-page font-sans">
      <h1 className="font-poppins text-2xl font-bold text-center text-blue mb-8">
        All venues
      </h1>

      <div className="flex justify-center items-center min-h-[300px]">
        <div className="bg-white bg-opacity-95 rounded-3xl shadow-xl p-8 w-full max-w-xl">
          <SearchBar
            onSearch={handleSearch}
            placeholder="Destination, venue name, etc..."
          />
        </div>
      </div>

      {/* venue cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {venues.map((venue) => (
          <Link to={`/venues/${venue.id}`} key={venue.id} className="block hover:shadow-2xl transition-shadow">
            <VenueCard venue={venue} />
          </Link>
        ))}
      </div>

      {/* vises om det er flere sider */}
      {!isLastPage && venues.length > 0 && (
        <div className="flex justify-center mt-10">
          <button
            onClick={() => loadVenues(page + 1)}
            disabled={loading}
            className="bg-green text-black rounded-full px-10 py-3 text-lg hover:bg-greenDark"
          >
            {loading ? "Loading..." : "Load more venues"}
          </button>
        </div>
      )}
    </div>
  );
}
