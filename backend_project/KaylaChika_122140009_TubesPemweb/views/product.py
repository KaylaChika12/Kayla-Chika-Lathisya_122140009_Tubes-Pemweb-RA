from pyramid.view import view_config
from pyramid.httpexceptions import HTTPNotFound
from ..models.product import Product

@view_config(route_name='get_products', renderer='json', request_method='GET')
def get_products(request):
    products = request.dbsession.query(Product).all()
    return [p.to_dict() for p in products]

@view_config(route_name='create_product', renderer='json', request_method='POST')
def create_product(request):
    data = request.json_body
    product = Product(
        name=data['name'],
        price=data['price'],
        description=data.get('description'),
        image_url=data.get('image_url'),
        stock=data.get('stock', 0)
    )
    request.dbsession.add(product)
    return {'message': 'Produk berhasil ditambahkan'}

@view_config(route_name='update_product', renderer='json', request_method='PUT')
def update_product(request):
    product_id = request.matchdict.get('id')
    data = request.json_body
    product = request.dbsession.get(Product, product_id)

    if not product:
        raise HTTPNotFound(json_body={'error': 'Produk tidak ditemukan'})

    product.name = data['name']
    product.price = data['price']
    product.description = data.get('description')
    product.image_url = data.get('image_url')
    product.stock = data.get('stock', product.stock)

    return {'message': 'Produk berhasil diupdate'}

@view_config(route_name='delete_product', renderer='json', request_method='DELETE')
def delete_product(request):
    product_id = request.matchdict.get('id')
    product = request.dbsession.get(Product, product_id)

    if not product:
        raise HTTPNotFound(json_body={'error': 'Produk tidak ditemukan'})

    request.dbsession.delete(product)
    return {'message': 'Produk berhasil dihapus'}
