// Satu komponen untuk semua jenis field; elemen yang dirender mengikuti field.type.
export default function Field({ field, mode, value, error, onChange, showPassword, onTogglePassword }) {
  const { name, label, type, options, autoComplete } = field
  const errorId = error ? `${name}-error` : undefined
  const common = { id: name, name, value, onChange, 'aria-invalid': Boolean(error), 'aria-describedby': errorId }

  let control
  if (type === 'select') {
    control = (
      <select {...common}>
        <option value="">Pilih…</option>
        {options.map((o) => (
          <option key={o} value={o}>{o}</option>
        ))}
      </select>
    )
  } else if (type === 'password') {
    control = (
      <div className="input-wrap">
        <input {...common} type={showPassword ? 'text' : 'password'}
          autoComplete={mode === 'daftar' ? 'new-password' : 'current-password'} />
        <button type="button" className="toggle" onClick={onTogglePassword}>
          {showPassword ? 'Sembunyikan' : 'Tampilkan'}
        </button>
      </div>
    )
  } else {
    control = <input {...common} type={type} autoComplete={autoComplete} />
  }

  return (
    <div className="field">
      <label htmlFor={name}>{label}</label>
      {control}
      {error && (
        <p id={errorId} className="error" role="alert">{error}</p>
      )}
    </div>
  )
}
