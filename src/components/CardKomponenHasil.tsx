import Image from "next/image";
import { CircularProgress } from "@nextui-org/progress";
import { useState } from 'react';

// Function to fetch the icon based on title (unchanged)
const getIconByTitle = (title: string) => {
  const komponen = [
    { title: "Pemahaman dan Pengetahuan Teknis", icon: "/icons/knowledge.svg" },
    { title: "Keterampilan Komunikasi", icon: "/icons/komunikasi.svg" },
    { title: "Kreativitas dan Inovasi", icon: "/icons/creativity.svg" },
    { title: "Pemecahan Masalah", icon: "/icons/pemecahan-masalah.svg" },
    { title: "Penggunaan Waktu", icon: "/icons/penggunaan-waktu.svg" },
    { title: "Kepercayaan Diri dan Sikap", icon: "/icons/kepercayaan-diri.svg" },
  ];

  const komponenItem = komponen.find((item) => item.title === title);
  return komponenItem ? komponenItem.icon : null;
};

export default function CardKomponenHasil({ item }: { item: any }) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div 
      className="bg-white px-6 py-4 h-80 shadow-lg rounded-2xl relative flex flex-col space-y-4 transition-all duration-300 ease-in-out hover:shadow-xl hover:-translate-y-1"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Title card */}
      <div className="flex justify-between items-center">
        <div className="flex flex-row items-center">
          <div className="w-14 h-14 bg-gray-100 rounded-full p-2 mr-4 shadow-inner">
            <Image
              src={getIconByTitle(item.title) || ""}
              alt={item.title}
              width={40}
              height={40}
              className="object-contain transition-transform duration-300 ease-in-out transform hover:scale-110"
            />
          </div>
          <h2 className="text-xl font-bold text-gray-800 flex items-center">{item.title}</h2>
        </div>

        <div className="relative">
          <CircularProgress
            classNames={{
              svg: "w-16 h-16",
              indicator: "stroke-primary-red",
              track: "stroke-secondary-red/10",
              value: "text-sm font-semibold text-primary-red",
            }}
            value={item.score}
            strokeWidth={4}
            showValueLabel={true}
          />
          {isHovered && (
            <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 px-2 py-1 bg-gray-800 text-white text-xs rounded shadow-lg opacity-0 transition-opacity duration-300 ease-in-out group-hover:opacity-100">
              Score: {item.score}
            </div>
          )}
        </div>
      </div>

      {/* Description */}
      <div className="flex-grow overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
        <p className="text-gray-600 leading-relaxed">{item.description}</p>
      </div>
    </div>
  );
}