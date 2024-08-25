import React from "react";
import { useRouter } from "next/navigation";
import Garis from "./Garis";

const InstructionCard = ({ onContinue }: { onContinue: () => void }) => {

    const router = useRouter();
    const handleBack = () => {
        router.back()
    }

  return (
    <div className="bg-white shadow-md rounded-lg p-6 max-w-xl mx-auto">
      <h2 className="text-xl font-semibold text-black mb-4">Instruksi</h2>
      <ol className="list-decimal list-inside space-y-2 text-gray-700 text-md">
        <li>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer auctor sed quam ut mattis.</li>
        <li>
          Aliquam placerat commodo odio, vel efficitur nisl semper eu. Cras tempus libero at sem mollis, in
          ullamcorper ex congue. Sed finibus auctor laoreet. Integer id neque eget ligula lacinia ultricies.
        </li>
        <li>
          Sed est felis, scelerisque et urna non, vehicula convallis libero. Donec feugiat, quam eu finibus
          ultrices, nisl turpis tempus metus, in porta leo nisl quis ante. Nullam justo sapien, rhoncus sit
          amet euismod vel, rutrum id arcu.
        </li>
        <li>Maecenas lobortis pulvinar metus quis congue.</li>
      </ol>
      <Garis />
      <div className="flex justify-between items-center mt-6">
        <button onClick={handleBack} className="border border-gray-400 text-gray-600 px-4 py-2 rounded hover:bg-gray-200">
          Batal
        </button>
        <button onClick={onContinue} className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600">
          Lanjut
        </button>
      </div>
    </div>
  );
};

export default InstructionCard;