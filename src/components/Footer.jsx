import React from "react";

export default function Footer() {
  return (
    <footer className="bg-greenDark/30 py-8 px-4 mt-12 font-sans">
      <div className="bg-green p-8 rounded-md w-full max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-8">
        <div className="text-center">
          <div className="font-semibold">Phone:</div>
          <div>+47 55324567</div>
        </div>
        <div className="text-center">
          <div className="font-semibold">Contact:</div>
          <a href="mailto:support@holidaze.com" className="underline hover:text-blue-700">
            support@holidaze.com
          </a>
        </div>
        <div className="text-center">
          <div className="font-semibold">Address:</div>
          <a
            href="https://maps.app.goo.gl/NL1ET2JPcHUJhom2A"
            target="_blank"
            rel="noopener noreferrer"  //sikrere og mer privat
            className="underline hover:text-blue-700"
          >
            Bredalsmarken 15, 5015 bergen
          </a>
        </div>
      </div>
    </footer>
  );
}
