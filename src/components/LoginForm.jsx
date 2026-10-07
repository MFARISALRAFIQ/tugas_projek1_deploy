import { useEffect, useRef, useState } from 'react'
import { FIELDS, MODES } from '../utils/fields'
import Field from './Field'

const KEY = 'ingat-email'
const readSaved = () => {
  try { return localStorage.getItem(KEY) || '' } catch { return '' }
}
const makeInitial = () => {
  const saved = readSaved()
  return {
    ...Object.fromEntries(FIELDS.map((f) => [f.name, ''])),
    email: saved,
    remember: saved !== '', // tercentang hanya jika email memang pernah disimpan
  }
}

const fieldsOf = (mode) => FIELDS.filter((f) => f.modes.includes(mode))

// Hanya field milik form yang sedang aktif yang divalidasi.
function validate(data, mode) {
  const errors = {}
  fieldsOf(mode).forEach((f) => {
    const msg = f.check(data[f.name])
    if (msg) errors[f.name] = msg
  })
  return errors
}

export default function LoginForm() {
  const [mode, setMode] = useState('masuk')
  const [data, setData] = useState(makeInitial)
  const [errors, setErrors] = useState({})
  const [showPassword, setShowPassword] = useState(false)
  const [status, setStatus] = useState('idle') // idle | loading | success
  const headingRef = useRef(null)

  // Setelah berhasil, pindahkan fokus ke judul agar pengguna keyboard/pembaca layar tidak "tersesat".
  useEffect(() => {
    if (status === 'success') headingRef.current?.focus()
  }, [status])

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setData((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }))
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: undefined }))
  }

  const switchMode = (m) => {
    setMode(m)
    setErrors({})
    setShowPassword(false)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const found = validate(data, mode)
    setErrors(found)
    if (Object.keys(found).length > 0) return
    if (mode === 'masuk') {
      try {
        if (data.remember) localStorage.setItem(KEY, data.email)
        else localStorage.removeItem(KEY)
      } catch {
        // penyimpanan tidak tersedia: abaikan saja
      }
    }
    setStatus('loading')
    setTimeout(() => setStatus('success'), 1200) // simulasi permintaan ke server
  }

  const reset = () => {
    setData(makeInitial())
    setShowPassword(false)
    setMode('masuk')
    setStatus('idle')
  }

  if (status === 'success') {
    const daftar = mode === 'daftar'
    const nama = daftar ? data.nama.trim().split(' ')[0] : data.email.split('@')[0]
    return (
      <section className="card" aria-live="polite">
        <h2 ref={headingRef} tabIndex={-1}>{daftar ? 'Akun berhasil dibuat' : 'Berhasil masuk'}</h2>
        <p className="done">
          {daftar
            ? `Halo, ${nama}. Besok pagi ${data.minum.toLowerCase()} menunggumu sekitar jam ${data.bangun}.`
            : `Selamat datang kembali, ${nama}.`}
        </p>
        <button type="button" className="submit" onClick={reset}>Keluar</button>
      </section>
    )
  }

  const daftar = mode === 'daftar'
  return (
    <form className="card" onSubmit={handleSubmit} noValidate>
      <div className="tabs">
        {MODES.map((m) => (
          <button key={m.id} type="button" className="tab" aria-pressed={mode === m.id}
            onClick={() => switchMode(m.id)}>
            {m.label}
          </button>
        ))}
      </div>

      <h2>{daftar ? 'Buat akun baru' : 'Masuk ke akunmu'}</h2>

      {fieldsOf(mode).map((f) => (
        <Field key={f.name} field={f} mode={mode} value={data[f.name]} error={errors[f.name]}
          onChange={handleChange} showPassword={showPassword}
          onTogglePassword={() => setShowPassword((s) => !s)} />
      ))}

      {!daftar && (
        <div className="row">
          <label className="remember">
            <input type="checkbox" name="remember" checked={data.remember} onChange={handleChange} />
            Ingat email saya
          </label>
          <a href="#lupa" onClick={(e) => e.preventDefault()}>Lupa kata sandi?</a>
        </div>
      )}

      <button type="submit" className="submit" disabled={status === 'loading'}>
        {status === 'loading' ? 'Memeriksa…' : daftar ? 'Daftar' : 'Masuk'}
      </button>
    </form>
  )
}
