import { useEffect, useState } from 'react'
import { supabase } from '../supabase.js'

export default function Activities() {
  const [rows, setRows] = useState([])
  const [search, setSearch] = useState('')
  const [error, setError] = useState('')
  const [form, setForm] = useState({ title: '', activity_date: '', place: '', capacity: '' })

  async function load() {
    const { data, error } = await supabase
      .from('activities')
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
    const payload = {
      title: form.title,
      activity_date: form.activity_date || null,
      place: form.place || null,
      capacity: form.capacity ? Number(form.capacity) : null,
    }
    const { error } = await supabase.from('activities').insert(payload)
    if (error) {
      setError(error.message)
      return
    }
    setForm({ title: '', activity_date: '', place: '', capacity: '' })
    load()
  }

  async function remove(id) {
    if (!confirm('حذف هذا النشاط؟')) return
    const { error } = await supabase.from('activities').delete().eq('id', id)
    if (error) setError(error.message)
    else load()
  }

  const shown = rows.filter((r) =>
    (r.title || '').toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div>
      <h2>النشاطات ({rows.length})</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}

      <form onSubmit={add}>
        <input
          placeholder="العنوان"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          required
        />
        <input
          type="date"
          placeholder="التاريخ"
          value={form.activity_date}
          onChange={(e) => setForm({ ...form, activity_date: e.target.value })}
        />
        <input
          placeholder="المكان"
          value={form.place}
          onChange={(e) => setForm({ ...form, place: e.target.value })}
        />
        <input
          type="number"
          placeholder="السعة (رقم)"
          value={form.capacity}
          onChange={(e) => setForm({ ...form, capacity: e.target.value })}
        />
        <button type="submit">إضافة</button>
      </form>

      <input
        placeholder="بحث بالعنوان"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <table>
        <thead>
          <tr>
            <th>العنوان</th>
            <th>التاريخ</th>
            <th>المكان</th>
            <th>السعة</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {shown.map((r) => (
            <tr key={r.id}>
              <td>{r.title}</td>
              <td>{r.activity_date}</td>
              <td>{r.place}</td>
              <td>{r.capacity}</td>
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