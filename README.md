# 🛒 BOHE Parfume Bali – Aplikasi Web E-Commerce

## 📌 Deskripsi Aplikasi Web

**BOHE Parfume Bali** adalah aplikasi e-commerce parfum berbasis web. Aplikasi ini dibangun menggunakan **React JS** untuk frontend dan **Python Pyramid** untuk backend. Pengguna dapat melihat daftar produk parfum, melihat detail produk, melakukan registrasi dan login, serta menambahkan produk ke keranjang belanja. Sistem ini terintegrasi dengan basis data **PostgreSQL** dan menggunakan **Redux** untuk pengelolaan state di frontend.

## 💡 Fitur Aplikasi

### 🔐 Autentikasi
- Registrasi (dengan username, email, dan password).
- Login (dengan validasi ke database PostgreSQL).
- Logout.

### 🛍️ Halaman Pengguna (Frontend)
- **Beranda (Home Page)**: Menampilkan semua produk parfum dari backend.
- **Halaman Login (Login Page)**: Autentikasi pengguna berdasarkan email dan password.
- **Halaman Registrasi (Register Page)**: Pendaftaran pengguna baru.
- **Halaman Detail Produk (Product Detail Page)**: Menampilkan detail dari setiap produk.
- **Halaman Keranjang (Cart Page)**: Menyimpan produk-produk yang ditambahkan oleh pengguna.
- **Halaman Pesanan Saya (My Orders Page)**: Menampilkan riwayat pesanan pengguna yang telah login.

### 👑 Halaman Admin (Frontend)
- **Dashboard Admin**: Halaman utama untuk navigasi fitur admin.
- **Manajemen Produk Admin**: Memungkinkan admin untuk menambah, mengubah, dan menghapus produk.
- **Manajemen Pesanan Admin**: Memungkinkan admin untuk melihat dan mengubah status pesanan pelanggan.

### 🧠 Manajemen State (Frontend)
- Menggunakan Redux Toolkit untuk menyimpan data login pengguna dan keranjang belanja.
- Integrasi API menggunakan Axios.

### 🛠️ Backend API (Python Pyramid)
- **Autentikasi**:
    - `POST /register`: Menambahkan pengguna baru dengan password terenkripsi.
    - `POST /login`: Login pengguna dan validasi password.
    - `POST /logout`: Logout pengguna.
- **Produk**:
    - `GET /products`: Mengambil seluruh data produk dari database.
    - `GET /products/{id}`: Mengambil detail produk berdasarkan ID.
    - `POST /products`: Membuat produk baru (khusus admin).
    - `PUT /products/{id}`: Memperbarui produk berdasarkan ID (khusus admin).
    - `DELETE /products/{id}`: Menghapus produk berdasarkan ID (khusus admin).
- **Pesanan**:
    - `GET /orders`: Mengambil semua data pesanan (khusus admin).
    - `POST /orders`: Membuat pesanan baru.
    - `GET /my-orders`: Mengambil pesanan milik pengguna yang terautentikasi.
    - `GET /orders/{id}`: Mengambil detail pesanan berdasarkan ID (pemilik atau admin).
    - `PUT /orders/{id}`: Memperbarui status pesanan berdasarkan ID (khusus admin).
    - `DELETE /orders/{id}`: Menghapus pesanan berdasarkan ID (khusus admin).
- **Item Pesanan**:
    - `GET /orders/{order_id}/items`: Mengambil semua item dalam satu pesanan (pemilik atau admin).
    - `GET /order-items/{id}`: Mengambil detail item pesanan berdasarkan ID (pemilik atau admin).

## 📁 Struktur Folder

