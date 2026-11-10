import { useEffect, useState } from 'react'
import { supabase } from '../supabase.js'

export default function Appointments() {
  const [appointments, setAppointments] = useState([])
  const [patients, setPatients] = useState([])
  const [patientId, setPatientId] = useState('')
  const [date, setDate] = useState('')
  const [error, setError] = useState('')

  async function load() {
    const a = await supabase
      .from('appointments')
      .select('id, appointment_date, status, patients(name)')
      .order('appointment_date')
    if (a.error) setError(a.error.message)
    else setAppointments(a.data)

    const p = await supabase.from('patients').select('id, name').order('name')
    if (!p.error) setPatients(p.data)
  }

  useEffect(() => {
    load()
  }, [])

  async function addAppointment(e) {
    e.preventDefault()
    if (!patientId || !date) return
    const { error } = await supabase.from('appointments').insert({
      patient_id: Number(patientId),
      appointment_date: new Date(date).toISOString(),
    })
    if (error) setError(error.message)
    setDate('')
    load()
  }

  async function toggleStatus(a) {
    const next = a.status === 'done' ? 'pending' : 'done'
    await supabase.from('appointments').update({ status: next }).eq('id', a.id)
    load()
  }

  async function removeAppointment(id) {
    await supabase.from('appointments').delete().eq('id', id)
    load()
  }

  const pending = appointments.filter((a) => a.status === 'pending').length
  const done = appointments.filter((a) => a.status === 'done').length

  return (
    <div className="card">
      <h1>المواعيد</h1>

      <div className="stats">
        <div className="stat"><b>{patients.length}</b>المرضى</div>
        <div className="stat"><b>{pending}</b>معلقة</div>
        <div className="stat"><b>{done}</b>منتهية</div>
      </div>

      <form onSubmit={addAppointment} className="row">
        <select value={patientId} onChange={(e) => setPatientId(e.target.value)}>
          <option value="">اختاري المريض</option>
          {patients.map((p) => (
            <option key={p.id} value={p.id}>{p.name}</option>
          ))}
        </select>
        <input type="datetime-local" value={date} onChange={(e) => setDate(e.target.value)} />
        <button>إضافة</button>
      </form>

      {error && <p className="msg">{error}</p>}

      <ul className="list">
        {appointments.map((a) => (
          <li key={a.id}>
            <span>
              {a.patients?.name} <span className="muted">{new Date(a.appointment_date).toLocaleString('ar')}</span>
            </span>
            <span>
              <button className="secondary" onClick={() => toggleStatus(a)}>
                {a.status === 'done' ? 'منتهي ✓' : 'معلق'}
              </button>
              <button className="danger" onClick={() => removeAppointment(a.id)}>حذف</button>
            </span>
          </li>
        ))}
        {appointments.length === 0 && <li className="muted">لا توجد مواعيد.</li>}
      </ul>
    </div>
  )
}