"use client";
import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import Tabs from "@/components/Tabs";
import { supabase } from "@/config/supabaseClient"; // Assuming you have this configured

export default function RekapHasilPage({ params }: { params: any }) {
  const { id } = params;
  
  // State to hold the data fetched from Supabase
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch data from Supabase based on the 'id' param
  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data: hasilData, error } = await supabase
          .from("hasil")
          .select(`
            id_roles_and_skills(id, type, nama),
            overview,
            level,
            created_at,
            evaluation,
            feedback
          `)
          .eq("id", parseInt(id, 10))
          .single(); // Expecting a single record
        
        if (error) {
          throw new Error("Data not found");
        }

        // Set the data if it was successfully fetched
        setData(hasilData);
      } catch (err: any) {
        setError(err.message || "Error fetching data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <h1 className="text-2xl font-bold mb-4 pt-20">Error</h1>
        <p className="text-gray-500">{error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen px-4 md:px-12 py-8 pt-28">
      <Navbar />
      {data ? (
        <div className="flex flex-col md:flex-row justify-between mb-8">
          <div className="w-full md:w-7/16 2xl:w-1/3 text-center md:top-0">
            <p className="text-gray-500">{new Date(data.created_at).toLocaleDateString()}</p>
            <p className="text-gray-500 mb-4">
              Level kamu di <span className="font-bold text-black">{data.id_roles_and_skills.nama}</span> adalah ...
            </p>
            <div className="flex justify-center mt-12">
              {data.level === "Novice" || data.level === "Intern" ? (
                <img src="/icons/level-1.svg" alt="Level 1" className="w-96" />
              ) : data.level === "Beginner" || data.level === "Junior" ? (
                <img src="/icons/level-2.svg" alt="Level 2" className="w-96" />
              ) : data.level === "Intermediate" || data.level === "Associate" ? (
                <img src="/icons/level-3.svg" alt="Level 3" className="w-96" />
              ) : data.level === "Advanced" || data.level === "Senior" ? (
                <img src="/icons/level-4.svg" alt="Level 4" className="w-96" />
              ) : data.level === "Expert" || data.level === "Lead" ? (
                <img src="/icons/level-5.svg" alt="Level 5" className="w-96" />
              ) : (
                <img src="/icons/level-3.svg" alt="Default Level" className="w-96" />
              )}
            </div>
            <h1 className="text-5xl font-bold text-black mb-4 pt-8">
              {data.evaluation?.title}
            </h1>
            <h1 className="text-5xl font-bold text-black mb-4 pt-8">
              {data.level}
            </h1>
            <div className="bg-white h-96 mt-12 rounded-xl shadow-lg mx-8 p-4">
              <p className="text-black">{data.overview}</p>
            </div>
          </div>

          <div className="w-full md:w-9/16 2xl:w-2/3">
            <Tabs data={data} />
          </div>
        </div>
      ) : (
        <div>
          <h1 className="text-2xl font-bold mb-4 pt-20">Data Not Found</h1>
          <p className="text-gray-500">The data you are looking for does not exist.</p>
        </div>
      )}
    </div>
  );
}
