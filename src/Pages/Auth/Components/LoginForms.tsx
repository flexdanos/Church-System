import { useState } from 'react'
import { motion } from 'framer-motion'
import { FaChurch, FaArrowRight, FaUser, FaLock, FaSpinner, FaEye, FaEyeSlash } from 'react-icons/fa'
import { supabase } from '../../../lib/supabaseClient'

export default function LoginForms() {
    const [loading, setLoading] = useState(false)
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState<string | null>(null)
    const [showPassword, setShowPassword] = useState(false)

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault()

        try {
            setLoading(true)
            setError(null)

            const { error } = await supabase.auth.signInWithPassword({
                email,
                password,
            })

            if (error) throw error
            
            // Navigation will be handled automatically by App.tsx through session state
            console.log('Login successful!')
        } catch (error: any) {
            setError(error.error_description || error.message)
        } finally {
            setLoading(false)
        }
    }

    return (
       <div className="min-h-screen bg-gradient-to-br from-red-50 to-rose-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-4xl bg-white rounded-2xl shadow-xl overflow-hidden"
      >
        <div className="md:flex">
          {/* Left Side - Decorative */}
          <div className="hidden md:block md:w-1/2 bg-gradient-to-b from-burgundy-700 to-burgundy-900 p-8 text-white">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="flex flex-col items-center justify-center h-full"
            >
              <div className="mb-6 p-4 bg-white/10 rounded-full">
                <FaChurch className="text-4xl" />
              </div>
              <h2 className="text-2xl font-bold mb-4 text-center">Welcome Back</h2>
              <p className="text-white/80 text-center mb-8">Continue your spiritual journey with us. Access your account to manage your church activities and connect with our community.</p>
              <div className="w-16 h-1 bg-white/30 rounded-full mb-8"></div>
              <p className="text-sm text-white/80 text-center mb-4">New to our church community?</p>
              <button
                className="px-6 py-2 bg-white/10 hover:bg-white/20 rounded-full text-sm font-medium transition-colors duration-300 flex items-center gap-2"
              >
                Sign Up <FaArrowRight className="text-xs" />
              </button>
            </motion.div>
          </div>

          {/* Right Side - Form */}
          <div className="p-8 md:w-1/2">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.5 }}
            >
              <div className="mb-8">
                <h1 className="text-2xl font-bold text-gray-800 mb-2">Welcome Back</h1>
                <p className="text-gray-500 text-sm">Sign in to your account to continue</p>
              </div>

              {error && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-md text-sm">
                  {error}
                </div>
              )}

              <form onSubmit={handleLogin} className="space-y-6">
                <motion.div
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.4 }}
                  className="relative"
                >
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FaUser className="h-4 w-4 text-gray-400" />
                    </div>
                    <input
                      type="email"
                      name="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-burgundy-500 focus:border-burgundy-500 transition duration-200 text-gray-800 font-medium disabled:bg-gray-50 disabled:text-gray-500"
                      placeholder="Enter your email"
                      required
                    />
                  </div>
                </motion.div>

                <motion.div
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  className="relative"
                >
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-sm font-medium text-gray-700">Password</label>
                    <a href="/forgot-password" className="text-xs text-burgundy-600 hover:text-burgundy-800 hover:underline">
                      Forgot password?
                    </a>
                  </div>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FaLock className="h-4 w-4 text-gray-400" />
                    </div>
                    <input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      disabled={loading}
                      className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-burgundy-500 focus:border-burgundy-500 transition duration-200 text-gray-800 font-medium disabled:bg-gray-50 disabled:text-gray-500"
                      placeholder="Enter your password"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      {showPassword ? <FaEyeSlash className="h-4 w-4" /> : <FaEye className="h-4 w-4" />}
                    </button>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.7 }}
                >
                  <button
                    type="submit"
                    disabled={loading || !email || !password}
                    className="w-full py-3 bg-gradient-to-r from-burgundy-600 to-burgundy-800 text-white rounded-lg font-medium shadow-lg hover:from-burgundy-700 hover:to-burgundy-900 transition-all duration-300 transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-burgundy-500 focus:ring-offset-2 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none"
                  >
                    {loading ? (
                      <>
                        <FaSpinner className="animate-spin text-sm" />
                        Signing in...
                      </>
                    ) : (
                      <>
                        Sign In <FaArrowRight className="text-sm" />
                      </>
                    )}
                  </button>
                </motion.div>
              </form>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
                className="mt-6 text-center"
              >
                <p className="text-sm text-gray-600">
                  Don't have an account?{' '}
                  <a href="/signup" className="text-burgundy-700 font-medium hover:underline">
                    Create account
                  </a>
                </p>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </div>
    )
}
