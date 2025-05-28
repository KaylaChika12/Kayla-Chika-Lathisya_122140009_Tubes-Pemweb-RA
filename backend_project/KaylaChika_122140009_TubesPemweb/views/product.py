from pyramid.view import view_config
from pyramid.response import Response
from pyramid.httpexceptions import HTTPNotFound
from ..models import DBSession
from ..models.product import Product


@view_config(route_name='get_products', renderer='json', request_method='GET')
def get_products(request):
    products = DBSession.query(Product).all()
    return [{
        'id': p.id,
        'name': p.name,
        'price': p.price,
        'description': p.description,
        'image': p.image
    } for p in products]


@view_config(route_name='create_product', renderer='json', request_method='POST')
def create_product(request):
    data = request.json_body
    product = Product(
        name=data['name'],
        price=data['price'],
        description=data.get('description'),
        image=data.get('image')
    )
    DBSession.add(product)
    return {'message': 'Produk berhasil ditambahkan'}


@view_config(route_name='update_product', renderer='json', request_method='PUT')
def update_product(request):
    product_id = request.matchdict.get('id')
    data = request.json_body
    product = DBSession.query(Product).get(product_id)

    if not product:
        return {'error': 'Produk tidak ditemukan'}, 404

    product.name = data['name']
    product.price = data['price']
    product.description = data.get('description')
    product.image = data.get('image')

    return {'message': 'Produk berhasil diupdate'}


@view_config(route_name='delete_product', renderer='json', request_method='DELETE')
def delete_product(request):
    product_id = request.matchdict.get('id')
    product = DBSession.query(Product).get(product_id)

    if not product:
        return {'error': 'Produk tidak ditemukan'}, 404

    DBSession.delete(product)
    return {'message': 'Produk berhasil dihapus'}
