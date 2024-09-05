"use client"
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import { supabase } from "@/config/supabaseClient";

export default function InterviewDetail({
  params,
}: {
  params: { id: string };
}) {
  const { id } = params;
  const router = useRouter();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true); // New state for loading

  const handleRedirect = () => {
    router.push(`/interview/ongoing/${id}`);
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true); // Set loading to true when starting data fetch
      const { data: rolesAndSkills, error } = await supabase
        .from("roles_and_skills")
        .select("*")
        .eq("id", parseInt(id as string));

      if (error) {
        console.error("Error fetching data:", error);
      } else {
        // console.log("Fetched data:", rolesAndSkills); // Log the fetched data
        setData(rolesAndSkills[0]); // Assuming you want the first matching item
      }
      setLoading(false); // Set loading to false once data is fetched
    };

    fetchData();
  }, [id]);

  // Show a loading indicator while data is being fetched
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="loader"></div> {/* Add a loading spinner or animation here */}
      </div>
    );
  }

  // If data is not found
  if (!data) {
    return (
      <div>
        <Navbar />
        <h1 className="text-center text-2xl mt-32">Data tidak ditemukan</h1>
      </div>
    );
  }

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

  return (
    <div className="pt-32 min-h-screen md:h-screen">
      <Navbar />
      <div className="flex flex-col px-12 md:flex-row">
        <div className="flex flex-col w-full md:w-1/2 mb-8 gap-x-4">
          <h1 className="text-4xl md:text-6xl mb-4 text-black font-bold">
            {data.nama}
          </h1>
          <p className="text-gray-500 text-lg md:text-xl mb-6">
            {data.deskripsi}
          </p>
          <button
            onClick={() => handleRedirect()}
            className="bg-primary-red text-white px-6 py-3 rounded-xl font-semibold w-24 text-center"
          >
            Mulai
          </button>
        </div>
        <div className="w-full md:w-1/2 flex justify-center md:justify-end items-start">
          <img src="/icons/desk-started.svg" alt="Icon" className="w-72" />
        </div>
      </div>
      <div className="text-black py-12">
        <h2 className="text-center text-2xl font-bold mb-2">
          Komponen Penilaian
        </h2>
        <p className="text-center text-gray-500 mb-12">
          Kami menilai interview Anda berdasarkan komponen berikut
        </p>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-8 px-8 lg:px-32 xl:px-64">
          {komponen.map((item) => (
            <div
              key={item.id}
              className="flex flex-row space-y-4 space-x-2 w-72"
            >
              <Image src={item.icon} alt={item.nama} width={48} height={48} />
              <h3 className="font-semibold flex justify-start">{item.nama}</h3>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}