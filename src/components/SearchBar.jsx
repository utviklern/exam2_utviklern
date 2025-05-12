import React, { useState, useEffect } from "react";

export default function SearchBar({
  onSearch,
  placeholder = "Search...",
  filters,
  onFilterChange,
  initialValue = "",
}) {
  const [query, setQuery] = useState(initialValue);

  //  input når initialValue endres
  useEffect(() => {
    setQuery(initialValue);
  }, [initialValue]);

  // filterhåndtering 
  const handleCheckboxChange = (e) => {
    const value = e.target.value;
    if (onFilterChange) {
      onFilterChange(value);
    }
  };
  // søk
  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSearch) {
      onSearch(query.trim());
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col items-center gap-4 w-full"
    >
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder={placeholder}
        className="w-full max-w-md rounded-full px-6 py-3 bg-gray-100 text-center text-lg font-sans focus:outline-none focus:ring-2 focus:ring-green"
        aria-label={placeholder}
      />

      {filters && (
        <div className="flex flex-wrap gap-4 justify-center">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              value="pets"
              checked={filters.pets}
              onChange={handleCheckboxChange}
            />
            Pets
          </label>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              value="parking"
              checked={filters.parking}
              onChange={handleCheckboxChange}
            />
            Parking
          </label>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              value="wifi"
              checked={filters.wifi}
              onChange={handleCheckboxChange}
            />
            WiFi
          </label>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              value="breakfast"
              checked={filters.breakfast}
              onChange={handleCheckboxChange}
            />
            Breakfast
          </label>
        </div>
      )}

      <button
        type="submit"
        className="bg-green rounded-full px-10 py-3 text-lg font-semibold shadow hover:bg-greenDark transition"
      >
        Search
      </button>
    </form>
  );
}
