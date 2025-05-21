import React, { useEffect, useState } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import VenueCard from "../components/VenueCard";
import SearchBar from "../components/SearchBar";
import LoadingSpinner from "../components/LoadingSpinner";

export default function Venues() {
  const location = useLocation();
  const navigate = useNavigate();

  // søkeverdi fra URL ?search=
  const urlParams = new URLSearchParams(location.search);
  const search = urlParams.get("search")?.toLowerCase() || "";

  const [venues, setVenues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    pets: false,
    parking: false,
    wifi: false,
    breakfast: false,
    guests: 1,
  });

  // Henter alle venues ink. paginering
  useEffect(() => {
    let active = true;

    async function fetchAllVenues() {
      setLoading(true);
      let page = 1;
      let all = [];
      let lastPage = false;

      while (!lastPage) {
        const res = await fetch(
          `https://v2.api.noroff.dev/holidaze/venues?page=${page}&limit=100`
        );
        const data = await res.json();

        if (!active) return;

        all = all.concat(data.data || []);
        lastPage = data.meta?.isLastPage;
        page++;
      }

      // fjerner id duplikater 
      const uniqueVenues = Array.from(new Map(all.map(v => [v.id, v])).values());

      if (active) {
        setVenues(uniqueVenues);
        setLoading(false);
      }
    }

    fetchAllVenues();

    return () => {
      active = false;
    };
  }, []);

  //  søkefelt
  function handleSearch(input) {
    const text = input.trim();
    if (text) {
      navigate(`/venues?search=${encodeURIComponent(text)}`);
    } else {
      navigate("/venues");
    }
  }

  //  filter knapp
  function toggle(facility) {
    setFilters({ ...filters, [facility]: !filters[facility] });
  }

  // antall gjester
  function changeGuests(e) {
    const number = parseInt(e.target.value);
    setFilters({ ...filters, guests: isNaN(number) ? 1 : number });
  }

  // Filtrerer venues 
  const shownVenues = venues.filter((venue) => {
    //  søkefilter
    const name = venue.name?.toLowerCase() || "";
    const city = venue.location?.city?.toLowerCase() || "";
    const country = venue.location?.country?.toLowerCase() || "";
    const description = venue.description?.toLowerCase() || "";
    const tags = (venue.tags || []).join(" ").toLowerCase();

    const matchesSearch =
      name.includes(search) ||
      city.includes(search) ||
      country.includes(search) ||
      description.includes(search) ||
      tags.includes(search);

    //  fasiliteter
    if (filters.pets && !venue.meta?.pets) return false;
    if (filters.parking && !venue.meta?.parking) return false;
    if (filters.wifi && !venue.meta?.wifi) return false;
    if (filters.breakfast && !venue.meta?.breakfast) return false;

    //  gjester
    if (venue.maxGuests < filters.guests) return false;

    return matchesSearch;
  });

  if (loading) return <LoadingSpinner />;

  return (
    <div className="mt-page px-page font-sans">
      <h1 className="font-poppins text-2xl font-bold text-center text-blue mb-8">
        Venues
      </h1>

      {/* Søkefelt + filtre */}
      <div className="flex justify-center items-center min-h-[200px] mb-12">
        <div className="bg-white bg-opacity-95 rounded-3xl shadow-xl p-8 w-full max-w-xl">
          <SearchBar
            onSearch={handleSearch}
            placeholder="Destination, venue name, etc..."
            initialValue={search}
            filters={filters}
            onFilterChange={toggle}
          />
          <div className="flex justify-center mt-4">
            <label className="flex items-center gap-2">
              <span>Guests:</span>
              <input
                type="number"
                min={1}
                value={filters.guests}
                onChange={changeGuests}
                className="w-16 rounded px-2 py-1 border border-gray-300"
              />
            </label>
          </div>
        </div>
      </div>

   
      {loading ? (
        <div className="text-center">Loading...</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {shownVenues.map((venue) => (
            <Link 
              to={`/venues/${venue.id}`} 
              key={venue.id} 
              onClick={() => window.scrollTo(0, 0)}
              className="block hover:shadow-2xl transition-shadow"
            >
              <VenueCard venue={venue} />
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
