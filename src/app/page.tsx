"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/config/supabaseClient'; // Adjust the path according to your project structure
import Navbar from "@/components/Navbar";

export default function Home() {
  const [user, setUser] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user || null);
    };

    fetchUser();

    // Subscribe to auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_, session) => {
      setUser(session?.user || null);
    });

    // Cleanup subscription on unmount
    return () => {
      subscription?.unsubscribe();
    };
  }, []);

  const handleClick = () => {
    if (user) {
      router.push('/interview');
    } else {
      router.push('/register');
    }
  };

  return (
    <>
      <Navbar />
      <div className="h-screen flex flex-col px-24 items-center justify-center md:flex-row">
        <div className="flex flex-col w-full md:w-1/2 mb-8 gap-x-4">
          <h1 className="text-4xl md:text-6xl mb-4 text-black">
            Mulailah <span className="font-bold">karir IT</span>{" "}
            <span className="font-bold">impianmu</span> dari sini!
          </h1>
          <p className="text-gray-500 text-lg md:text-xl mb-6">
            Pilih roadmap karir IT yang sesuai dengan ambisimu, lakukan
            wawancara interaktif, dan dapatkan feedback untuk mengasah kemampuan
            IT kamu!
          </p>
          <button
            onClick={handleClick}
            className="bg-primary-red text-white px-6 py-3 rounded-xl font-semibold w-24 text-center"
          >
            Mulai
          </button>
        </div>
        <div className="w-full md:w-1/2 flex justify-center items-center">
          <img src="/home-icon.svg" alt="Icon" className="w-64 md:w-96" />
        </div>
      </div>
    </>
  );
}
