// Latar dekoratif: bintang, matahari/bulan, dan siluet rumah yang jendelanya menyala saat malam.
export default function Scene({ night, body }) {
  return (
    <div className="scene" aria-hidden="true">
      <div className="stars" style={{ opacity: night }} />
      <div
        className={`body ${body.isDay ? 'sun' : 'moon'}`}
        style={{ left: `${body.x}%`, top: `${body.y}%` }}
      />
      <svg className="skyline" viewBox="0 0 1200 220" preserveAspectRatio="xMidYMax slice">
        <g className="ground">
          <rect x="0" y="200" width="1200" height="20" />
          <polygon points="60,220 60,150 140,110 220,150 220,220" />
          <polygon points="300,220 300,130 390,85 480,130 480,220" />
          <polygon points="620,220 620,160 690,125 760,160 760,220" />
          <polygon points="880,220 880,120 980,70 1080,120 1080,220" />
        </g>
        {/* Jendela rumah: opacity mengikuti tingkat malam */}
        <g className="win" style={{ opacity: night }}>
          <rect x="100" y="160" width="24" height="26" />
          <rect x="330" y="150" width="24" height="26" />
          <rect x="415" y="150" width="24" height="26" />
          <rect x="658" y="172" width="24" height="26" />
          <rect x="910" y="140" width="24" height="26" />
          <rect x="1010" y="140" width="24" height="26" />
        </g>
      </svg>
    </div>
  )
}
