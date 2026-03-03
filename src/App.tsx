import { useState, useEffect } from 'react'
import type { Session } from '@supabase/supabase-js'
import { supabase } from './lib/supabaseClient'
import Auth from './Pages/Auth'
// import './App.css'

function App() {
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      setLoading(false)
    })

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })

    return () => subscription.unsubscribe()
  }, [])

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', width: '100vw' }}>
        <p>Loading...</p>
      </div>
    )
  }

  if (!session) {
    return <Auth />
  }

  return (
    // <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', padding: '2rem', fontFamily: 'system-ui, sans-serif' }}>
    //   <div style={{ background: 'white', padding: '2rem', borderRadius: '12px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)', color: '#333', maxWidth: '500px', width: '100%' }}>
    //     <h1 style={{ marginTop: 0 }}>Dashboard</h1>
    //     <p>Welcome! You are successfully logged in with Supabase.</p>
    //     <div style={{ background: '#f1f5f9', padding: '1rem', borderRadius: '8px', marginBottom: '1.5rem', wordBreak: 'break-all' }}>
    //       <strong>Email:</strong> {session.user.email}<br />
    //       <strong>User ID:</strong> {session.user.id}
    //     </div>
    //     <button
    //       onClick={() => supabase.auth.signOut()}
    //       style={{
    //         background: '#ef4444',
    //         color: 'white',
    //         border: 'none',
    //         padding: '0.5rem 1rem',
    //         borderRadius: '6px',
    //         cursor: 'pointer',
    //         fontWeight: 'bold'
    //       }}
    //     >
    //       Sign Out
    //     </button>
    //   </div>
    // </div>
    <Auth />
  )
}

export default App
