import { useEffect, useState } from 'react'
import { supabase } from '../supabase.js'

// هذه الصفحة مثال كامل على CRUD (إضافة / عرض / تعديل / حذف) على جدول tasks.
// في المسابقة: غيّري اسم الجدول والحقول لتناسب المشكلة (مرضى، مواعيد، منتجات...)
export default function Home({ session }) {
  const [tasks, setTasks] = useState([])
  const [title, setTitle] = useState('')
  const [error, setError] = useState('')

  // قراءة (Read)
  async function loadTasks() {
    const { data, error } = await supabase
      .from('tasks')
      .select('*')
      .order('created_at', { ascending: false })
    if (error) setError(error.message)
    else setTasks(data)
  }

  useEffect(() => {
    loadTasks()
  }, [])

  // إضافة (Create)
  async function addTask(e) {
    e.preventDefault()
    if (!title.trim()) return
    const { error } = await supabase
      .from('tasks')
      .insert({ title, user_id: session.user.id })
    if (error) setError(error.message)
    setTitle('')
    loadTasks()
  }

  // تعديل (Update): تبديل حالة الإنجاز
  async function toggleTask(task) {
    await supabase.from('tasks').update({ done: !task.done }).eq('id', task.id)
    loadTasks()
  }

  // حذف (Delete)
  async function deleteTask(id) {
    await supabase.from('tasks').delete().eq('id', id)
    loadTasks()
  }

  return (
    <div className="card">
      <header className="bar">
        <h1>قائمة المهام</h1>
        <button className="secondary" onClick={() => supabase.auth.signOut()}>
          خروج
        </button>
      </header>
      <p className="muted">{session.user.email}</p>

      <form onSubmit={addTask} className="row">
        <input
          placeholder="مهمة جديدة..."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <button>إضافة</button>
      </form>

      {error && <p className="msg">{error}</p>}

      <ul className="list">
        {tasks.map((t) => (
          <li key={t.id}>
            <label className={t.done ? 'done' : ''}>
              <input type="checkbox" checked={t.done} onChange={() => toggleTask(t)} />
              {t.title}
            </label>
            <button className="danger" onClick={() => deleteTask(t.id)}>حذف</button>
          </li>
        ))}
        {tasks.length === 0 && <li className="muted">لا توجد مهام بعد.</li>}
      </ul>
    </div>
  )
}
