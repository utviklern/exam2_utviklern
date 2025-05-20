import React from "react";

// enkel loading spinner
export default function LoadingSpinner() {
  return (
    <div className="min-h-screen flex justify-center items-center">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green"></div>
    </div>
  );
} 