# Roadmap — Digital Barista by Scoffey

Sumber tunggal: PDF "Rangkuman UI/UX Digital Barista Scoffey 1–14" (DESIGN FLOW 01–14).

## Selesai
- [x] Halaman 1–10 PDF (splash, auth, home, base, taste, ingredients, result, adjust, recipe, checkout)
- [x] Slide 11–14 (about, vision, technology, future) mengikuti tata letak landscape PDF
- [x] Alur sistem disamakan dengan PDF: rantai 01 → 14 tersambung
      (checkout → about → vision → technology → future → /flow)
- [x] Halaman /flow: peta DESIGN FLOW 01–14, palet, tipografi, prinsip desain
- [x] Menu slide memakai daftar 14 langkah PDF (bukan menu Produk/Layanan/Kontak)
- [x] Bottom nav sesuai PDF hal. 4: Home · Create · My Creations · Community · Profile
      dengan route /creations dan /community
- [x] Halaman di luar PDF dihapus (/produk, /layanan, /kontak)
- [x] Token warna disamakan dengan palet PDF
      (#0D1B2A #14213D #1B263B #D4AF37 #E9D6B1 #6B4423 #F5F7FA)

## Catatan pengembangan (1–12)
- [x] 1 Widget menu reguler di home (pesan langsung ke checkout)
- [x] 2 Americano keluar dari base, masuk menu reguler
- [x] 3 Base Teh
- [x] 4 Base Non Coffee
- [x] 5 Sirup baru: butterscotch, brown sugar, vanilla, pandan, chocolate, strawberry, orange, mango, lemon
- [x] 6 Final Recipe Card menampilkan takaran tiap bahan
- [x] 7 Gambar QRIS pada opsi pembayaran
- [x] 8 Kartu debit dihapus, e-wallet DANA/GoPay
- [x] 9 "Pesan Manis untuk Barista" + opsi tip (kategori keuangan terpisah)
- [x] 10 Tombol di balik layar dihapus dari layar selesai pemesanan
- [x] 11 Laporan transaksi & keuangan di /admin (dari Profil)
- [x] 12 Nota PDF + kirim via WhatsApp

## Berikutnya
- [ ] Cek ulang tiap layar 01–10 terhadap screenshot PDF (spacing & label mikro) — memerlukan file screenshot PDF
- [x] Perbarui teks dan penanda langkah di halaman awal & Choose Your Base agar pengguna tahu alur proses

- [x] Bilingual EN/ID toggle (default English, persisted in localStorage, visible on landing + all app screens)

- [x] Hapus link "Lihat Design Flow 1 – 14" + tagline di halaman splash
- [x] Verifikasi AI generate resep (server fn + gateway OK)

- [x] Bahasa dirapikan: semua layar konsisten EN/ID (kamus tambahan i18n-extra, teks keras dibungkus t())

## Role barista & admin (permintaan baru)
- [x] Semua transaksi (termasuk tamu) terlihat oleh akun barista dan admin (admin baca dari database)
- [x] Barista: hanya rekap pesanan hari ini (admin tetap semua hari)
- [x] Admin: reset kata sandi pengguna, kelola menu (/admin-menu): tambah item & ubah harga
- [x] Buat akun staf tetap: admin@scoffey.id (admin) & barista@scoffey.id (barista)

## Setelah remix (backend baru)
- [x] Isi ulang daftar menu (19 minuman + 13 makanan) ke database
- [x] Buat ulang akun admin & barista beserta perannya
- [x] Rekap menu di halaman Pesanan barista: semua menu tampil dengan Laku / Dipesan / Diproses / Diserahkan

