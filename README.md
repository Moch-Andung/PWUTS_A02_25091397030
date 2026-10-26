# UTS Pemrograman Web - Kos Abah

- **Topik:** Sistem Manajemen Kos (Kos Abah), portal penghuni tanpa fitur Admin
- **Kode kelompok:** A02
- **Nama:** Moch. Albar Kesuma Andung
- **NIM:** 25091397030

## Deskripsi
Website portal penghuni Kos Abah. Penghuni dapat melihat info kamarnya, memantau status keluhan, dan mengajukan keluhan baru. Semua data berupa data contoh (file JSON dan array JS).

## Halaman
| Item | File | Penjelasan |
|---|---|---|
| 2.a | `index.html` | Layout utama dengan sidebar kiri. Menu memuat 2.b dan 2.c lewat Ajax. |
| 2.b | `halaman/kamar-saya.html` | Kamar Saya dan Status Keluhan (FR-15, FR-25) |
| 2.c | `halaman/keluhan.html` | Form Ajukan Keluhan (FR-24) |

## Teknologi
HTML, CSS, JavaScript, jQuery, Ajax.

## Fitur interaktif 2.b
Tab Info Kamar dan Keluhan Saya, badge hitungan status, filter status, detail keluhan dengan tanggapan pemilik, keluhan baru dari form langsung muncul (sessionStorage).

## Validasi 2.c
| Field | Aturan |
|---|---|
| Kategori | Wajib dipilih |
| Deskripsi | Wajib, minimal 10 dan maksimal 500 karakter |
| Foto | Opsional, JPG/PNG, maksimal 2 MB |

## Cara menjalankan
Gunakan VS Code + extension Live Server (klik kanan `index.html` lalu Open with Live Server).

## Catatan
Asumsi: batas foto 2 MB, deskripsi minimal 10 karakter, endpoint uji httpbin.org.