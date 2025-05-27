# BOHE Parfume Bali

Proyek ini merupakan sebuah aplikasi e-commerce sederhana berbasis React yang menjual produk parfum dengan tema khas Bali. Aplikasi ini memungkinkan pengguna untuk melihat daftar produk, menambahkannya ke keranjang, memilih metode pembayaran, serta melakukan proses login dan registrasi pengguna.

## 🛠️ Teknologi yang Digunakan

- React JS
- Redux (untuk manajemen state)
- React Router (navigasi halaman)
- LocalStorage (menyimpan data keranjang)
- HTML & CSS (styling dasar)

---

## 📁 Struktur Halaman

### 1. **Beranda (Home Page)**
Menampilkan daftar produk parfum dari BOHE Bali lengkap dengan nama, gambar, dan harga. Pengguna dapat menambahkan produk ke keranjang melalui tombol **Add to Cart**.

📷 **Contoh Tampilan:**

![Home Page](/mnt/data/85641e02-118b-4443-a081-eb71a5f9576c.png)

---

### 2. **Keranjang (Cart Page)**
Menampilkan produk yang telah ditambahkan ke keranjang. Pengguna dapat:
- Melihat total harga
- Menghapus produk dari keranjang
- Memilih metode pembayaran (QRIS, Bank Mandiri, BCA, BRI, BSI, BNI)
- Melakukan pembayaran dengan tombol **Bayar Sekarang**

📷 **Contoh Tampilan:**

![Cart Page](/mnt/data/6b254d1c-1fa5-4726-8aef-8671bd5ec45c.png)

---

### 3. **Login Page**
Halaman untuk memasukkan username pengguna dan login ke sistem.

📷 **Contoh Tampilan:**

![Login Page](/mnt/data/bd587cd0-988a-481b-9efe-1bf43a73ff11.png)

---

### 4. **Register Page**
Halaman registrasi untuk pengguna baru, terdiri dari nama lengkap, email, dan password.

📷 **Contoh Tampilan:**

![Register Page](/mnt/data/89870e59-75ab-4daa-901f-6fac980f9bc2.png)

---

## 📦 Fitur Utama

- 🛒 Tambah produk ke keranjang
- 🗑️ Hapus produk dari keranjang
- 💳 Pilih metode pembayaran
- 💰 Total harga otomatis dihitung
- 🔐 Login dan Register pengguna
- 💾 Data keranjang tersimpan otomatis di LocalStorage

---

## 🧩 Instalasi

```bash
git clone https://github.com/namakamu/bohe-parfume-bali.git
cd bohe-parfume-bali
npm install
npm start


# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can't go back!**

If you aren't satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you're on your own.

You don't have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn't feel obligated to use this feature. However we understand that this tool wouldn't be useful if you couldn't customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: [https://facebook.github.io/create-react-app/docs/code-splitting](https://facebook.github.io/create-react-app/docs/code-splitting)

### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `npm run build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)