### Frontend (React JS - direktori `src`)
```
src/
├── api/
│   └── auth.js             # Fungsi terkait API autentikasi
├── components/
│   ├── AdminProtectedRoute.js # Proteksi rute khusus admin
│   ├── Modal.js              # Komponen modal generik
│   ├── Navbar.js             # Komponen navigasi
│   ├── ProductCard.js        # Komponen kartu produk
│   ├── ProtectedRoute.js     # Proteksi rute untuk pengguna terautentikasi
│   └── Toast.js              # Komponen notifikasi toast
├── hooks/
│   ├── useAuth.js            # Hook kustom untuk autentikasi
│   ├── useOrders.js          # Hook kustom untuk manajemen pesanan
│   ├── useProducts.js        # Hook kustom untuk manajemen produk
│   └── useToast.js           # Hook kustom untuk notifikasi toast
├── pages/
│   ├── AdminDashboard.js     # Halaman dashboard admin
│   ├── AdminOrders.js        # Halaman manajemen pesanan admin
│   ├── AdminProducts.js      # Halaman manajemen produk admin
│   ├── Cart.js               # Halaman keranjang belanja
│   ├── Home.css              # Styling untuk halaman Home
│   ├── Home.js               # Halaman utama
│   ├── Login.css             # Styling untuk halaman Login
│   ├── Login.js              # Halaman login
│   ├── MyOrders.js           # Halaman riwayat pesanan pengguna
│   ├── ProductDetail.js      # Halaman detail produk
│   ├── Register.css          # Styling untuk halaman Register
│   └── Register.js           # Halaman registrasi
├── redux/
│   ├── authSlice.js          # Slice Redux untuk state autentikasi
│   ├── cartSlice.js          # Slice Redux untuk state keranjang
│   ├── store.js              # Konfigurasi store Redux
│   └── toastSlice.js         # Slice Redux untuk state toast
├── App.css                   # Styling global aplikasi
├── App.js                    # Komponen utama aplikasi dan routing
├── index.css                 # Styling dasar
└── index.js                  # Titik masuk aplikasi React
```

### Backend (Python Pyramid - direktori `bohe_backend`)
```
bohe_backend/
├── bohe_backend/
│   ├── alembic/              # Konfigurasi dan versi migrasi Alembic
│   │   ├── versions/         # File migrasi database
│   │   │   └── 20250531_53639a18404b.py # Contoh file migrasi
│   │   │   └── README.txt
│   │   └── env.py
│   ├── models/               # Model SQLAlchemy untuk tabel database
│   │   ├── init.py
│   │   ├── meta.py           # Konfigurasi metadata SQLAlchemy
│   │   ├── order.py          # Model untuk tabel pesanan (orders)
│   │   ├── order_item.py     # Model untuk tabel item pesanan (order_items)
│   │   ├── product.py        # Model untuk tabel produk (products)
│   │   └── user.py           # Model untuk tabel pengguna (users)
│   ├── scripts/
│   │   ├── init.py
│   │   └── initialize_db.py  # Skrip untuk inisialisasi database dengan data awal
│   ├── static/               # File statis (CSS, gambar)
│   │   └── theme.css
│   ├── templates/            # Template Jinja2 (tidak banyak digunakan karena API-first)
│   │   └── 404.jinja2
│   │   └── layout.jinja2
│   │   └── mytemplate.jinja2
│   ├── views/                # Logika untuk menangani request HTTP
│   │   ├── init.py
│   │   ├── auth.py           # View untuk autentikasi (register, login, logout)
│   │   ├── default.py        # View default (contoh: halaman utama API)
│   │   ├── notfound.py       # View untuk error 404
│   │   ├── order_items.py    # View untuk item pesanan
│   │   ├── orders.py         # View untuk pesanan
│   │   └── products.py       # View untuk produk
│   ├── init.py           # Inisialisasi aplikasi Pyramid
│   ├── cors.py               # Konfigurasi CORS
│   ├── pshell.py             # Konfigurasi shell interaktif Pyramid
│   ├── routes.py             # Definisi rute URL
│   ├── security.py           # Konfigurasi keamanan (ACL, policy)
│   └── tests.py              # Tes unit (contoh)
├── bohe_backend.egg-info/  # Metadata package Python
│   ├── PKG-INFO
│   ├── SOURCES.txt
│   ├── dependency_links.txt
│   ├── entry_points.txt
│   ├── not-zip-safe
│   ├── requires.txt
│   └── top_level.txt
├── CHANGES.txt
├── MANIFEST.in
├── README.txt
├── development.ini         # Konfigurasi untuk lingkungan development
├── production.ini          # Konfigurasi untuk lingkungan production
├── pytest.ini              # Konfigurasi untuk PyTest
└── setup.py                # Skrip setup package Python
```


## 🗃️ Tabel Backend (PostgreSQL)

Berikut adalah deskripsi tabel yang digunakan dalam backend:

### 1. Tabel `users`
Menyimpan informasi pengguna.

