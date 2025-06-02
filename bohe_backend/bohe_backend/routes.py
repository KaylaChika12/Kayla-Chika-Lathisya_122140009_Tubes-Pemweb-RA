def includeme(config):
    config.add_static_view('static', 'static', cache_max_age=3600)
    config.add_route('home', '/')
    
    # Authentication and User Management Routes
    config.add_route('register', '/register')
    config.add_route('login', '/login')
    config.add_route('logout', '/logout')

    # Product Routes
    config.add_route('products', '/products')
    config.add_route('product_by_id', '/products/{id}')

    # Order Routes
    config.add_route('orders', '/orders')
    config.add_route('my_orders', '/my-orders')
    config.add_route('order_by_id', '/orders/{id}')

    # Order Item Routes (read-only direct access, modification via Order)
    config.add_route('order_items_by_order', '/orders/{order_id}/items')
    config.add_route('order_item_by_id', '/order-items/{id}')