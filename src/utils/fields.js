// Daftar field. Mau tambah field baru? Cukup tambah satu objek di sini.
// modes: form mana yang menampilkan field ini. check: mengembalikan pesan error, atau '' jika valid.
export const MODES = [
  { id: 'masuk', label: 'Masuk' },
  { id: 'daftar', label: 'Daftar' },
]

const wajib = (pesan) => (v) => (v.trim() ? '' : pesan)

export const FIELDS = [
  { name: 'nama', label: 'Nama lengkap', type: 'text', autoComplete: 'name', modes: ['daftar'],
    check: wajib('Nama harus diisi') },
  { name: 'email', label: 'Email', type: 'email', autoComplete: 'email', modes: ['masuk', 'daftar'],
    check: (v) => (!v.trim() ? 'Email harus diisi' : !/\S+@\S+\.\S+/.test(v) ? 'Format email belum benar' : '') },
  { name: 'hp', label: 'Nomor HP', type: 'tel', autoComplete: 'tel', modes: ['daftar'],
    check: (v) => (/^(\+62|62|0)8\d{8,11}$/.test(v.replace(/[\s-]/g, '')) ? '' : 'Nomor HP belum benar, contoh: 0812 3456 7890') },
  { name: 'bangun', label: 'Biasanya bangun jam berapa?', type: 'time', modes: ['daftar'],
    check: wajib('Pilih jam bangunmu') },
  { name: 'minum', label: 'Minuman favorit di pagi hari', type: 'select', options: ['Kopi', 'Teh', 'Air putih'],
    modes: ['daftar'], check: wajib('Pilih salah satu') },
  { name: 'password', label: 'Kata sandi', type: 'password', modes: ['masuk', 'daftar'],
    check: (v) => (!v ? 'Kata sandi harus diisi' : v.length < 6 ? 'Kata sandi minimal 6 karakter' : '') },
]