| Nama Kolom  | Tipe Data                 | Kendala                                    | Deskripsi                                 |
|-------------|---------------------------|--------------------------------------------|-------------------------------------------|
| `id`        | `String`                  | `PRIMARY KEY`                              | ID unik untuk pengguna (UUID)             |
| `username`  | `String`                  | `NOT NULL`, `UNIQUE`                       | Nama pengguna                             |
| `email`     | `String`                  | `NOT NULL`, `UNIQUE`                       | Alamat email pengguna                     |
| `password`  | `String`                  | `NOT NULL`                                 | Password pengguna (dienkripsi)            |
| `role`      | `String`                  | `NOT NULL`, `DEFAULT 'user'`               | Peran pengguna (misalnya 'user', 'admin') |
| `created_at`| `TIMESTAMP`               | `NOT NULL`, `DEFAULT CURRENT_TIMESTAMP`    | Waktu pembuatan record                    |
| `updated_at`| `TIMESTAMP`               | `NOT NULL`, `DEFAULT CURRENT_TIMESTAMP`    | Waktu pembaruan record terakhir         |

### 2. Tabel `products`
Menyimpan informasi produk parfum.

| Nama Kolom    | Tipe Data                 | Kendala                                    | Deskripsi                               |
|---------------|---------------------------|--------------------------------------------|-----------------------------------------|
| `id`          | `String`                  | `PRIMARY KEY`                              | ID unik untuk produk (UUID)             |
| `name`        | `String`                  | `NOT NULL`                                 | Nama produk                             |
| `description` | `Text`                    |                                            | Deskripsi produk                        |
| `price`       | `DECIMAL(10, 2)`          | `NOT NULL`                                 | Harga produk                            |
| `image_url`   | `String`                  |                                            | URL gambar produk                       |
| `stock`       | `Integer`                 | `NOT NULL`, `DEFAULT 0`                    | Jumlah stok produk yang tersedia        |
| `created_at`  | `TIMESTAMP`               | `NOT NULL`, `DEFAULT CURRENT_TIMESTAMP`    | Waktu pembuatan record                  |
| `updated_at`  | `TIMESTAMP`               | `NOT NULL`, `DEFAULT CURRENT_TIMESTAMP`    | Waktu pembaruan record terakhir       |

### 3. Tabel `orders`
Menyimpan informasi pesanan yang dibuat oleh pengguna.

| Nama Kolom             | Tipe Data                 | Kendala                                    | Deskripsi                                    |
|------------------------|---------------------------|--------------------------------------------|----------------------------------------------|
| `id`                   | `String`                  | `PRIMARY KEY`                              | ID unik untuk pesanan (UUID)                 |
| `user_id`              | `String`                  | `NOT NULL`, `FOREIGN KEY (users.id)`       | ID pengguna yang membuat pesanan             |
| `order_date`           | `TIMESTAMP`               | `NOT NULL`, `DEFAULT CURRENT_TIMESTAMP`    | Tanggal dan waktu pesanan dibuat             |
| `total_amount`         | `DECIMAL(10, 2)`          | `NOT NULL`                                 | Jumlah total harga pesanan                   |
| `customer_name`        | `String`                  | `NOT NULL`                                 | Nama pelanggan                               |
| `phone_number`         | `String`                  | `NOT NULL`                                 | Nomor telepon pelanggan                      |
| `address`              | `Text`                    | `NOT NULL`                                 | Alamat pengiriman                            |
| `payment_method`       | `String`                  | `NOT NULL`                                 | Metode pembayaran yang dipilih               |
| `status`               | `String`                  | `NOT NULL`, `DEFAULT 'pending_payment'`    | Status pesanan (misalnya 'pending_payment', 'completed') |
| `proof_of_payment_url` | `String`                  |                                            | URL bukti pembayaran (jika ada)              |
| `created_at`           | `TIMESTAMP`               | `NOT NULL`, `DEFAULT CURRENT_TIMESTAMP`    | Waktu pembuatan record                       |
| `updated_at`           | `TIMESTAMP`               | `NOT NULL`, `DEFAULT CURRENT_TIMESTAMP`    | Waktu pembaruan record terakhir            |

### 4. Tabel `order_items`
Menyimpan detail item dalam setiap pesanan.

