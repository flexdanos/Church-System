import { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate, Routes, Route } from "react-router-dom";
import { supabase } from "../../lib/supabaseClient";
import NavBar from "./Components/NavBar";
import SideNav from "./Components/SideNav";
import Overview from "./DashboardPages/Overview/Overview";
import { AddMemberForm } from "./DashboardPages/Members/AddMembersForms";
import AddMemberPage from "./DashboardPages/Members/AddMember";

import { 
  FaUsers, 
  FaCalendarAlt, 
  FaChartLine, 
  FaClipboardList,
  FaCheckCircle,
  FaCog
} from "react-icons/fa";
import AddMember from "./DashboardPages/Members/AddMember";


const Dashboard = () => {
   const [user, setUser] = useState<any>(null);
   const [loading, setLoading] = useState(true);
   const navigate = useNavigate();

  useEffect(() => {
    // Get current session from Supabase
    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        setUser(session.user);
      }
      setLoading(false);
    };

    getSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-burgundy-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 mb-4">Please log in to access the dashboard.</p>
          <Link to="/" className="px-4 py-2 bg-burgundy-600 text-white rounded-lg hover:bg-burgundy-700">
            Go to Login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <NavBar user={user} onLogout={handleLogout} navigate={navigate} />
      <SideNav />
      <Routes>
        <Route path="/" element={<Overview />} />
        <Route path="/members" element={<AddMember />} />
        <Route path="/add-member" element={<AddMemberPage />} />
        <Route path="/events" element={<div className="pt-16 lg:ml-64 p-8"><h1 className="text-2xl font-bold">Events Page</h1></div>} />
        <Route path="/take-attendance" element={<div className="pt-16 lg:ml-64 p-8"><h1 className="text-2xl font-bold">Take Attendance Page</h1></div>} />
        <Route path="/qr-attendance" element={<div className="pt-16 lg:ml-64 p-8"><h1 className="text-2xl font-bold">QR Attendance Page</h1></div>} />
        <Route path="/reports" element={<div className="pt-16 lg:ml-64 p-8"><h1 className="text-2xl font-bold">Reports Page</h1></div>} />
        <Route path="/settings" element={<div className="pt-16 lg:ml-64 p-8"><h1 className="text-2xl font-bold">Settings Page</h1></div>} />
      </Routes>
    
    </div>
  )
}

export default Dashboard;