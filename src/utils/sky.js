// Kunci warna langit sepanjang hari: [menit sejak 00.00, langit atas, langit bawah, kartu, aksen].
// Warna di antara dua kunci dihitung dengan interpolasi, jadi perubahan terasa mulus.
const KEYS = [
  [0, '#0b1530', '#2a3a7a', '#141c3d', '#f2c14e'],
  [290, '#0b1530', '#2a3a7a', '#141c3d', '#f2c14e'], // malam bertahan sampai menjelang subuh
  [330, '#3a4a8a', '#f4a98a', '#fff4ea', '#c2561f'], // fajar
  [450, '#7cc4ee', '#ffe3b8', '#fffaf2', '#c2561f'], // pagi
  [720, '#3b9ae8', '#cdeeff', '#ffffff', '#1c64c4'], // siang
  [990, '#5aa7e6', '#ffe0a8', '#fffaf0', '#c8651a'], // sore awal
  [1080, '#5b4b9a', '#ff9a6b', '#fff1e6', '#b8381f'], // senja
  [1170, '#1d2858', '#7a4e8c', '#1b2147', '#f2b24e'], // petang
  [1260, '#0b1530', '#2a3a7a', '#141c3d', '#f2c14e'], // malam
  [1440, '#0b1530', '#2a3a7a', '#141c3d', '#f2c14e'],
]

const COPY = {
  pagi: ['Selamat pagi.', 'Masuk dulu sebelum sarapan jadi dingin.'],
  siang: ['Selamat siang.', 'Istirahat sebentar, lalu masuk.'],
  sore: ['Selamat sore.', 'Teh hangat menunggu di dalam.'],
  malam: ['Selamat malam.', 'Lampu rumah sudah menyala. Silakan masuk.'],
}

const toRgb = (h) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16))
const toHex = (c) => '#' + c.map((v) => Math.round(v).toString(16).padStart(2, '0')).join('')
const mix = (a, b, t) => {
  const rb = toRgb(b)
  return toHex(toRgb(a).map((v, i) => v + (rb[i] - v) * t))
}

// Luminansi relatif (WCAG) untuk memilih warna teks yang terbaca di atas suatu warna latar.
const lum = (h) => {
  const [r, g, b] = toRgb(h).map((v) => {
    v /= 255
    return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4
  })
  return 0.2126 * r + 0.7152 * g + 0.0722 * b
}
const readableOn = (h) => (lum(h) > 0.2 ? '#141a2b' : '#ffffff')

const contrast = (a, b) => {
  const x = lum(a)
  const y = lum(b)
  return (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05)
}
// Warna judul: pilih yang paling terbaca di seluruh area tempat judul bisa berada (atas s.d. tengah langit).
const inkFor = (top, bottom) => {
  const zones = [0.1, 0.3, 0.5].map((t) => mix(top, bottom, t))
  const worst = (c) => Math.min(...zones.map((z) => contrast(c, z)))
  return worst('#141a2b') >= worst('#ffffff') ? '#141a2b' : '#ffffff'
}

// Seberapa "malam" suasananya: 0 = siang terang, 1 = gelap penuh.
const nightness = (m) =>
  m < 330 ? 1 : m < 450 ? 1 - (m - 330) / 120 : m < 1080 ? 0 : m < 1170 ? (m - 1080) / 90 : 1

export function getTheme(m) {
  // Cari dua kunci yang mengapit menit saat ini.
  let i = 0
  while (i < KEYS.length - 2 && m > KEYS[i + 1][0]) i++
  const [a, b] = [KEYS[i], KEYS[i + 1]]
  const t = (m - a[0]) / (b[0] - a[0])
  const [top, bottom] = [1, 2].map((k) => mix(a[k], b[k], t))
  // Kartu & aksen tidak diinterpolasi: nada tengah (abu-abu) membuat teks, error, dan fokus tak terbaca.
  const dark = nightness(m) > 0.5
  const card = dark ? '#141c3d' : '#fffaf2'
  const accent = dark ? '#f2c14e' : '#b8381f'

  const phase = m < 300 || m >= 1110 ? 'malam' : m < 660 ? 'pagi' : m < 900 ? 'siang' : 'sore'

  // Matahari terbit 05.45, terbenam 18.15; bulan mengisi sisanya. p = progres 0..1 di busur langit.
  const isDay = m >= 345 && m < 1095
  const p = isDay ? (m - 345) / 750 : ((m < 345 ? m + 1440 : m) - 1095) / 690

  return {
    greeting: COPY[phase][0],
    sub: COPY[phase][1],
    night: nightness(m),
    body: { isDay, x: 8 + p * 84, y: 62 - Math.sin(Math.PI * p) * 47 },
    vars: {
      '--sky-top': top,
      '--sky-bottom': bottom,
      '--card': card,
      '--card-ink': readableOn(card),
      '--accent': accent,
      '--accent-ink': readableOn(accent),
      '--ink': inkFor(top, bottom),
      '--ground': mix(bottom, '#0a0f1f', 0.72),
      '--danger': dark ? '#ff9b9b' : '#b42318',
      '--scheme': dark ? 'dark' : 'light', // agar ikon jam/panah select ikut terbaca
    },
  }
}
