import { useState, useEffect } from 'react'
import Scene from './components/Scene'
import LoginForm from './components/LoginForm'
import { getTheme } from './utils/sky'
import './App.css'

const nowMinutes = () => {
  const d = new Date()
  return d.getHours() * 60 + d.getMinutes()
}

const formatTime = (m) =>
  `${String(Math.floor(m / 60)).padStart(2, '0')}.${String(m % 60).padStart(2, '0')}`

// Hook jam: mengikuti jam asli perangkat, atau diatur manual lewat slider.
function useDayClock() {
  const [minutes, setMinutes] = useState(nowMinutes)
  const [live, setLive] = useState(true)

  useEffect(() => {
    if (!live) return
    const id = setInterval(() => setMinutes(nowMinutes()), 30000)
    return () => clearInterval(id) // cleanup: hentikan timer saat mode manual / unmount
  }, [live])

  return {
    minutes,
    live,
    setManual: (m) => {
      setLive(false)
      setMinutes(m)
    },
    goLive: () => {
      setMinutes(nowMinutes())
      setLive(true)
    },
  }
}

export default function App() {
  const { minutes, live, setManual, goLive } = useDayClock()
  const theme = getTheme(minutes)

  return (
    // Semua warna datang dari CSS variables yang dihitung dari jam.
    <main className="app" style={theme.vars}>
      <Scene night={theme.night} body={theme.body} />

      <section className="hero">
        <h1>{theme.greeting}</h1>
        <p>{theme.sub}</p>
      </section>

      <LoginForm />

      <div className="clock">
        <label htmlFor="time">
          Waktu di luar jendela: <strong>{formatTime(minutes)}</strong>
        </label>
        <input
          id="time"
          type="range"
          min="0"
          max="1439"
          value={minutes}
          onChange={(e) => setManual(Number(e.target.value))}
        />
        <button type="button" onClick={goLive} disabled={live}>
          Ikuti jam sekarang
        </button>
      </div>
    </main>
  )
}
