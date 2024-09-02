"use client";

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { useRouter } from 'next/navigation';
import { supabase } from '@/config/supabaseClient'; // Adjust the path according to your project structure
import Link from 'next/link';

const Navbar = () => {
const [user, setUser] = useState<any>(null);
const router = useRouter();
const pathname = usePathname();

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

const handleLogout = async () => {
  await supabase.auth.signOut();
  setUser(null);
  router.push('/login'); // Redirect to login or home page after logout
};

const linkClass = "font-medium text-black text-center py-2 hover:underline";
const activeClass = "font-semibold underline"; // Define active link style

return (
  <nav className="fixed top-0 left-0 right-0 bg-white shadow-md px-12 md:px-16 z-50">
    <div className="container mx-auto flex justify-between items-center py-4">
      {/* Logo Section */}
      <a href="/" className="flex items-center">
        <div className="w-8 h-8 rounded-full bg-gradient-to-r from-primary-red to-primary-blue mr-2"></div>
        <span className="font-semibold text-lg text-black">SkillMeterMu</span>
      </a>

      {/* Menu Items */}
      <div className="flex space-x-8">
        <Link
          href="/interview"
          className={`${linkClass} ${pathname === '/interview' ? activeClass : 'font-bold'}`}
        >
          Interview
        </Link>
        <Link
          href="/rekap-hasil"
          className={`${linkClass} ${pathname === '/rekap-hasil' ? activeClass : ''}`}
        >
          Hasil
        </Link>
        {user ? (
          <button
            onClick={handleLogout}
            className="bg-primary-red text-white px-4 py-2 rounded-xl font-semibold"
          >
            Log Out
          </button>
        ) : (
          <Link
            href="/login"
            className="bg-primary-red text-white px-4 py-2 rounded-xl font-semibold"
          >
            Login
          </Link>
        )}
      </div>
    </div>
  </nav>
);
};

export default Navbar;