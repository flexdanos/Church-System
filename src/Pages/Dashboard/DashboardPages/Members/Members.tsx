import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
// import { supabase } from '../../../lib/supabaseClient';
import { FaUsers, FaPlus, FaEdit, FaTrash, FaSearch } from 'react-icons/fa';

const Members = () => {
  const [user, setUser] = useState<any>({ name: "Test User" }); // Fallback for testing
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

//   useEffect(() => {
//     const getSession = async () => {
//       const { data: { session } } = await supabase.auth.getSession();
//       if (session) {
//         setUser(session.user);
//       }
//       setLoading(false);
//     };

//     getSession();

//     const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
//       setUser(session?.user || null);
//       setLoading(false);
//     });

//     return () => subscription.unsubscribe();
//   }, []);

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
    <main className="pt-16 lg:ml-64">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 xl:px-8 py-4 sm:py-6 lg:py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-6 sm:mb-8"
        >
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2">Members</h1>
              <p className="text-gray-600">Manage your church members and their information</p>
            </div>
            <Link
              to="/dashboard/member"
              className="inline-flex items-center gap-2 px-4 py-2 bg-burgundy-600 text-white rounded-lg hover:bg-burgundy-700 transition-colors"
            >
              <FaPlus className="text-sm" />
              Add Member
            </Link>
          </div>
        </motion.div>

        {/* Search Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mb-6"
        >
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FaSearch className="text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search members..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-burgundy-500 focus:border-burgundy-500"
            />
          </div>
        </motion.div>

        {/* Members Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="bg-white rounded-lg shadow-lg overflow-hidden"
        >
          <div className="p-6">
            <div className="text-center py-12">
              <FaUsers className="text-6xl text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-600 mb-2">No members found</h3>
              <p className="text-gray-500 mb-6">Get started by adding your first church member</p>
              <Link
                to="/dashboard/add-member"
                className="inline-flex items-center gap-2 px-6 py-3 bg-burgundy-600 text-white rounded-lg hover:bg-burgundy-700 transition-colors"
              >
                <FaPlus />
                Add First Member
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </main>
  );
};

export default Members;