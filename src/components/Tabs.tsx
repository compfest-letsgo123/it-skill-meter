import { Key, useState } from "react";
import CardKomponenHasil from "@/components/CardKomponenHasil";
import Roadmap from "@/components/Roadmap";
import Feedback from "./Feedback";

export default function Tabs({ data }: { data: any }) {
  const [activeTab, setActiveTab] = useState("Evaluasi");

  const handleTabClick = (tab: string) => {
    setActiveTab(tab);
  };

  return (
    <div className="w-full border-b-2 px-4 drop-shadow-md">
      <div className="flex justify-between w-full rounded-t-2xl mx-auto bg-white">
        {["Evaluasi", "Roadmap", "Feedback"].map((tab) => (
          <button
            key={tab}
            onClick={() => handleTabClick(tab)}
            className={`px-32 pt-4 pb-3 font-semibold ${
              activeTab === tab
                ? "border-b-4 border-red-500 text-black"
                : "text-gray-500"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>
      <div className="pt-4">
        {activeTab === "Evaluasi" && (
          <div className="w-full h-auto overflow-y-auto grid grid-cols-1 sm:grid-cols-2 gap-8">
            {data.evaluation.map((item: any, index: Key | null | undefined) => (
              <CardKomponenHasil key={index} item={item} />
            ))}
          </div>
        )}

        {activeTab === "Roadmap" && <Roadmap />}
        {activeTab === "Feedback" && <Feedback />}
      </div>

      <style jsx>{`
        /* For WebKit browsers */
        .w-full::-webkit-scrollbar {
          width: 4px; /* Make scrollbar width small */
        }

        .w-full::-webkit-scrollbar-thumb {
          background-color: #888; /* Color of the scrollbar */
          border-radius: 10px; /* Roundness of the scrollbar */
        }

        .w-full::-webkit-scrollbar-thumb:hover {
          background-color: #555; /* Color of the scrollbar when hovered */
        }
      `}</style>
    </div>
  );
}
