import { useState } from 'react'
import { supabase } from '../supabase.js'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isSignup, setIsSignup] = useState(false) // false = دخول ، true = إنشاء حساب
  const [msg, setMsg] = useState('')
  const [busy, setBusy] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault() // يمنع إعادة تحميل الصفحة
    setBusy(true)
    setMsg('')

    const { error } = isSignup
      ? await supabase.auth.signUp({ email, password })
      : await supabase.auth.signInWithPassword({ email, password })

    if (error) setMsg(error.message)
    else if (isSignup) setMsg('تم إنشاء الحساب. إن طُلب منك تأكيد البريد فتحققي من صندوق الوارد.')
    setBusy(false)
  }

  return (
    <div className="card narrow">
      <h1>{isSignup ? 'إنشاء حساب' : 'تسجيل الدخول'}</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="البريد الإلكتروني"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="كلمة المرور (6 أحرف على الأقل)"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          minLength={6}
          required
        />
        <button disabled={busy}>{isSignup ? 'إنشاء الحساب' : 'دخول'}</button>
      </form>
      {msg && <p className="msg">{msg}</p>}
      <button className="link" onClick={() => setIsSignup(!isSignup)}>
        {isSignup ? 'لدي حساب بالفعل' : 'ليس لدي حساب'}
      </button>
    </div>
  )
}
