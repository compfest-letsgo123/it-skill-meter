// components/LoadingScreen.js

import React from 'react';

export default function LoadingScreen() {
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <div className="w-16 h-16 border-t-4 border-blue-500 border-solid rounded-full animate-spin mb-4"></div>
      <h2 className="text-xl font-semibold text-gray-700">Loading...</h2>
      <p className="mt-2 text-gray-500">Mohon tunggu sebentar</p>
    </div>
  );
}