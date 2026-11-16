# Dokumentasi Keputusan Arsitektur

## 1. Tujuan dan status

Chat App Simpel adalah prototipe aplikasi pesan pribadi untuk praktikum
Pemrograman Berbasis Platform. Dokumen ini menjelaskan keputusan yang sudah
diterapkan, batas prototipe saat ini, serta arah pengembangan berikutnya.

**Status:** prototipe frontend dengan simulasi akun dan pesan berbasis satu
peramban/origin. Backend PHP yang ada masih berupa kerangka API dan belum
menjadi sumber data aplikasi.

## 2. Struktur proyek

Frontend dan backend ditempatkan pada direktori berbeda:

- `frontend/` berisi halaman HTML, CSS, JavaScript native, dan aset.
- `backend/` berisi entry point PHP, controller, model, router, bootstrap,
  serta rute API.

Di frontend, halaman tetap berada di `frontend/pages/`, stylesheet di
`frontend/css/`, dan logika JavaScript di `frontend/js/`. Fitur dashboard
dipecah ke `frontend/js/dashboard/` agar penyimpanan, profil, kontak,
percakapan, dan inisialisasi halaman tidak bercampur.

## 3. Keputusan arsitektur

### 3.1 Teknologi native dan pemisahan frontend/backend

**Keputusan:** menggunakan HTML, CSS, dan JavaScript native pada frontend serta
PHP native pada backend.

**Alasan:** sesuai batasan praktikum, menghindari framework yang dilarang, dan
memudahkan penelusuran alur client-server.

**Trade-off:** validasi, pengelolaan state, dan komponen antarmuka harus
ditangani langsung oleh kode aplikasi.

### 3.2 Modul JavaScript per tanggung jawab

**Keputusan:** logika dashboard dipisah ke modul ES:

- `storage.js`: validasi, pemuatan, penyimpanan, pencarian akun berdasarkan
  nomor telepon, dan pembuatan ID.
- `profile.js`: profil, status, bio, serta unggah/hapus foto profil.
- `contacts.js`: tambah, cari, ubah, dan hapus kontak.
- `chat.js`: menampilkan dan mengirim pesan.
- `dashboard.js`: pemeriksaan sesi dan perakitan modul dashboard.

**Alasan:** perubahan pada satu fitur dapat dilakukan tanpa menumpuk logika di
satu file besar dan lebih mudah diuji secara terpisah.

### 3.3 Penyimpanan lokal untuk prototipe

**Keputusan:** akun dan pesan demo disimpan sebagai satu struktur JSON pada
`localStorage` menggunakan kunci `chat-app-local-messaging-v2`. Sesi login
sementara menggunakan `sessionStorage`.

**Alasan:** dua profil dapat dibuat dan dicoba bergantian pada origin/peramban
yang sama tanpa menyiapkan server aplikasi.

**Trade-off dan batasan:**

- `localStorage` dapat dibaca oleh JavaScript pada origin yang sama, tidak
  dienkripsi, dapat diubah pengguna, dan tidak disinkronkan ke perangkat lain.
- Data dapat hilang jika data situs/peramban dihapus atau kuota penyimpanan
  habis.
- Data akun demo bukan sumber kebenaran yang aman dan tidak boleh dipakai untuk
  layanan produksi.
- Penggunaan kunci penyimpanan bersama memungkinkan profil demo saling
  menemukan akun berdasarkan nomor telepon pada origin tersebut.

### 3.4 Pemisahan sesi dan akun terverifikasi

**Keputusan:** logout hanya menghapus penanda sesi pada `sessionStorage`.
Profil dan waktu verifikasi tetap ada pada data akun di `localStorage`.

**Alasan:** logout seharusnya mengakhiri sesi, bukan menghapus akun atau
memaksa pengguna mendaftar ulang.

**Catatan keamanan:** status verifikasi tersebut hanya status simulasi di
peramban. Ini bukan bukti verifikasi yang dapat dipercaya server.

### 3.5 OTP sebagai simulasi

**Keputusan:** OTP demo adalah kode tetap `123456`, ditampilkan di halaman
verifikasi dan diperiksa oleh JavaScript.

**Alasan:** memungkinkan alur pendaftaran dan verifikasi antarmuka diuji tanpa
integrasi layanan WhatsApp.

**Trade-off:** kode terlihat pada aplikasi dan tidak dikirim ke WhatsApp.
Implementasi ini tidak memberi keamanan atau verifikasi nomor sungguhan.

### 3.6 Kontak dan percakapan berdasarkan nomor telepon

**Keputusan:** saat kontak ditambahkan, nomor dicocokkan dengan profil yang
telah terdaftar pada data lokal. Pesan menyimpan identitas email pengirim dan
penerima, isi, ID unik, serta waktu kirim. Profil penerima dapat melihat
percakapan itu saat masuk pada origin dan peramban yang sama, termasuk
percakapan dari pengirim yang belum disimpan sebagai kontak.

**Alasan:** skenario dua akun dapat dicoba tanpa meminta pengirim membuat
sendiri pesan masuk atas nama penerima.

**Trade-off:** ini hanya pertukaran data lokal. Tidak ada pengiriman jaringan,
notifikasi perangkat lain, atau jaminan pengantaran pesan.

