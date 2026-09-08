/**
 * Tambahan kamus dua bahasa untuk teks yang belum tercakup di kamus utama.
 * EN_EXTRA: teks sumber (Indonesia atau Inggris) -> Inggris
 * ID_EXTRA: teks sumber -> Indonesia
 */

export const EN_EXTRA: Record<string, string> = {
  Pesan: "Order",
  "Tambah menu lain": "Add another item",
  "menu lain": "other item",
  item: "items",
  Tambah: "Add",
  Kurangi: "Decrease",
  Hapus: "Remove",

  // Technology / process
  "Input Preferensi": "Preference Input",
  "Pelanggan memilih bahan, rasa yang disukai, dan mood.":
    "Guests pick ingredients, favourite flavours, and mood.",
  "AI menganalisis preferensi dari data rasa (taste profile).":
    "AI analyses preferences from taste-profile data.",
  "Mencocokkan dengan ribuan data bahan & resep.":
    "Matched against thousands of ingredient and recipe records.",
  "Menghasilkan rekomendasi resep yang personal.": "Produces a personal recipe recommendation.",
  "Resep terbaik disajikan dalam recipe card.": "The best recipe is served as a recipe card.",
  "Algoritma AI terlatih untuk memahami ribuan kombinasi rasa dan bahan.":
    "An AI trained to understand thousands of flavour and ingredient combinations.",
  "Pencocokan presisi antara preferensi pengguna dan profil rasa minuman.":
    "Precise matching between your preferences and each drink's flavour profile.",
  "Sistem belajar dari setiap interaksi untuk rekomendasi yang makin akurat.":
    "The system learns from every interaction for sharper recommendations.",
  "Database terintegrasi berisi bahan, profil rasa, dan standar resep Scoffey.":
    "An integrated database of ingredients, flavour profiles, and Scoffey recipe standards.",
  "Setiap resep terukur untuk konsistensi rasa di setiap penyajian.":
    "Every recipe is measured for consistent taste in every serving.",
  "Pengalaman minum yang unik dan sesuai selera setiap pelanggan.":
    "A drinking experience tuned to each guest's taste.",
  "Mempercepat proses kreasi dan mengurangi trial & error.":
    "Speeds up creation and cuts down trial and error.",
  "Mendorong inovasi rasa baru melalui kombinasi bahan tak terbatas.":
    "Drives new flavour innovation through endless ingredient combinations.",
  "Keputusan berbasis data untuk meningkatkan kualitas dan kepuasan.":
    "Data-driven decisions that lift quality and satisfaction.",
  "Mudah direplikasi di berbagai outlet dengan standar kualitas sama.":
    "Easy to replicate across outlets with the same quality standard.",
  "Pengguna memilih preferensi rasa, bahan, dan mood.":
    "Users choose flavour preferences, ingredients, and mood.",
  "Algoritma AI menganalisis dan memprediksi rasa terbaik.":
    "The AI analyses and predicts the best possible taste.",
  "Data bahan, resep, dan profil rasa tersimpan aman.":
    "Ingredient, recipe, and flavour data is stored securely.",
  "Data real-time disinkronkan ke cloud.": "Real-time data synced to the cloud.",
  "Rekomendasi resep personal dengan akurasi tinggi.":
    "Highly accurate, personalised recipe recommendations.",
  "Menganalisis ribuan kombinasi rasa dan bahan untuk hasil rekomendasi terbaik.":
    "Analyses thousands of flavour and ingredient combinations for the best result.",
  "Database bahan, resep, dan profil rasa yang selalu terbarui dan terstandar.":
    "An always up-to-date, standardised ingredient, recipe, and flavour database.",
  "Sync real-time untuk menjaga konsistensi resep di semua perangkat dan outlet.":
    "Real-time sync keeps recipes consistent across devices and outlets.",
  "Keamanan data pengguna dan resep terjamin dengan enkripsi tingkat tinggi.":
    "User and recipe data protected with strong encryption.",
  "Monitoring performa resep dan preferensi untuk inovasi berkelanjutan.":
    "Monitors recipe performance and preferences for continuous innovation.",
  "Akurasi Rasa Rekomendasi": "Recommendation Taste Accuracy",
  "Waktu Eksplorasi Resep Baru": "Time to Explore New Recipes",
  "Kepuasan Pelanggan": "Customer Satisfaction",
  "Mengurangi waste bahan hingga 15%": "Cuts ingredient waste by up to 15%",
  "Ringkasan Proses": "Process Summary",
  "Fitur Utama": "Key Features",
  Manfaat: "Benefits",
  "Komposisi Utama": "Main Composition",
  "Komposisi Bahan": "Ingredient Composition",
  "Profil Rasa": "Flavour Profile",
  Rasa: "Taste",
  "LIHAT RESEP LENGKAP": "VIEW FULL RECIPE",
  "SIMPAN KE FAVORIT": "SAVE TO FAVOURITES",
  "Detail racikanmu": "Your blend in detail",

  "Arsitektur Sistem": "System Architecture",
  "AI sedang meracik": "AI is brewing",
  "IMPACT THAT WE BREW": "IMPACT THAT WE BREW",

  // Loading / AI
  "AI RECOMMENDATION IN PROGRESS": "AI RECOMMENDATION IN PROGRESS",
  "Digital Barista sedang meracik resep terbaik untukmu.":
    "Digital Barista is brewing the best recipe for you.",
  "Membaca preferensi rasamu…": "Reading your taste preferences…",
  "Menyeimbangkan manis & body…": "Balancing sweetness and body…",
  "Memilih bahan yang paling cocok…": "Picking the best-matching ingredients…",
  "Menulis catatan barista…": "Writing the barista notes…",
  "“Setiap racikan adalah kombinasi unik dari sains, data, dan sentuhan kreativitas.”":
    "“Every blend is a unique mix of science, data, and a creative touch.”",
  "Rekomendasi Caramel Nutty Latte": "Caramel Nutty Latte Recommendation",
  "SIMPAN RESEP": "SAVE RECIPE",
  "BAGIKAN RESEP": "SHARE RECIPE",

  // Admin
  "DASHBOARD ADMIN": "ADMIN DASHBOARD",
  "Dashboard Admin": "Admin Dashboard",
  "Halaman ini khusus untuk admin Scoffey.": "This page is for Scoffey admins only.",
  "Masuk sebagai admin": "Sign in as admin",
  "Rekap transaksi dan keuangan untuk akun admin Scoffey.":
    "Transaction and finance summary for Scoffey admin accounts.",
  "Buka antrian pesanan": "Open order queue",
  "Pajak (11%)": "Tax (11%)",

  // Barista panel
  "Panel Barista": "Barista Panel",
  "Halaman ini khusus untuk barista dan admin Scoffey.":
    "This page is for Scoffey baristas and admins only.",
  "Masuk sebagai staf": "Sign in as staff",
  "Rekap hari ini": "Today's summary",
  "Pesanan masuk": "Incoming orders",
  "Selesai disajikan": "Served",
  Omzet: "Revenue",
  "Tip diterima": "Tips received",
  "Muat ulang": "Refresh",
  "Antrian pesanan": "Order queue",
  "Cari nama, pelanggan, atau kode…": "Search name, customer, or code…",
  Proses: "In progress",
  Selesai: "Done",
  "Buka lagi": "Reopen",
  "Tidak ada pesanan pada status ini.": "No orders in this status.",

  // Auth
  "Belum punya akun? ": "Don't have an account yet? ",
  "Sudah punya akun? ": "Already have an account? ",

  // Checkout / notes
  "Contoh: semangat terus ya, kopimu selalu bikin hari lebih baik!":
    "For example: keep it up, your coffee always makes my day better!",
  "Tambahan bahan:": "Extra ingredients:",

  // Flow page
  "AI-Driven Beverage Co-Creation by Scoffey. Kompilasi rancangan antarmuka halaman 1 sampai 14 dengan arah visual navy technology + warm wood + gold coffee accents.":
    "AI-Driven Beverage Co-Creation by Scoffey. A compilation of interface designs for pages 1 to 14 with a navy technology + warm wood + gold coffee visual direction.",
  "Alur Aplikasi (01 – 10)": "App Flow (01 – 10)",
  "Slide Presentasi (11 – 14)": "Presentation Slides (11 – 14)",
  "Prinsip Desain": "Design Principles",
  "Warna Utama": "Core Colours",
  Tipografi: "Typography",
  "Mulai dari Halaman 01": "Start from Page 01",
  "Halaman 11": "Page 11",
  "Halaman 12": "Page 12",
  "Halaman 13": "Page 13",
  "Halaman 14": "Page 14",

  // Future slide
  "DARI IDE, MENJADI IMPACT": "FROM IDEA TO IMPACT",
  "Setiap racikan adalah cerita.": "Every blend is a story.",
  "Setiap cerita adalah koneksi.": "Every story is a connection.",
  "Setiap koneksi menciptakan masa depan kopi yang lebih baik.":
    "Every connection builds a better future for coffee.",
  "Unduh Digital Barista sekarang dan temukan racikan terbaikmu!":
    "Download Digital Barista now and discover your best blend!",
  "Secangkir kopi Scoffey dengan latte art di atas meja kayu":
    "A cup of Scoffey coffee with latte art on a wooden table",
  "Terima kasih telah menjadi bagian dari perjalanan inovasi Digital Barista.":
    "Thank you for being part of the Digital Barista innovation journey.",
  "Kami tidak sabar meracik pengalaman terbaik untukmu!":
    "We can't wait to brew the best experience for you!",
  "Mulai Meracik": "Start Brewing",
  "Bagikan ke Rekan": "Share with Friends",
  "Mari terus berbagi ide dan menciptakan racikan terbaik untuk dunia.":
    "Let's keep sharing ideas and creating the best blends for the world.",

  // Menu
  "Menu Scoffey": "Scoffey Menu",
  "Daftar minuman lengkap Scoffey — pilih favoritmu dan pesan langsung.":
    "The full Scoffey drinks list — pick your favourite and order right away.",

  // Vision slide
  "Inovasi yang didukung teknologi AI dan database bahan minuman untuk menghadirkan rekomendasi resep yang akurat, personal, dan konsisten.":
    "Innovation powered by AI and a beverage ingredient database, delivering accurate, personal, and consistent recipe recommendations.",
  "BRING YOUR VISION TO LIFE WITH": "BRING YOUR VISION TO LIFE WITH",
  "Digital Barista bukan hanya memberikan rekomendasi, tapi juga membantumu mengeksplorasi dan menyimpan kreasimu sendiri.":
    "Digital Barista doesn't just recommend — it helps you explore and save your own creations.",
  "Buat Kreasimu Sendiri": "Create Your Own Blend",
  "Setiap kreasi adalah cerita. Setiap tegukan adalah pengalaman. Bersama Digital Barista, jadilah bagian dari komunitas kreator rasa.":
    "Every creation is a story. Every sip is an experience. With Digital Barista, join a community of flavour creators.",
  "Kreasikan racikan sesuai seleramu.": "Craft a blend that matches your taste.",
  "Pilih Bahan": "Pick Ingredients",
  "Atur Takaran": "Set Measurements",
  "Preview Rasa": "Taste Preview",
  "PREVIEW RASA": "TASTE PREVIEW",
  "Simpan Kreasi": "Save Creation",
  "SIMPAN KREASI": "SAVE CREATION",
  BAGIKAN: "SHARE",
  "Bagikan ke Komunitas": "Share to the Community",
  "AI memprediksi profil rasa kreasimu.": "AI predicts your creation's flavour profile.",
  "Creamy • nutty • dengan sentuhan karamel yang lembut dan seimbang.":
    "Creamy, nutty, with a soft and balanced caramel touch.",
  "Pilih bahan utama, flavor, dan accent sesuai seleramu.":
    "Pick your base, flavours, and accents to taste.",
  "Sesuaikan takaran setiap bahan menggunakan smart slider.":
    "Fine-tune every measurement with the smart slider.",
  "AI memprediksi rasa, aroma, dan keseimbangan minumanmu.":
    "AI predicts the taste, aroma, and balance of your drink.",
  "Simpan resep pribadi dan beri nama unikmu.": "Save your own recipe and give it a unique name.",
  "Bagikan kreasimu dan dapatkan feedback komunitas Scoffey.":
    "Share your creation and get feedback from the Scoffey community.",
  "AI memprediksi rasa berdasarkan kombinasi bahan dan takaran secara real-time.":
    "AI predicts taste in real time from your ingredients and measurements.",
  "Simpan semua resep favoritmu dan lihat riwayat kreasimu kapan saja.":
    "Save all your favourite recipes and revisit your creations any time.",
  "TOGETHER, WE BREW INNOVATION": "TOGETHER, WE BREW INNOVATION",
  "Kolaborasi rasa, teknologi, dan komunitas untuk masa depan kopi yang lebih baik.":
    "Flavour, technology, and community together for a better coffee future.",


  // Deskripsi menu
  "Sirup butterscotch premium.": "Premium butterscotch syrup.",
  "Rasa karamel yang manis dan creamy.": "Sweet, creamy caramel flavour.",
  "Aroma hazelnut yang kaya dan nutty.": "Rich, nutty hazelnut aroma.",
  "Rasa pandan khas dan harum.": "Fragrant, distinctive pandan flavour.",
  "Gula aren alami yang earthy.": "Earthy, natural palm sugar.",
  "Vanilla klasik yang lembut.": "Soft, classic vanilla.",
  "Racikan khas Scoffey.": "Scoffey's signature blend.",
  "Manis klasik yang pas.": "Just-right classic sweetness.",
  "Paduan cokelat dan butterscotch.": "Chocolate meets butterscotch.",
  "Cokelat bertemu karamel.": "Chocolate meets caramel.",
  "Cokelat creamy dengan vanilla.": "Creamy chocolate with vanilla.",
  "Cokelat harum dengan pandan.": "Fragrant chocolate with pandan.",
  "Matcha dengan sentuhan gula aren.": "Matcha with a touch of palm sugar.",
  "Cokelat manis klasik.": "Classic sweet chocolate.",
  "Matcha premium yang earthy.": "Earthy premium matcha.",
  "Red velvet yang lembut dan creamy.": "Soft, creamy red velvet.",
  "Rasa stroberi yang segar.": "Fresh strawberry flavour.",
  "Espresso yang ringan dan bersih.": "Light, clean espresso.",
  "Tambahan shot espresso.": "An extra espresso shot.",
  "Kue tipis gurih, pas teman ngopi.": "Thin savoury cake, perfect with coffee.",
  "Tahu isi bakso gurih hangat.": "Warm tofu filled with savoury meatball.",
  "Tempe goreng tepung khas Banyumas.": "Banyumas-style battered fried tempeh.",
  "Pisang goreng renyah beraroma vanila.": "Crispy fried banana with vanilla aroma.",
  "Pisang gulung kulit lumpia renyah.": "Banana rolled in crispy spring-roll pastry.",
  "Kentang goreng renyah klasik.": "Classic crispy french fries.",
  "Singkong goreng empuk, taburan gula aren.": "Tender fried cassava with palm sugar.",

  // Community
  "Resep Tercipta": "Recipes Created",
  "Kreator Aktif": "Active Creators",
  "Kepuasan Pengguna": "User Satisfaction",
};

