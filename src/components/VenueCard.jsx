import React from "react";

export default function VenueCard({ venue }) {
  // stjerner basert på rating
  function renderStars(rating) {
    const fullStars = Math.round(rating);
    return (
      <span className="text-greenDark">
        {"★".repeat(fullStars)}
        {"☆".repeat(5 - fullStars)}
      </span>
    );
  }

  // fallback hvis bilde mangler
  const imageUrl =
    venue.media?.[0]?.url || "https://via.placeholder.com/300x200";
  const imageAlt = venue.media?.[0]?.alt || venue.name || "Venue image";

  return (
    // Kort for venue
    <div className="bg-card p-4 rounded-xl shadow-md sm:shadow-xl border-2 border-gray-300 relative overflow-hidden flex flex-col font-roboto">
      <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-black/5 rounded-xl pointer-events-none"></div>
      <div className="relative z-10 flex flex-col flex-1">
        {/* Bilde av venue */}
        <img
          src={imageUrl}
          alt={imageAlt}
          className="w-full h-40 object-cover rounded-t-xl mb-2"
        />
        <div className="p-4 flex flex-col flex-1">
          {/* navn og maks gjester */}
          <div className="flex justify-between items-center mb-1">
            <span className="font-poppins font-bold text-base truncate">{venue.name}</span>
            <span className="text-xs text-gray-600">
              Guests: {venue.maxGuests}
            </span>
          </div>

          {/* beliggenhet */}
          <div className="text-xs text-gray-500 mb-2">
            {venue.location?.city || "Unknown"}, {venue.location?.country || ""}
          </div>

          {/* pris og vurdering */}
          <div className="flex justify-between items-end mt-auto">
            <span className="text-blue font-bold text-base">
              NOK {venue.price}
            </span>
            <span className="text-xs text-gray-600 flex flex-col items-end">
              <span>{renderStars(venue.rating)}</span>
              <span className="text-[10px] text-gray-500">
                ({venue.rating?.toFixed(1) || "0.0"})
              </span>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
