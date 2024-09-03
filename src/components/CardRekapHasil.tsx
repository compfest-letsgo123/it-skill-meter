import React from "react";
import { useRouter } from "next/navigation";

interface CardRekapHasilProps {
  id: Number;
  title: string;
  type: string;
  date: string;
  level: string;
  overview: string;
}

const formatDate = (dateString: string) => {
  const options: Intl.DateTimeFormatOptions = {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  };
  return new Date(dateString).toLocaleDateString('en-GB', options);

};

const CardRekapHasil = ({ id, title, type, date, level, overview }: CardRekapHasilProps) => {
  const router = useRouter(); // Use router for navigation

  const handleClick = () => {
    router.push(`/rekap-hasil/${id}`); // Navigate to rekap-hasil/[id]
  };

  return (
    <div className="bg-white shadow-md rounded-lg p-5 max-w-xl h-72 flex flex-col justify-between items-start">
      <div>
        <div className="flex flex-row justify-between">
          <p className="text-gray-400 text-sm">
            {type === 'role' ? 'Role-based' : type === 'skill' ? 'Skill-based' : 'Unknown'}
          </p>

          <p className="text-sm text-gray-400">{formatDate(date)}</p>
        </div>

        <h2 className="text-xl font-semibold text-black mb-2">{title}</h2>
        <span className="inline-block bg-white text-black rounded-full px-2 py-0.5 text-sm font-medium border border-black">
          {level}
        </span>

        <div className="my-4">
          <p className="text-gray-600 text-sm">{overview}</p>
        </div>
      </div>

      <button onClick={handleClick} className="text-red-500 hover:text-red-700 font-semibold items-end">
        Selengkapnya →
      </button>
    </div>
  );
};

export default CardRekapHasil;
