import { useEffect, useState } from 'react'
import { Routes, Route, Navigate, Link } from 'react-router-dom'
import { supabase, supabaseConfigured } from './supabase.js'
import Login from './pages/Login.jsx'
import Home from './pages/Home.jsx'
import Patients from './pages/Patients.jsx'
import Appointments from './pages/Appointments.jsx'

export default function App() {
  const [session, setSession] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session)
      setLoading(false)
    })
    const { data: listener } = supabase.auth.onAuthStateChange((_event, s) => {
      setSession(s)
    })
    return () => listener.subscription.unsubscribe()
  }, [])

  if (loading) return <p className="center">جاري التحميل...</p>

  const protect = (page) => (session ? page : <Navigate to="/login" />)

  return (
    <>
      {!supabaseConfigured && (
        <div className="warn">لم يتم ضبط مفاتيح Supabase بعد. راجعي ملف .env</div>
      )}

      {session && (
        <nav className="nav">
          <Link to="/">المهام</Link>
          <Link to="/patients">المرضى</Link>
          <Link to="/appointments">المواعيد</Link>
          <button className="secondary" onClick={() => supabase.auth.signOut()}>خروج</button>
        </nav>
      )}

      <Routes>
        <Route path="/login" element={session ? <Navigate to="/" /> : <Login />} />
        <Route path="/" element={protect(<Home session={session} />)} />
        <Route path="/patients" element={protect(<Patients />)} />
        <Route path="/appointments" element={protect(<Appointments />)} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </>
  )
}