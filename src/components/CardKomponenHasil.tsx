// components/EvaluationCard.tsx
import Image from "next/image";
import { CircularProgress } from "@nextui-org/progress";


// Function to fetch the icon based on title_id
const getIconById = (id: number) => {
  const komponen = [
    {
      id: 1,
      nama: "Pemahaman dan Pengetahuan Teknis",
      icon: "/icons/knowledge.svg",
    },
    { id: 2, nama: "Keterampilan Komunikasi", icon: "/icons/komunikasi.svg" },
    { id: 3, nama: "Kreativitas dan Inovasi", icon: "/icons/creativity.svg" },
    { id: 4, nama: "Pemecahan Masalah", icon: "/icons/pemecahan-masalah.svg" },
    { id: 5, nama: "Penggunaan Waktu", icon: "/icons/penggunaan-waktu.svg" },
    {
      id: 6,
      nama: "Kepercayaan Diri dan Sikap",
      icon: "/icons/kepercayaan-diri.svg",
    },
  ];

  const komponenItem = komponen.find((item) => item.id === id);
  return komponenItem ? komponenItem.icon : null;
};

export default function CardKomponenHasil({ item }: { item: any }) {
  return (
    <div className="bg-white px-6 py-4 h-80 shadow-lg rounded-2xl relative flex flex-col space-y-4">
      {/* Title card */}
      <div className="flex justify-between items-center">
        <div className="flex flex-row">
          <div className="w-12 h-12 bg-gray-100 rounded-full p-2 mr-4">
            <Image
              src={getIconById(item.title_id) || ""}
              alt={item.title}
              width={40}
              height={40}
              className="object-contain"
            />
          </div>
          <h2 className="text-xl font-bold text-black flex items-center">{item.title}</h2>
        </div>

        <CircularProgress
          classNames={{
            svg: "w-16 h-16",
            indicator: "stroke-primary-red",
            track: "stroke-secondary-red/10",
            value: "text-sm font-semibold text-primary-red",
          }}
          value={78}
          strokeWidth={4}
          showValueLabel={true}
        />
      </div>

      {/* Description */}
      <p className="text-gray-500 ">{item.deskripsi}</p>
    </div>
  );
}