| Nama Kolom          | Tipe Data                 | Kendala                                       | Deskripsi                                    |
|---------------------|---------------------------|-----------------------------------------------|----------------------------------------------|
| `id`                | `String`                  | `PRIMARY KEY`                                 | ID unik untuk item pesanan (UUID)            |
| `order_id`          | `String`                  | `NOT NULL`, `FOREIGN KEY (orders.id)`         | ID pesanan tempat item ini berada            |
| `product_id`        | `String`                  | `NOT NULL`, `FOREIGN KEY (products.id)`       | ID produk yang dipesan                       |
| `quantity`          | `Integer`                 | `NOT NULL`                                    | Jumlah produk yang dipesan                   |
| `price_at_purchase` | `DECIMAL(10, 2)`          | `NOT NULL`                                    | Harga produk saat pembelian                  |
| `created_at`        | `TIMESTAMP`               | `NOT NULL`, `DEFAULT CURRENT_TIMESTAMP`       | Waktu pembuatan record                       |
| `updated_at`        | `TIMESTAMP`               | `NOT NULL`, `DEFAULT CURRENT_TIMESTAMP`       | Waktu pembaruan record terakhir            |

## ⚙️ API Backend dan Contoh Respons

Basis URL: `http://localhost:6543` (dapat berbeda tergantung konfigurasi).

### Autentikasi

1.  **Registrasi Pengguna**
    * **Endpoint**: `POST /register`
    * **Request Body**:
        ```json
        {
          "username": "testuser",
          "email": "test@example.com",
          "password": "password123",
          "role": "user" // Opsional, default 'user'
        }
        ```
    * **Respons Sukses (200 OK)**:
        ```json
        {
          "message": "Registration successful",
          "user": {
            "id": "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx",
            "username": "testuser",
            "email": "test@example.com",
            "role": "user",
            "created_at": "YYYY-MM-DDTHH:MM:SS.ffffff",
            "updated_at": "YYYY-MM-DDTHH:MM:SS.ffffff"
          }
        }
        ```
    * **Respons Error (409 Conflict - Email atau Username sudah ada)**:
        ```json
        {
          "error": "Email already exists" // atau "Username already exists"
        }
        ```
    * **Respons Error (400 Bad Request - Field tidak lengkap)**:
        ```json
        {
          "error": "Missing fields: username, email, password"
        }
        ```

2.  **Login Pengguna**
    * **Endpoint**: `POST /login`
    * **Request Body**:
        ```json
        {
          "email": "test@example.com",
          "password": "password123"
        }
        ```
    * **Respons Sukses (200 OK)** (Header akan berisi cookie `auth_tkt`):
        ```json
        {
          "message": "Login successful",
          "user": {
            "id": "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx",
            "username": "testuser",
            "email": "test@example.com",
            "role": "user",
            "created_at": "YYYY-MM-DDTHH:MM:SS.ffffff",
            "updated_at": "YYYY-MM-DDTHH:MM:SS.ffffff"
          }
        }
        ```
    * **Respons Error (401 Unauthorized - Kredensial salah)**:
        ```json
        {
          "error": "Invalid credentials"
        }
        ```

3.  **Logout Pengguna**
    * **Endpoint**: `POST /logout`
    * **Request Body**: (Kosong)
    * **Respons Sukses (200 OK)** (Header akan menghapus cookie `auth_tkt`):
        ```json
        {
          "message": "Logout successful"
        }
        ```

### Produk

1.  **Mendapatkan Semua Produk**
    * **Endpoint**: `GET /products`
    * **Respons Sukses (200 OK)**:
        ```json
        {
          "products": [
            {
              "id": "product_uuid_1",
              "name": "Bohe Classic Eau de Parfum",
              "description": "A timeless and elegant fragrance with notes of rose and sandalwood.",
              "price": 75.00,
              "image_url": "[https://example.com/bohe-classic.jpg](https://example.com/bohe-classic.jpg)",
              "stock": 100,
              "created_at": "YYYY-MM-DDTHH:MM:SS.ffffff",
              "updated_at": "YYYY-MM-DDTHH:MM:SS.ffffff"
            },
            // ... produk lainnya
          ]
        }
        ```

