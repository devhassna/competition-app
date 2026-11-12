import { useEffect, useState } from 'react'
import { supabase } from '../supabase.js'
export default function Volunteers() {
  const [rows, setRows] = useState([])
  const [search, setSearch] = useState('')
  const [error, setError] = useState('')
  const [form, setForm] = useState({ name: '', phone: '', city: '', skills: '' })

  async function load() {
    const { data, error } = await supabase
      .from('volunteers')
      .select('*')
      .order('id', { ascending: false })
    if (error) setError(error.message)
    else setRows(data)
  }

  useEffect(() => {
    load()
  }, [])

  async function add(e) {
    e.preventDefault()
    setError('')
    const { error } = await supabase.from('volunteers').insert(form)
    if (error) {
      setError(error.message)
      return
    }
    setForm({ name: '', phone: '', city: '', skills: '' })
    load()
  }

  async function remove(id) {
    if (!confirm('حذف هذا المتطوع؟')) return
    const { error } = await supabase.from('volunteers').delete().eq('id', id)
    if (error) setError(error.message)
    else load()
  }

  const shown = rows.filter((r) =>
    (r.name || '').toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div>
      <h2>المتطوعون ({rows.length})</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}

      <form onSubmit={add}>
        <input
          placeholder="الاسم"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          required
        />
        <input
          placeholder="الهاتف"
          value={form.phone}
          onChange={(e) => setForm({ ...form, phone: e.target.value })}
        />
        <input
          placeholder="المدينة"
          value={form.city}
          onChange={(e) => setForm({ ...form, city: e.target.value })}
        />
        <input
          placeholder="المهارات"
          value={form.skills}
          onChange={(e) => setForm({ ...form, skills: e.target.value })}
        />
        <button type="submit">إضافة</button>
      </form>

      <input
        placeholder="بحث بالاسم"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <table>
        <thead>
          <tr>
            <th>الاسم</th>
            <th>الهاتف</th>
            <th>المدينة</th>
            <th>المهارات</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {shown.map((r) => (
            <tr key={r.id}>
              <td>{r.name}</td>
              <td>{r.phone}</td>
              <td>{r.city}</td>
              <td>{r.skills}</td>
              <td>
                <button onClick={() => remove(r.id)}>حذف</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}