# 🛒 BOHE Parfume Bali – Aplikasi Web E-Commerce

## 📌 Deskripsi Aplikasi Web
**BOHE Parfume Bali** adalah aplikasi e-commerce parfum berbasis web yang dibangun dengan frontend menggunakan **React JS** dan backend menggunakan **Python Pyramid**. Aplikasi ini memungkinkan pengguna untuk:
- Melihat daftar produk parfum
- Melihat detail produk
- Melakukan registrasi dan login
- Menambahkan produk ke keranjang belanja

Sistem ini juga terintegrasi dengan **PostgreSQL** sebagai basis data, serta menggunakan **Redux** untuk pengelolaan state di frontend.

---

## ⚙️ Dependensi yang Dibutuhkan

### Backend (Python Pyramid)
Install melalui `requirements.txt`:

- `pyramid`
- `pyramid_jinja2`
- `pyramid_tm`
- `SQLAlchemy`
- `zope.sqlalchemy`
- `psycopg2-binary`
- `passlib[bcrypt]`
- `waitress`

---

## 💡 Fitur Aplikasi

### 🔐 Autentikasi
- Register (dengan username, email, dan password)
- Login (dengan validasi ke database PostgreSQL)

### 🛍️ Halaman Frontend
- **Home Page**: Menampilkan semua produk parfum dari backend
- **Login Page**: Autentikasi pengguna berdasarkan username dan password
- **Register Page**: Pendaftaran pengguna baru
- **Product Detail Page**: Menampilkan detail dari setiap produk
- **Cart Page**: Menyimpan produk-produk yang ditambahkan oleh user

### 🧠 Manajemen State
- Menggunakan Redux Toolkit untuk menyimpan data user login dan cart
- Integrasi API menggunakan axios

### 🛠️ Backend API
- `POST /register`: Menambahkan user baru dengan password terenkripsi
- `POST /login`: Login user dan validasi password
- `GET /api/products`: Mengambil seluruh data produk dari database

## 🖼️ Dokumentasi 
![POST Register](frontend\public\images\POST Register.png)
![POST Login](frontend\public\images\POST Login.png)

---

## 🔧 Instalasi

```bash
pip install -r requirements.txt
```

---

## 🔗 Referensi

- [Python Pyramid](https://docs.pylonsproject.org/projects/pyramid/)
- [PostgreSQL](https://www.postgresql.org/)

---

## 🖼️ Dokumentasi Tampilan


![Register Page](frontend/public/images/Register.png)
![Login Page](frontend/public/images/Login.png)
![Beranda Page](frontend/public/images/Beranda.png)
![Keranjang Page](frontend/public/images/Keranjang.png)