2.  **Mendapatkan Detail Produk**
    * **Endpoint**: `GET /products/{id}`
    * **Respons Sukses (200 OK)**:
        ```json
        {
          "id": "product_uuid_1",
          "name": "Bohe Classic Eau de Parfum",
          "description": "A timeless and elegant fragrance with notes of rose and sandalwood.",
          "price": 75.00,
          "image_url": "[https://example.com/bohe-classic.jpg](https://example.com/bohe-classic.jpg)",
          "stock": 100,
          "created_at": "YYYY-MM-DDTHH:MM:SS.ffffff",
          "updated_at": "YYYY-MM-DDTHH:MM:SS.ffffff"
        }
        ```
    * **Respons Error (404 Not Found)**:
        ```json
        {
          "error": "Product not found"
        }
        ```

3.  **Membuat Produk Baru (Admin)**
    * **Endpoint**: `POST /products`
    * **Headers**: `Authorization: Bearer {token_jwt_auth_tkt}`
    * **Request Body**:
        ```json
        {
          "name": "Parfum Baru",
          "description": "Deskripsi parfum baru.",
          "price": 150.00,
          "image_url": "[https://example.com/parfum-baru.jpg](https://example.com/parfum-baru.jpg)",
          "stock": 50
        }
        ```
    * **Respons Sukses (200 OK)**:
        ```json
        {
          "message": "Product created successfully",
          "product": { /* detail produk yang baru dibuat */ }
        }
        ```
    * **Respons Error (403 Forbidden - Bukan admin)**:
        ```json
        {
          "error": "Access denied: Admin role required"
        }
        ```

4.  **Memperbarui Produk (Admin)**
    * **Endpoint**: `PUT /products/{id}`
    * **Headers**: `Authorization: Bearer {token_jwt_auth_tkt}`
    * **Request Body**: (Field yang ingin diubah)
        ```json
        {
          "price": 160.00,
          "stock": 45
        }
        ```
    * **Respons Sukses (200 OK)**:
        ```json
        {
          "message": "Product updated successfully",
          "product": { /* detail produk yang diperbarui */ }
        }
        ```

5.  **Menghapus Produk (Admin)**
    * **Endpoint**: `DELETE /products/{id}`
    * **Headers**: `Authorization: Bearer {token_jwt_auth_tkt}`
    * **Respons Sukses (200 OK)**:
        ```json
        {
          "message": "Product deleted successfully"
        }
        ```

### Pesanan

1.  **Membuat Pesanan Baru (Pengguna Terautentikasi)**
    * **Endpoint**: `POST /orders`
    * **Headers**: `Authorization: Bearer {token_jwt_auth_tkt}`
    * **Request Body**:
        ```json
        {
          "customer_name": "Nama Pelanggan",
          "phone_number": "081234567890",
          "address": "Alamat Lengkap Pelanggan",
          "payment_method": "QRIS",
          "items": [
            { "product_id": "product_uuid_1", "quantity": 2 },
            { "product_id": "product_uuid_2", "quantity": 1 }
          ]
        }
        ```
    * **Respons Sukses (200 OK)**:
        ```json
        {
          "message": "Order created successfully",
          "order": { /* detail pesanan yang baru dibuat, termasuk ID pesanan dan total_amount yang dihitung */ }
        }
        ```
    * **Respons Error (400 Bad Request - Data tidak valid atau stok tidak cukup)**:
        ```json
        {
          "error": "Insufficient stock for product NamaProduk. Available: X"
        }
        ```

2.  **Mendapatkan Pesanan Saya (Pengguna Terautentikasi)**
    * **Endpoint**: `GET /my-orders`
    * **Headers**: `Authorization: Bearer {token_jwt_auth_tkt}`
    * **Respons Sukses (200 OK)**:
        ```json
        {
          "orders": [
            {
              "id": "order_uuid_1",
              "user_id": "user_uuid_logged_in",
              "order_date": "YYYY-MM-DDTHH:MM:SS.ffffff",
              "total_amount": 200.50,
              "customer_name": "Nama Pelanggan",
              "phone_number": "081234567890",
              "address": "Alamat Lengkap Pelanggan",
              "payment_method": "QRIS",
              "status": "completed",
              "proof_of_payment_url": null,
              "created_at": "YYYY-MM-DDTHH:MM:SS.ffffff",
              "updated_at": "YYYY-MM-DDTHH:MM:SS.ffffff"
            },
            // ... pesanan lainnya milik pengguna
          ]
        }
        ```

