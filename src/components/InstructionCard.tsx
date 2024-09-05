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
        <li>Baca instruksi berikut, jika sudah klik lanjut!</li>
        <li>
          Pilih bahasa simulasi interview yang tersedia serta jumlah pertanyaan simulasi interview yang diinginkan.
        </li>
        <li>
          Cek mikrofon dan kamera supaya simulasi interview dapat berjalan dengan lancar. Jika diyakini sudah berfungsi dengan baik, simulasi interview dapat dimulai.
        </li>
        <li>Setiap pertanyaan akan dibacakan oleh sistem dan dapat diulang oleh user.</li>
        <li>Klik start recording untuk memulai jawaban. Jika sudah selesai, dapat klik stop recording.</li>
        <li>Setelah seluruh pertanyaan selesai ditanyakan, AI akan memproses simulasi interview Anda dan tunggu hasilnya! </li>
      </ol>
      <p className="text-black"><br />Selamat mengerjakan :D</p>
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