def includeme(config):
    # Autentikasi
    config.add_route('register', '/api/register')
    config.add_route('login', '/api/login')

    # Produk RESTful (semua pakai nama unik)
    config.add_route('get_products', '/api/products')               # GET semua produk
    config.add_route('create_product', '/api/products')            # POST produk baru
    config.add_route('update_product', '/api/products/{id}')       # PUT produk
    config.add_route('delete_product', '/api/products/{id}')       # DELETE produk

    # Halaman utama (opsional)
    config.add_route('home', '/')
