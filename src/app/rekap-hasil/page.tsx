"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import CardRekapHasil from "@/components/CardRekapHasil";
import Navbar from "@/components/Navbar";
// import { hasilData } from "@/data/hasilData";
import { supabase } from "@/config/supabaseClient"; // Adjust the path according to your project structure

export default function Home() {
  const [filter, setFilter] = useState("All"); // State for filtering
  const [user, setUser] = useState<any>(null);
  const [showModal, setShowModal] = useState(false);
  const [hasilData, setHasilData] = useState<any[]>([]);
  const router = useRouter();

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user || null);

      // Show modal if user is not logged in
      if (!session?.user) {
        setShowModal(true);
      }
    };

    fetchUser();

    // Subscribe to auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_, session) => {
      setUser(session?.user || null);

      if (!session?.user) {
        setShowModal(true);
      }
    });

    // Cleanup subscription on unmount
    return () => {
      subscription?.unsubscribe();
    };
  }, []);

  useEffect(() => {
    const fetchHasilData = async () => {
      const { data, error } = await supabase
        .from('hasil')
        .select(`
          id,
          created_at,
          id_roles_and_skills,
          level,
          overview,
          id_user,
          roles_and_skills (type, nama)  // Join with roles_and_skills table
        `)
        .eq('id_user', user?.id); // Assuming you want data for the logged-in user

      if (error) {
        console.error("Error fetching data:", error);
      } else {
        setHasilData(data);
        console.log(data);
      }
    };

    if (user) {
      fetchHasilData();
    }
  }, [user]);

  const handleRedirectToLogin = () => {
    router.push('/login');
  };

  // Filter data based on filter state
  const filteredData =
    filter === "All"
      ? hasilData
      : hasilData.filter(card => card.roles_and_skills.type === filter);

  return (
    <div className="min-h-screen">
      <Navbar />
      <header className="text-center pb-4 pt-28">
        <h1 className="text-3xl font-bold text-black">Hasil Saya</h1>
        <nav className="flex justify-center space-x-8 mt-4">
          <button
            onClick={() => setFilter("All")}
            className={`${
              filter === "All" ? "text-black border-b-2 border-black" : "text-gray-500 hover:text-black"
            }`}
          >
            All
          </button>
          <button
            onClick={() => setFilter("role")}
            className={`${
              filter === "Role-based" ? "text-black border-b-2 border-black" : "text-gray-500 hover:text-black"
            }`}
          >
            Role-based
          </button>
          <button
            onClick={() => setFilter("skill")}
            className={`${
              filter === "Skill-based" ? "text-black border-b-2 border-black" : "text-gray-500 hover:text-black"
            }`}
          >
            Skill-based
          </button>
        </nav>
      </header>

      <section className="grid grid-cols-1 sm:grid-cols-3 2xl:grid-cols-4 gap-8 px-6 md:px-12 pb-8">
        {filteredData.map((card, index) => (
          <CardRekapHasil
            key={index}
            id={card.id} // Pass id to the Card component
            title={card.roles_and_skills.nama}
            type={card.roles_and_skills.type}
            date={card.created_at}
            level={card.level}
            overview={card.overview}
          />
        ))}
      </section>

      {/* Modal for non-logged-in users */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-50 text-black">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full text-center">
            <h2 className="text-xl font-semibold mb-4">Access Restricted</h2>
            <p className="mb-4">Please log in to access this page.</p>
            <button
              onClick={handleRedirectToLogin}
              className="bg-primary-red text-white px-6 py-3 rounded-lg font-semibold"
            >
              Go to Login
            </button>
          </div>
        </div>
      )}
    </div>
  );
}