import { EN_ABOUT, ID_ABOUT } from "./i18n-about";
import { EN_VISION, ID_VISION } from "./i18n-vision";
import { EN_FUTURE, ID_FUTURE } from "./i18n-future";
import { EN_TECHNOLOGY, ID_TECHNOLOGY } from "./i18n-technology";
import { EN_FLOW, ID_FLOW } from "./i18n-flow";
import { EN_EXTRA, ID_EXTRA } from "./i18n-extra";
import { EN_EXTRA2, ID_EXTRA2 } from "./i18n-extra2";
import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

export type Lang = "en" | "id";

const KEY = "scoffey-lang";
export const DEFAULT_LANG: Lang = "en";

/**
 * Module-level current language. The provider re-mounts its subtree whenever the
 * language changes, so plain `t()` calls in components always render fresh copy.
 */
let currentLang: Lang = DEFAULT_LANG;

/** Indonesian source copy -> English translation. */
const EN: Record<string, string> = {
  ...EN_ABOUT,
  ...EN_VISION,
  ...EN_FUTURE,
  ...EN_TECHNOLOGY,
  ...EN_FLOW,
  ...EN_EXTRA,
  ...EN_EXTRA2,
  "MENUNGGU PEMBAYARAN": "AWAITING PAYMENT",
  "Bayar ke barista di kasir, lalu tekan tombol di bawah untuk melihat struk.":
    "Pay the barista at the counter, then tap the button below to see your receipt.",
  "Selesaikan pembayaran, lalu tekan tombol di bawah. Struk keluar setelah pembayaran berhasil.":
    "Complete the payment, then tap the button below. The receipt appears once payment succeeds.",
  "Saya sudah bayar": "I have paid",
  "Memeriksa pembayaran…": "Checking payment…",
  "Pekat, bold, karakter kopi paling dominan.": "Rich, bold, the most dominant coffee character.",
  "Ringan, bersih, aroma kopi yang jelas.": "Light, clean, with a clear coffee aroma.",
  "Lembut, creamy, seimbang dengan susu.": "Soft, creamy, balanced with milk.",
  "Smooth, low acid, manis alami.": "Smooth, low acid, naturally sweet.",
  "Earthy, hijau segar, tanpa kopi.": "Earthy, fresh green, coffee-free.",
  "Manis, hangat, ramah untuk semua.": "Sweet, warm, friendly for everyone.",
  "Ringan dan menenangkan, seduhan daun teh pilihan.":
    "Light and calming, brewed from selected tea leaves.",
  "Tanpa kopi sama sekali — dasar jus, milkshake, dan mocktail.":
    "Completely coffee-free — the base for juices, milkshakes, and mocktails.",
  "Scan sekali, semua aplikasi bisa": "Scan once, works with every app",
  "DANA atau GoPay": "DANA or GoPay",
  "Bayar langsung ke barista": "Pay directly at the counter",
  "Tanpa tip": "No tip",
  "Nota pembelian": "Purchase receipt",
  "Unduh nota dalam bentuk PDF, atau kirim ringkasannya lewat WhatsApp lalu lampirkan file PDF-nya.":
    "Download the receipt as a PDF, or send the summary via WhatsApp and attach the PDF file.",
  "Nomor WhatsApp (opsional)": "WhatsApp number (optional)",
  "Nota PDF": "PDF receipt",
  "Kirim via WA": "Send via WhatsApp",
  "Foto minuman": "Photo of",
  "Susu & Krim": "Milk & Cream",
  "Sirup & Rasa": "Syrup & Flavour",
  Topping: "Topping",
  "Bahan Lokal": "Local Ingredients",
  Maks: "Max",
  Ekstra: "Extra",
  "LAPORAN BARISTA": "BARISTA REPORT",
  "Rekap transaksi dan keuangan untuk akun admin/barista Scoffey.":
    "Transaction and financial summary for the Scoffey admin/barista account.",
  "Hari ini": "Today",
  "7 hari": "7 days",
  Semua: "All",
  "Penjualan minuman (net)": "Drink sales (net)",
  "Tip barista (kategori khusus)": "Barista tips (separate category)",
  "Racikan signature": "Signature blends",
  "Menu reguler": "Regular menu",
  "Belum ada transaksi.": "No transactions yet.",
  "Belum ada transaksi pada rentang ini.": "No transactions in this range.",
  "Daftar transaksi": "Transaction list",
  "Kembali ke Profil": "Back to Profile",
  Nota: "Receipt",
  tip: "tip",

  // Nama base & bahan
  Teh: "Tea",
  "Non Coffee": "Non Coffee",
  "Kacang Kenari": "Walnut",
  "Kacang Mede": "Cashew Nut",
  Jahe: "Ginger",
  "Bunga Telang": "Butterfly Pea",
  // Takaran
  "2 shot (60 ml)": "2 shots (60 ml)",
  "1 shot + 150 ml susu": "1 shot + 150 ml milk",
  "5 g bubuk + 150 ml air": "5 g powder + 150 ml water",
  "30 g cokelat + 150 ml susu": "30 g chocolate + 150 ml milk",
  "1 kantong + 200 ml air": "1 tea bag + 200 ml water",
  "15 ml (1 pump)": "15 ml (1 pump)",
  "10 ml + 1 slice": "10 ml + 1 slice",
  "1 swirl (20 g)": "1 swirl (20 g)",
  "1 g taburan": "1 g dusting",
  "10 g cincang": "10 g chopped",
  "5 g parut": "5 g grated",
  "3 kuntum": "3 blossoms",
  "2 g bubuk": "2 g powder",
  "2 g ekstrak": "2 g extract",
  "1 shot (30 ml)": "1 shot (30 ml)",
  "1 gelas (regular)": "1 cup (regular)",
  // Laporan admin
  "Pendapatan harian": "Daily revenue",
  "Pendapatan bulanan": "Monthly revenue",
  "Total transaksi": "Total transactions",
  "Pesan manis": "Sweet messages",
  "Pesan manis & tip harian": "Daily sweet messages & tips",
  "Belum ada data untuk grafik.": "No data for the chart yet.",
  transaksi: "transactions",
  pesan: "messages",


  "Kartu Debit/Kredit": "Debit/Credit Card",
  "Tunai di Kasir": "Cash at Counter",
  Total: "Total",
  oleh: "by",
  suka: "likes",
  "Resep Tercipta": "Recipes Created",
  "Kreator Aktif": "Active Creators",
  "Kepuasan Pengguna": "User Satisfaction",
  // Splash / landing
  "Mulai Berkreasi": "Start Creating",
  "Masuk Sebagai Tamu": "Continue as Guest",
  "Masuk / Daftar": "Sign In / Sign Up",
  "Lihat Design Flow 1 – 14": "View Design Flow 1 – 14",
  "Hangat & premium · Sederhana & fokus · Mengundang · Modern":
    "Warm & premium · Simple & focused · Inviting · Modern",
  Bahasa: "Language",
  "Bahasa Indonesia": "Indonesian",
  "Bahasa Inggris": "English",

  // Shell / navigation
  Kembali: "Back",
  "My Creations": "My Creations",
  "Halaman 4": "Page 4",
  "Halaman 5": "Page 5",
  "Halaman 6": "Page 6",
  "Halaman 7": "Page 7",
  "Halaman 8": "Page 8",
  "Halaman 9": "Page 9",
  "Halaman 10": "Page 10",

  // Home
  "Ready to create your perfect coffee today?": "Ready to create your perfect coffee today?",
  "Lihat semua": "See all",
  "See full menu": "See full menu",
  "Hide menu": "Hide menu",
  "Menu Favorit": "Favorite Menu",
  "Semua menu": "All menu",
  "Pilihan terlaris Scoffey — menu lengkap ada di halaman Menu Scoffey.":
    "Scoffey best sellers — the full list lives on the Scoffey Menu page.",
  "Recommended for you": "Recommended for you",
  "Your last creations": "Your last creations",
  Detail: "Details",
  Reorder: "Reorder",
  "Lihat Promo": "View Promo",
  "Summer Breeze Series": "Summer Breeze Series",
  "Rasakan kesegaran buah-buahan pilihan dalam racikan kopi spesial Scoffey.":
    "Taste hand-picked fruit freshness in Scoffey's special coffee blends.",
  "Dibuat 2 hari lalu • Rating 4.9": "Created 2 days ago • Rating 4.9",

  // Base
  "Pilih dasar minuman sebagai fondasi utama kreasi kamu. Setiap base memiliki karakter rasa yang berbeda.":
    "Pick the drink base that anchors your creation. Every base carries its own flavour character.",
  "Cara kerja": "How it works",
  "Pilih salah satu base yang paling sesuai dengan mood dan preferensi kamu, lalu lanjut untuk menentukan preferensi rasa.":
    "Choose the base that best matches your mood and preference, then continue to set your taste preferences.",
  "Lanjut ke Taste Preferences": "Continue to Taste Preferences",
  "Pilih base dulu": "Select a base first",

  // Step labels (progress dots + landing flow preview)
  Langkah: "Step",
  dari: "of",
  "Pilih Base": "Choose Base",
  "Atur Rasa": "Set Taste",
  "Pilih Bahan": "Pick Ingredients",
  "Rekomendasi AI": "AI Recommendation",
  Base: "Base",
  Taste: "Taste",
  Items: "Items",
  AI: "AI",
  Adjust: "Adjust",
  Recipe: "Recipe",

  // Taste
  "Tentukan preferensi rasa kamu. Digital Barista akan menyesuaikan resep berdasarkan selera unikmu.":
    "Set your taste preferences. Digital Barista tailors the recipe to your unique palate.",
  "Ringkasan pilihan": "Selection summary",
  "AI akan mencari kombinasi bahan terbaik berdasarkan preferensi di atas.":
    "The AI will find the best ingredient combination based on the preferences above.",
  "Lanjut Pilih Bahan": "Continue to Ingredients",

  // Ingredients
  "Pilih bahan favoritmu dengan tap. Bahan yang dipilih akan terhighlight.":
    "Tap to pick your favourite ingredients. Selected ones stay highlighted.",
  "Tambahan bahan:": "Extra ingredients:",
  "Belum ada bahan dipilih. Digital Barista tetap bisa meracik versi murni.":
    "No ingredients selected yet. Digital Barista can still craft a pure version.",
  "Lanjut ke AI Recommendation": "Continue to AI Recommendation",

  // Result
  "Digital Barista menganalisis pilihanmu dan merekomendasikan racikan terbaik yang seimbang, feasible, dan sesuai preferensi rasa.":
    "Digital Barista analyses your choices and recommends the most balanced, feasible blend for your taste.",
  "AI sedang meracik variasi untukmu…": "The AI is crafting variations for you…",
  "Diracik oleh AI Digital Barista": "Crafted by Digital Barista AI",
  "AI tidak tersedia — memakai racikan dasar.": "AI unavailable — showing the base blend.",
  "Racikan dasar": "Base blend",
  "Racik ulang": "Regenerate",
  "Profil rasa": "Flavour profile",
  "Catatan Digital Barista": "Digital Barista notes",
  "Terima Racikan Ini": "Accept This Blend",

  // Adjust
  "Sempurnakan racikanmu! Digital Barista akan mengkalkulasi ulang komposisi dan memberikan hasil terbaik untuk kamu.":
    "Fine-tune your blend. Digital Barista recalculates the composition for the best result.",
  "Perubahan real-time": "Real-time changes",
  "Peringkat kecocokan": "Match rating",
  "AI Match Score berubah secara real-time mengikuti penyesuaian yang kamu pilih.":
    "The AI Match Score updates in real time as you adjust the blend.",
  "Simpan & Lihat Resep Final": "Save & View Final Recipe",

  // Recipe
  "Racikan finalmu siap dinikmati! Ini adalah hasil co-creation terbaikmu bersama Digital Barista.":
    "Your final blend is ready. This is your best co-creation with Digital Barista.",
  Komposisi: "Composition",
  "Langkah penyajian": "Serving steps",
  "Deskripsi rasa": "Flavour description",
  "Pesan Sekarang": "Order Now",
  Tersimpan: "Saved",
  Simpan: "Save",
  Bagikan: "Share",
  "Setiap racikan adalah ekspresi dirimu. Scoffey mengapresiasi kreasimu!":
    "Every blend expresses who you are. Scoffey celebrates your creation!",

  // Checkout
  "Konfirmasi detail pesananmu sebelum diproses oleh barista. Pastikan semua sudah sesuai seleramu.":
    "Confirm your order details before the barista starts. Make sure everything suits your taste.",
  "Opsi pesanan": "Order options",
  "Metode pembayaran": "Payment method",
  "Transfer Bank": "Bank Transfer",
  "Kirim ke nomor DANA": "Send to DANA number",
  "Kirim ke nomor": "Send to number",
  "Transfer ke rekening": "Transfer to account",
  "Atas nama": "Account holder",
  "Catatan untuk barista": "Note for the barista",
  "Contoh: es sedikit, tolong less sugar": "e.g. less ice, less sugar please",
  "Ringkasan harga": "Price summary",
  "Subtotal racikan": "Blend subtotal",
  "Pajak (0%)": "Tax (0%)",
  "Biaya layanan": "Service fee",
  Transparan: "Transparent",
  "Tanpa biaya tersembunyi. Kamu tahu persis apa yang kamu bayar.":
    "No hidden fees. You know exactly what you pay for.",
  "Harga sudah final — tidak ada pajak dan biaya layanan tambahan.":
    "Price is final — no tax or service fee.",
  "Konfirmasi Pesanan": "Confirm Order",
  "PESANAN DITERIMA": "ORDER RECEIVED",
  "Barista sedang meracik": "The barista is brewing",
  Pesanan: "Order",
  "Kembali ke Home": "Back to Home",

  // Creations
  "Kreasi Kamu": "Your Creations",
  "Setiap racikan adalah ekspresi dirimu. Scoffey mengapresiasi kreasimu — simpan, pesan ulang, atau bagikan ke komunitas.":
    "Every blend expresses who you are. Save it, reorder it, or share it with the community.",
  "Kreasi tersimpan": "Saved creations",
  "Belum ada kreasi tersimpan. Racik minumanmu, lalu simpan dari Final Recipe Card.":
    "No saved creations yet. Craft a drink, then save it from the Final Recipe Card.",
  "Belum ada kreasi tersimpan.": "No saved creations yet.",
  "Riwayat pesanan": "Order history",
  "Belum ada pesanan.": "No orders yet.",
  "Riwayat Pesanan": "Order History",
  "Pesanan Masuk": "Incoming Orders",
  "Pesanan sebelumnya": "Previous orders",
  "Ambil pesanan": "Take order",
  "Total pesanan": "Total orders",
  "Total belanja": "Total spent",
  "Nilai pesanan": "Order value",
  "Menunggu": "Waiting",
  "Unduh struk": "Download receipt",
  "Masuk ke akunmu untuk melihat riwayat pesanan sebelumnya.":
    "Sign in to your account to see your previous orders.",
  "Bagikan racikan terbaikmu ke komunitas Scoffey dan bantu kreator lain menemukan rasa baru.":
    "Share your best blend with the Scoffey community and help other creators discover new flavours.",
  "Racik Kreasi Baru": "Craft a New Creation",

  // Profile
  PROFIL: "PROFILE",
  "Mode Guest — buat akun untuk menyimpan semuanya":
    "Guest mode — create an account to save everything",
  "Member Scoffey": "Scoffey Member",
  "Reset Racikan Saat Ini": "Reset Current Blend",
  Keluar: "Sign Out",

  // Community
  "Kolaborasi Rasa": "Flavour Collaboration",
  "Kolaborasi rasa, teknologi, dan komunitas untuk masa depan kopi yang lebih baik. Kreasi terbaik dari komunitas bisa jadi menu musiman Scoffey.":
    "Flavour, technology, and community coming together for a better coffee future. The best community creations can become a Scoffey seasonal menu.",
  "Trending kreasi komunitas": "Trending community creations",
  "Digital Barista adalah langkah kecil hari ini untuk menciptakan pengalaman minum kopi yang lebih personal, konsisten, dan berkelanjutan.":
    "Digital Barista is today's small step toward a more personal, consistent, and sustainable coffee experience.",
  "Lihat Visi Scoffey": "See Scoffey's Vision",

  // Auth
  "Buat Akun Baru": "Create a New Account",
  "Masuk untuk melanjutkan perjalanan kreasi kopi kamu.":
    "Sign in to continue your coffee creation journey.",
  "Daftar untuk menyimpan semua kreasi, favorit, dan riwayat pesanan kamu.":
    "Sign up to save all your creations, favourites, and order history.",
  "Nama Lengkap": "Full Name",
  "Email atau Nomor HP": "Email or Phone Number",
  "Nomor HP (opsional)": "Phone Number (optional)",
  "Konfirmasi Password": "Confirm Password",
  "Lupa Password?": "Forgot Password?",
  Masuk: "Sign In",
  Daftar: "Sign Up",
  "atau lanjut dengan": "or continue with",
  "atau daftar dengan": "or sign up with",
  "Lanjut sebagai Guest": "Continue as Guest",
  "Belum punya akun? ": "Don't have an account? ",
  "Sudah punya akun? ": "Already have an account? ",
  "Daftar sekarang": "Sign up now",
  "Masuk di sini": "Sign in here",
  "Kenapa ada Guest Mode?": "Why Guest Mode?",
  "Kami ingin kamu langsung berkreasi tanpa hambatan. Akun bisa dibuat nanti saat kamu siap.":
    "We want you to start creating right away — your account can wait until you're ready.",
  "Kembali ke splash": "Back to splash",
  "Sembunyikan password": "Hide password",
  "Tampilkan password": "Show password",
  "Kembali ke halaman masuk": "Back to sign in",

  // AI errors
  "Gagal membuat resep AI.": "Failed to craft the AI recipe.",
  "AI sedang sibuk, coba lagi sebentar lagi.": "The AI is busy — try again in a moment.",
  "Kredit AI habis. Tambahkan kredit di workspace Lovable.":
    "AI credits are depleted. Add credits in your Lovable workspace.",

  // Akun, poin, rencana & label tambahan
  "Aktifkan": "Activate",
  "Belum ada akun terdaftar.": "No accounts registered yet.",
  "Belum ada rencana.": "No plans yet.",
  "Bulanan": "Monthly",
  "Contoh: semangat terus ya, kopimu selalu bikin hari lebih baik!": "Example: keep going, your coffee always makes the day better!",
  "Email atau password salah.": "Incorrect email or password.",
  "Es": "Ice",
  "Gagal memuat data akun.": "Failed to load account data.",
  "Gagal menambah rencana.": "Failed to add the plan.",
  "Gagal menyimpan rencana.": "Failed to save the plan.",
  "Hapus rencana": "Delete plan",
  "Harian": "Daily",
  "Jeda": "Pause",
  "Jumlah transaksi": "Transaction count",
  "Kekuatan": "Strength",
  "Kelola akun, poin & rencana": "Manage accounts, points & plans",
  "Konfirmasi password tidak cocok.": "Password confirmation does not match.",
  "Laporan Barista": "Barista Report",
  "Manis": "Sweetness",
  "Masuk atau daftar untuk menyimpan rencana langganan.": "Sign in or sign up to save subscription plans.",
  "Memproses…": "Processing…",
  "Memuat…": "Loading…",
  "Menu Reguler": "Regular Menu",
  "Mingguan": "Weekly",
  "Mulai dari base": "Start from base",
  "Nama minuman": "Drink name",
  "Nama pengguna": "User name",
  "Password minimal 6 karakter.": "Password must be at least 6 characters.",
  "Pendaftaran gagal.": "Registration failed.",
  "Pesan": "Order",
  "Pesan Manis untuk Barista": "Sweet Message for the Barista",
  "Pesan langsung tanpa proses meracik — siap dibuat barista.": "Order directly without crafting — ready to be made by the barista.",
  "Pilih pengguna": "Select user",
  "Pilihan racikanmu belum lengkap. Mulai lagi dari pemilihan base ya.": "Your blend isn't complete yet. Start again from choosing a base.",
  "Poin": "Points",
  "Rata-rata per transaksi": "Average per transaction",
  "Rencana langganan": "Subscription plans",
  "Rencana langganan semua pengguna": "Subscription plans for all users",
  "Rincian keuangan": "Financial breakdown",
  "Sajian": "Serving",
  "Scan kode QRIS ini dengan aplikasi bank atau e-wallet apa pun.": "Scan this QRIS code with any bank or e-wallet app.",
  "Susu": "Milk",
  "Takaran tiap bahan yang dipakai barista untuk satu gelas.": "The measure of each ingredient the barista uses for one cup.",
  "Tambah rencana": "Add plan",
  "Tip barista": "Barista tip",
  "Tip ditambahkan ke total pembayaran dan dicatat terpisah untuk barista.": "The tip is added to the total and recorded separately for the barista.",
  "Tip untuk Barista": "Tip for the Barista",
  "Total penerimaan": "Total received",
  "aktif": "active",
  "jeda": "paused",
  "komponen": "components",
  "poin": "points",
  // Menu & takaran
  "Cokelat hangat manis untuk semua umur.": "Warm sweet chocolate for all ages.",
  "Diseduh dingin 12 jam, smooth & manis alami.": "Cold brewed for 12 hours, smooth and naturally sweet.",
  "Espresso lembut dengan susu segar.": "Smooth espresso with fresh milk.",
  "Espresso, susu, dan foam seimbang.": "Balanced espresso, milk, and foam.",
  "Matcha premium dengan susu creamy.": "Premium matcha with creamy milk.",
  "Makanan Ringan": "Snacks",
  "Camilan gurih dan manis untuk teman minum kopi Scoffey.":
    "Savory and sweet bites to pair with your Scoffey coffee.",
  "Kue tipis gurih, pas teman ngopi.": "Thin savory cake, perfect with coffee.",
  "Tapai goreng renyah dengan rasa manis.": "Crispy fermented-cassava fritter with a sweet tang.",
  "Tahu isi bakso gurih hangat.": "Tofu stuffed with savory meatball filling, served warm.",
  "Tempe goreng tepung khas Banyumas.": "Banyumas-style battered fried tempeh.",
  "Pisang goreng renyah beraroma vanila.": "Crispy banana fritter with a hint of vanilla.",
  "Tahu goreng crispy dengan bumbu lezat.": "Crispy fried tofu with tasty seasoning.",
  "Pisang gulung kulit lumpia renyah.": "Banana spring-roll wrap, fried crispy.",
  "Kentang goreng renyah klasik.": "Classic crispy french fries.",
  "Singkong goreng empuk, taburan gula aren.": "Soft fried cassava with palm-sugar sprinkle.",
};