export const ID_EXTRA: Record<string, string> = {
  Order: "Pesan",
  "Add another item": "Tambah menu lain",
  "other item": "menu lain",
  "other items": "menu lain",
  items: "item",
  Add: "Tambah",
  Decrease: "Kurangi",
  Remove: "Hapus",

  // Technology / process
  "AI Analysis": "Analisis AI",
  "Database Matching": "Pencocokan Database",
  "Recipe Co-Creation": "Kreasi Resep Bersama",
  "Final Recipe Card": "Kartu Resep Final",
  "AI Taste Engine": "Mesin Rasa AI",
  "Smart Matching": "Pencocokan Cerdas",
  "Dynamic Learning": "Pembelajaran Dinamis",
  "Recipe Database": "Database Resep",
  "Consistent Quality": "Kualitas Konsisten",
  "Personalized Experience": "Pengalaman Personal",
  Efficiency: "Efisiensi",
  Innovation: "Inovasi",
  "Data-Driven": "Berbasis Data",
  Scalability: "Skalabilitas",
  "Taste Profile Analysis": "Analisis Profil Rasa",
  "Ingredient Matching": "Pencocokan Bahan",
  "Flavor Balance Optimization": "Optimasi Keseimbangan Rasa",
  "Finalizing Recommendation": "Menyelesaikan Rekomendasi",
  "User Input": "Masukan Pengguna",
  "AI Engine": "Mesin AI",
  "Cloud Sync": "Sinkronisasi Cloud",
  "Personalized Output": "Hasil Personal",
  "AI & Machine Learning": "AI & Machine Learning",
  "Smart Database": "Database Cerdas",
  "Cloud Technology": "Teknologi Cloud",
  "Data Security": "Keamanan Data",
  "Analytics & Insight": "Analitik & Wawasan",
  Acidity: "Keasaman",
  Balance: "Keseimbangan",
  "Flavor Profile Matching": "Pencocokan Profil Rasa",
  "Ingredient Compatibility": "Kecocokan Bahan",
  "Taste Balance Optimization": "Optimasi Keseimbangan Rasa",
  "Personalization Tuning": "Penyesuaian Personal",
  "Repeat Order Rate": "Tingkat Pesan Ulang",
  Sustainable: "Ramah Lingkungan",

  // Ingredients & recipe
  Espresso: "Espresso",
  "Fresh Milk": "Susu Segar",
  "Caramel Syrup": "Sirup Karamel",
  "Hazelnut Syrup": "Sirup Hazelnut",
  "Sea Salt": "Garam Laut",
  "Whipped Cream": "Krim Kocok",
  "Crushed Nuts": "Kacang Cincang",
  Caramel: "Karamel",
  "Less Sweet": "Kurang Manis",
  "1 pinch": "1 jumput",
  "AI Match Score": "Skor Kecocokan AI",
  "↑ 6% improved": "↑ 6% lebih baik",
  "Analyzing your preferences": "Menganalisis preferensimu",
  "YOUR RECOMMENDED RECIPE": "RESEP REKOMENDASI UNTUKMU",
  "AI RECOMMENDATION IN PROGRESS": "AI SEDANG MERACIK REKOMENDASI",
  "Great Match!": "Sangat Cocok!",

  // Slides & navigation
  Checkout: "Pembayaran",
  Vision: "Visi",
  Technology: "Teknologi",
  "Design Flow": "Alur Desain",
  "UI/UX Design Summary": "Ringkasan Desain UI/UX",
  "DESIGN FLOW 1 – 14": "ALUR DESAIN 1 – 14",
  "coffee • community • comfort": "kopi • komunitas • kenyamanan",
  "READY TO BREW YOUR STORY?": "SIAP MERACIK CERITAMU?",
  "— Scoffey Community": "— Komunitas Scoffey",
  "Download on the App Store": "Unduh di App Store",
  "Get it on Google Play": "Dapatkan di Google Play",
  "Scan to download": "Pindai untuk mengunduh",
  "Thank You!": "Terima Kasih!",
  "Let's Brew the Future Together": "Mari Meracik Masa Depan Bersama",
  "Stay Connected!": "Tetap Terhubung!",
  "Create Your Own Recipe": "Buat Resepmu Sendiri",
  "CREATE YOUR RECIPE": "BUAT RESEPMU",
  "BRING YOUR VISION TO LIFE WITH": "WUJUDKAN VISIMU BERSAMA",
  "TOGETHER, WE BREW INNOVATION": "BERSAMA, KITA MERACIK INOVASI",
  "AI Flavor Prediction": "Prediksi Rasa AI",
  "My Recipe Library": "Perpustakaan Resepku",
};
