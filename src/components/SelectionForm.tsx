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
  const [language, setLanguage] = useState("Bahasa Indonesia");
  const [numQuestions, setNumQuestions] = useState("3");

  const handleSubmit = () => {
    // Call the onContinue function to pass the selected values
    console.log(language);
    onContinue({ language, numQuestions });
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
          <option>Bahasa Indonesia</option>
          <option>Bahasa Inggris</option>
        </select>
      </div>

      <div className="mb-4">
        <label
          htmlFor="duration"
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          Jumlah pertanyaan simulasi
        </label>
        <select
          id="duration"
          value={numQuestions}
          onChange={(e) => setNumQuestions(e.target.value)}
          className="block w-full p-2 border text-black border-gray-300 rounded-lg"
        >
          <option value="3">3 Pertanyaan</option>
          <option value="4">4 Pertanyaan</option>
          <option value="5">5 Pertanyaan</option>
          <option value="6">6 Pertanyaan</option>
          <option value="7">7 Pertanyaan</option>
          <option value="8">8 Pertanyaan</option>
          <option value="9">9 Pertanyaan</option>
          <option value="10">10 Pertanyaan</option>
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
