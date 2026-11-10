import { useEffect, useState } from 'react'
import { supabase } from '../supabase.js'

export default function Patients() {
  const [patients, setPatients] = useState([])
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [search, setSearch] = useState('')
  const [error, setError] = useState('')

  async function load() {
    const { data, error } = await supabase.from('patients').select('*').order('id')
    if (error) setError(error.message)
    else setPatients(data)
  }

  useEffect(() => {
    load()
  }, [])

  async function addPatient(e) {
    e.preventDefault()
    if (!name.trim()) return
    const { error } = await supabase.from('patients').insert({ name, phone })
    if (error) setError(error.message)
    setName('')
    setPhone('')
    load()
  }

  async function removePatient(id) {
    const { error } = await supabase.from('patients').delete().eq('id', id)
    if (error) setError(error.message)
    load()
  }

  const shown = patients.filter((p) => p.name.includes(search))

  return (
    <div className="card">
      <h1>المرضى</h1>

      <form onSubmit={addPatient} className="row">
        <input placeholder="الاسم" value={name} onChange={(e) => setName(e.target.value)} />
        <input placeholder="الهاتف" value={phone} onChange={(e) => setPhone(e.target.value)} />
        <button>إضافة</button>
      </form>

      <input
        className="search"
        placeholder="بحث بالاسم..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {error && <p className="msg">{error}</p>}

      <ul className="list">
        {shown.map((p) => (
          <li key={p.id}>
            <span>{p.name} <span className="muted">{p.phone}</span></span>
            <button className="danger" onClick={() => removePatient(p.id)}>حذف</button>
          </li>
        ))}
        {shown.length === 0 && <li className="muted">لا يوجد مرضى.</li>}
      </ul>
    </div>
  )
}