3.  **Mendapatkan Semua Pesanan (Admin)**
    * **Endpoint**: `GET /orders`
    * **Headers**: `Authorization: Bearer {token_jwt_auth_tkt}`
    * **Respons Sukses (200 OK)**: (Format mirip dengan `/my-orders` tetapi untuk semua pengguna)

4.  **Mendapatkan Detail Pesanan (Pemilik atau Admin)**
    * **Endpoint**: `GET /orders/{id}`
    * **Headers**: `Authorization: Bearer {token_jwt_auth_tkt}`
    * **Respons Sukses (200 OK)**: (Format mirip dengan satu objek pesanan dari `/my-orders`)

5.  **Memperbarui Status Pesanan (Admin)**
    * **Endpoint**: `PUT /orders/{id}`
    * **Headers**: `Authorization: Bearer {token_jwt_auth_tkt}`
    * **Request Body**:
        ```json
        {
          "status": "shipped" // contoh status baru
        }
        ```
    * **Respons Sukses (200 OK)**:
        ```json
        {
          "message": "Order updated successfully",
          "order": { /* detail pesanan yang diperbarui */ }
        }
        ```

### Item Pesanan

1.  **Mendapatkan Item dari Suatu Pesanan (Pemilik atau Admin)**
    * **Endpoint**: `GET /orders/{order_id}/items`
    * **Headers**: `Authorization: Bearer {token_jwt_auth_tkt}`
    * **Respons Sukses (200 OK)**:
        ```json
        {
          "order_items": [
            {
              "id": "order_item_uuid_1",
              "order_id": "order_uuid_1",
              "product_id": "product_uuid_1",
              "quantity": 2,
              "price_at_purchase": 75.00,
              "created_at": "YYYY-MM-DDTHH:MM:SS.ffffff",
              "updated_at": "YYYY-MM-DDTHH:MM:SS.ffffff"
            },
            // ... item pesanan lainnya
          ]
        }
        ```

## 🚀 Cara Menjalankan Aplikasi

### Backend (Python Pyramid)
1.  **Clone Repository** (Jika belum)
2.  **Masuk ke direktori backend**:
    ```bash
    cd Kayla-Chika-Lathisya_122140009_Tubes-Pemweb-RA-e380c182f309b09c150df72fa6f603906f4aae22/bohe_backend
    ```
3.  **Buat dan Aktifkan Virtual Environment** (Direkomendasikan):
    ```bash
    python -m venv env
    source env/bin/activate  # Linux/macOS
    # atau
    env\Scripts\activate    # Windows
    ```
4.  **Install Dependensi**:
    ```bash
    pip install -e ".[testing]" 
    ```
    Atau jika `requirements.txt` sudah ada di root backend dan lengkap:
    ```bash
    pip install -r requirements.txt
    ```
5.  **Konfigurasi Database**:
    * Pastikan PostgreSQL server berjalan.
    * Buat database baru (misalnya `bohedb`) dan pengguna (misalnya `bohe_user` dengan password `bohe_password`).
    * Sesuaikan string koneksi `sqlalchemy.url` di file `development.ini` jika berbeda:
        ```ini
        sqlalchemy.url = postgresql://bohe_user:bohe_password@localhost:5432/bohedb
        ```
6.  **Inisialisasi dan Migrasi Database** (Menggunakan Alembic):
    ```bash
    alembic -c development.ini revision --autogenerate -m "init_tables" 
    alembic -c development.ini upgrade head 
    ```
7.  **(Opsional) Isi Data Awal**:
    ```bash
    initialize_bohe_backend_db development.ini
    ```
8.  **Jalankan Server Backend**:
    ```bash
    pserve development.ini --reload
    ```
    Server backend akan berjalan di `http://localhost:6543`.

### Frontend (React JS)
1.  **Masuk ke direktori root project** (Jika belum)
    ```bash
    cd Kayla-Chika-Lathisya_122140009_Tubes-Pemweb-RA-e380c182f309b09c150df72fa6f603906f4aae22
    ```
2.  **Install Dependensi Node.js**:
    ```bash
    npm install
    ```
3.  **Jalankan Aplikasi React**:
    ```bash
    npm start
    ```
    Aplikasi frontend akan berjalan di `http://localhost:3000` dan otomatis membuka di browser.

## ©️ Hak Cipta

Kayla Chika Lathisya - 122140009