### 3.7 Validasi dan rendering

**Keputusan:** nama dan nomor telepon divalidasi di sisi klien, nomor
dinormalisasi untuk pencocokan, dan teks pesan ditampilkan sebagai teks DOM
(bukan HTML yang disisipkan).

**Alasan:** mencegah masukan nama/nomor yang tidak sesuai, mengurangi duplikasi
nomor, dan menghindari interpretasi isi pesan sebagai markup.

**Trade-off:** validasi klien dapat dilewati dan harus diulang di backend
sebelum aplikasi dipakai sungguhan.

### 3.8 ID profil dan gambar

**Keputusan:** ID demo dibuat dengan `crypto.randomUUID()` jika tersedia,
dengan fallback ke byte acak kriptografis. Foto profil hanya menerima tipe
gambar yang diizinkan dan ukuran maksimal 1 MB, lalu disimpan sebagai data URL
di `localStorage`.

**Alasan:** menghasilkan ID yang tidak berurutan serta menerapkan batas ukuran
agar penyimpanan browser tidak cepat penuh.

**Trade-off:** ID dari browser bukan pengganti ID dan validasi unik yang
ditegakkan basis data server. Data URL juga menambah ukuran data lokal.

## 4. Alur aplikasi saat ini

1. Pengguna mendaftar dan mengisi nama, email, nomor, serta kata sandi.
2. Halaman verifikasi meminta kode demo `123456`.
3. Setelah kode benar, profil dengan status verifikasi demo disimpan lokal.
4. Login mencocokkan nama dan email akun lokal. Kata sandi belum diverifikasi
   maupun disimpan.
5. Dashboard menyediakan profil, status, kontak, dan percakapan lokal.
6. Untuk mencoba percakapan dua akun, buat kedua profil pada browser dan origin
   yang sama, lalu masuk bergantian di tab terpisah.

## 5. Kondisi backend saat ini

Backend memakai PHP native dan sudah memiliki router, koneksi PDO, respons JSON,
serta endpoint `POST /api/users`. Controller registrasi saat ini menerima
`name`, `phone`, dan `profile_picture`.

Backend tersebut **belum terhubung** ke alur frontend di atas dan belum
menyediakan autentikasi sesi/token, OTP WhatsApp, CRUD kontak, pengiriman pesan,
atau skema basis data aplikasi yang digunakan frontend. Karena itu, endpoint
yang tersedia belum menjadikan akun atau pesan demo tersimpan secara server.

## 6. Arah migrasi yang disarankan

Sebelum dipakai lintas perangkat atau untuk data nyata:

1. Tetapkan skema MariaDB untuk akun, kontak, dan pesan; beri batas unik pada
   email serta nomor yang dinormalisasi.
2. Bangun endpoint PHP native untuk registrasi, login, logout, profil, CRUD
   kontak, dan pesan; gunakan prepared statements dan status HTTP yang sesuai.
3. Simpan kata sandi hanya sebagai hash server-side. Jangan simpan rahasia
   autentikasi dalam `localStorage`.
4. Verifikasi kepemilikan nomor melalui penyedia WhatsApp/API di backend;
   gunakan OTP acak, kedaluwarsa, batas percobaan, dan jangan pernah
   mengembalikan kode produksi kepada frontend.
5. Ubah modul penyimpanan JavaScript agar memakai `fetch` dan JSON ke API.
   Backend harus memverifikasi bahwa nomor kontak memang milik akun aktif.
6. Tambahkan pengujian untuk validasi, kontrol akses, CRUD kontak, dan
   pengiriman/penerimaan pesan. Setelah endpoint selesai, uji pemakaian
   bersamaan dan kinerja kueri sebelum menyatakan kriteria lanjutan terpenuhi.

## 7. Validasi yang dilakukan sejauh ini

Selama perubahan prototipe dashboard, pemeriksaan yang telah dilakukan
mencakup parsing halaman HTML, keberadaan aset dan import modul, konsistensi
selector DOM dashboard, serta `git diff --check`. Belum ada pengujian browser
otomatis atau pengujian integrasi lintas perangkat. Pemeriksaan tersebut tidak
membuktikan bahwa persyaratan backend atau keamanan produksi sudah terpenuhi.

## 8. Transparansi penggunaan AI

AI digunakan sebagai bantuan untuk implementasi antarmuka, alur prototipe,
perapian modul, dan dokumentasi. Persentase keterlibatan AI belum dihitung
secara terukur; angka final perlu diisi dan disetujui praktikan sebelum
pengumpulan.

Contoh prompt kunci yang digunakan:

- “buatkan verifikasi OTP, login, lalu dashboard mengikuti
  struktur repo.”
- “Buat dashboard agar dua profil lokal dapat bertukar pesan melalui nomor
  telepon.”
- “Sesuaikan tampilan CSS agar konsisten dengan tangkapan layar.”

Kode bantuan AI tetap perlu ditinjau dan diuji oleh praktikan. Khusus prototipe
ini, batas penting yang ditemukan adalah bahwa `localStorage` serta OTP tetap
tidak memberikan autentikasi atau pengiriman pesan sungguhan. Persentase AI,
prompt final, dan hasil evaluasi perlu disesuaikan dengan kontribusi aktual
serta proses pengujian praktikan.
