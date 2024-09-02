// components/SelectionForm.js
"use client";
import React, { useState } from "react";
import Garis from "./Garis";

const SelectionForm = ({
  onContinue,
  onBack,
}: {
  onContinue: any;
  onBack: any;
}) => {
  const [language, setLanguage] = useState("Bahasa Inggris");
  const [duration, setDuration] = useState("Singkat - 5 menit");

  const handleSubmit = () => {
    // Call the onContinue function to pass the selected values
    onContinue({ language, duration });
  };

  return (
    <div className="bg-white shadow-md rounded-lg p-6 w-96 mx-auto">
      <h2 className="text-lg text-black font-semibold mb-4">
        Pilih Bahasa Interview
      </h2>

      <div className="mb-4">
        <label
          htmlFor="language"
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          Bahasa Interview
        </label>
        <select
          id="language"
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
          className="block w-full p-2 text-black border border-gray-300 rounded-lg"
        >
          <option>Bahasa Inggris</option>
          <option disabled>Bahasa Indonesia (COMING SOON)</option>
        </select>
      </div>

      <div className="mb-4">
        <label
          htmlFor="duration"
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          Durasi
        </label>
        <select
          id="duration"
          value={duration}
          onChange={(e) => setDuration(e.target.value)}
          className="block w-full p-2 border text-black border-gray-300 rounded-lg"
        >
          <option>Singkat - 5 menit</option>
          <option>Sedang - 10 menit</option>
          <option>Panjang - 15 menit</option>
        </select>
      </div>

      <Garis />
      <div className="flex justify-between items-center mt-6">
        <button
          onClick={onBack}
          className="border border-gray-400 text-gray-600 px-4 py-2 rounded hover:bg-gray-200"
        >
          Kembali
        </button>
        <button
          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
          onClick={handleSubmit}
        >
          Lanjut
        </button>
      </div>
    </div>
  );
};

export default SelectionForm;
