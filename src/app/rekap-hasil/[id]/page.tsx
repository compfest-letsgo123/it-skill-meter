"use client"
import Navbar from "@/components/Navbar";
import Tabs from "@/components/Tabs";
import { hasilData } from "@/data/hasilData";

export default function RekapHasilPage({ params }: { params: any }) {
  const { id } = params;

  // Find the data with the matching id
  const data = hasilData.find((item) => item.id === parseInt(id, 10));

  return (
    <div className="min-h-screen px-4 md:px-12 py-8 pt-28">
      <Navbar />
      {/* Check if data is defined */}
      {data ? (
        // data is defined
        <div className="flex flex-col md:flex-row justify-between mb-8">
          <div className="w-full md:w-7/16 2xl:w-1/3 text-center md:top-0">
            <p className="text-gray-500">{data.date}</p>
            <p className="text-gray-500 mb-4">Level kamu di <span className="font-bold text-black">{data.title}</span> adalah ...</p>
            <div className="flex justify-center mt-12"> {/* Add this container */}
              <img src="/icons/level-1.svg" alt="" className="w-96"/>
            </div>
            <h1 className="text-5xl font-bold text-black mb-4 pt-8">
              {data.level}
            </h1>
            <div className="bg-white h-96 mt-12 rounded-xl shadow-lg mx-8 p-4">
                <p className="text-black">
                  {data.overview}
                </p>
            </div>
          </div>

          <div className="w-full md:w-9/16 2xl:w-2/3">
            <Tabs data={data} />
          </div>
          
        </div>
  
      ) : (
        // data is not defined
        //
        //
        //
        //
        //
        //
        //
        //

        <div>
          <h1 className="text-2xl font-bold mb-4 pt-20">Data Not Found</h1>
          <p className="text-gray-500">
            The data you are looking for does not exist.
          </p>
        </div>
      )}
    </div>
  );
}