/** English source copy -> Indonesian translation (screens whose source copy is English). */
const ID: Record<string, string> = {
  ...ID_ABOUT,
  ...ID_VISION,
  ...ID_FUTURE,
  ...ID_TECHNOLOGY,
  ...ID_FLOW,
  ...ID_EXTRA,
  ...ID_EXTRA2,
  // Navigation & page titles
  Home: "Beranda",
  Create: "Buat",
  "My Creations": "Kreasiku",
  Community: "Komunitas",
  Profile: "Profil",
  "CHOOSE YOUR BASE": "PILIH BASE KAMU",
  "TASTE PREFERENCES": "PREFERENSI RASA",
  "PICK INGREDIENTS": "PILIH BAHAN",
  "AI RECOMMENDATION": "REKOMENDASI AI",
  "ADJUST YOUR DRINK": "SESUAIKAN MINUMANMU",
  "FINAL RECIPE CARD": "KARTU RESEP FINAL",
  "ORDER SUMMARY": "RINGKASAN PESANAN",
  "MY CREATIONS": "KREASIKU",
  COMMUNITY: "KOMUNITAS",
  "Your Recipe, Your Story": "Resepmu, Ceritamu",
  "Together, We Brew Innovation": "Bersama, Kita Meracik Inovasi",
  "Behind the Scene": "Di Balik Layar",

  // Home
  Hi: "Hai",
  "Create your drink": "Buat minumanmu",
  "with Digital Barista": "bersama Digital Barista",
  "Create Your Drink": "Buat Minumanmu",
  "What's new": "Yang Baru",
  "Recommended for you": "Rekomendasi untukmu",
  "Top Creations": "Kreasi Terbaik",
  "Match score": "Skor kecocokan",
  "Your last creations": "Kreasi terakhirmu",
  "See full menu": "Lihat semua menu",
  "Hide menu": "Sembunyikan menu",
  "Menu Favorit": "Menu Favorit",
  "Semua menu": "Semua menu",

  // Taste preferences & adjust sliders
  Sweetness: "Kemanisan",
  Intensity: "Intensitas",
  Creaminess: "Creaminess",
  Temperature: "Suhu",
  Mood: "Mood",
  Low: "Rendah",
  Medium: "Sedang",
  Sweet: "Manis",
  "Extra Sweet": "Ekstra Manis",
  Mild: "Lembut",
  Balanced: "Seimbang",
  Strong: "Kuat",
  "Very Strong": "Sangat Kuat",
  Light: "Ringan",
  Creamy: "Creamy",
  "Very Creamy": "Sangat Creamy",
  Hot: "Panas",
  Iced: "Dingin",
  Frappe: "Frappe",
  Fruity: "Buah",
  Nutty: "Kacang",
  Chocolatey: "Cokelat",
  Floral: "Bunga",
  Classic: "Klasik",
  "Coffee Strength": "Kekuatan Kopi",
  "Milk / Creaminess": "Susu / Creaminess",
  "Ice Level": "Tingkat Es",

  // Step labels (progress dots + landing flow preview)
  "Langkah": "Langkah",
  "dari": "dari",
  "Base": "Base",
  "Taste": "Rasa",
  "Items": "Bahan",
  "AI": "AI",
  "Adjust": "Atur",
  "Recipe": "Resep",
  "Pilih Base": "Pilih Base",
  "Atur Rasa": "Atur Rasa",
  "Pilih Bahan": "Pilih Bahan",
  "Rekomendasi AI": "Rekomendasi AI",

  // Result / recipe
  "Adjust Your Drink": "Sesuaikan Minumanmu",
  Compatibility: "Kecocokan",
  Strength: "Kekuatan",
  Aroma: "Aroma",
  Body: "Body",

  // Creations
  Detail: "Detail",
  Reorder: "Pesan Ulang",

  // Checkout
  "Dine In": "Makan di Tempat",
  Takeaway: "Bawa Pulang",

  // Auth
  "Welcome Back!": "Selamat Datang Kembali!",

  // Salinan sumber berbahasa Inggris
  "Ready to create your perfect coffee today?": "Siap meracik kopi sempurnamu hari ini?",
};

/** Translate source copy (Indonesian or English) for the active language. */
export function t(text: string): string {
  if (currentLang === "id") return ID[text] ?? text;
  return EN[text] ?? text;
}

/** Current language for non-React modules (e.g. recipe builders). */
export function getLang(): Lang {
  return currentLang;
}

type Ctx = { lang: Lang; setLang: (l: Lang) => void };
const LanguageContext = createContext<Ctx>({ lang: DEFAULT_LANG, setLang: () => {} });

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>(DEFAULT_LANG);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(KEY);
      if (stored === "id" || stored === "en") {
        currentLang = stored;
        setLangState(stored);
      }
    } catch {
      /* ignore */
    }
  }, []);

  const setLang = (next: Lang) => {
    currentLang = next;
    setLangState(next);
    try {
      localStorage.setItem(KEY, next);
    } catch {
      /* ignore */
    }
  };

  currentLang = lang;

  return (
    <LanguageContext.Provider value={{ lang, setLang }}>
      {/* Re-mount on language change so every t() call re-evaluates. */}
      <div key={lang} className="contents">
        {children}
      </div>
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}
