import React from "react";

// modal som viser en melding og cancel/confirm/ok knapp
export default function Modal({ isOpen, onClose, onConfirm, title, message, showCancel = true }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 max-w-sm w-full mx-4">
        <h2 className="text-xl font-bold mb-4">{title}</h2>
        <p className="text-gray-600 mb-6">{message}</p>
        <div className="flex justify-end gap-4">
          {showCancel && (
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-600 hover:text-gray-800 font-semibold"
            >
              Cancel
            </button>
          )}
          <button
            onClick={onConfirm}
            className="px-4 py-2 bg-green text-black rounded-full font-semibold hover:bg-greenDark transition"
          >
            {showCancel ? "Confirm" : "OK"}
          </button>
        </div>
      </div>
    </div>
  );
} 