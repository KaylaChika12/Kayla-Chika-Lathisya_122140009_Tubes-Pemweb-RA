from pyramid.view import view_config
from pyramid.httpexceptions import HTTPNotFound, HTTPBadRequest, HTTPForbidden
from sqlalchemy.exc import IntegrityError
from uuid import uuid4
from ..models.product import Product
from ..security import is_admin

def require_fields(data, required_fields):
    missing = [f for f in required_fields if not data.get(f)]
    if missing:
        raise HTTPBadRequest(json_body={'error': f'Missing fields: {", ".join(missing)}'})

# View to list all products (publicly accessible)
@view_config(route_name='products', request_method='GET', renderer='json', permission='public_access')
def get_products(request):
    products = request.dbsession.query(Product).all()
    return {'products': [p.to_dict() for p in products]}

# View to get a single product by ID (publicly accessible)
@view_config(route_name='product_by_id', request_method='GET', renderer='json', permission='public_access')
def get_product(request):
    product_id = request.matchdict['id']
    product = request.dbsession.query(Product).filter_by(id=product_id).first()
    if not product:
        raise HTTPNotFound(json_body={'error': 'Product not found'})
    return product.to_dict()

# View to create a new product (admin only)
@view_config(route_name='products', request_method='POST', renderer='json', permission='admin_access')
def create_product(request):
    if not is_admin(request):
        raise HTTPForbidden(json_body={'error': 'Access denied: Admin role required'})

    data = request.json_body
    try:
        require_fields(data, ['name', 'price', 'stock'])
    except HTTPBadRequest as e:
        return e

    try:
        new_product = Product(
            id=str(uuid4()),
            name=data['name'],
            description=data.get('description'),
            price=data['price'],
            image_url=data.get('image_url'),
            stock=data['stock']
        )
        request.dbsession.add(new_product)
        request.dbsession.flush()
        return {'message': 'Product created successfully', 'product': new_product.to_dict()}
    except IntegrityError:
        request.dbsession.rollback()
        raise HTTPBadRequest(json_body={'error': 'Failed to create product. Check data integrity.'})
    except Exception as e:
        request.dbsession.rollback()
        raise HTTPBadRequest(json_body={'error': f'An error occurred: {e}'})

# View to update an existing product (admin only)
@view_config(route_name='product_by_id', request_method='PUT', renderer='json', permission='admin_access')
def update_product(request):
    if not is_admin(request):
        raise HTTPForbidden(json_body={'error': 'Access denied: Admin role required'})

    product_id = request.matchdict['id']
    product = request.dbsession.query(Product).filter_by(id=product_id).first()
    if not product:
        raise HTTPNotFound(json_body={'error': 'Product not found'})

    data = request.json_body
    
    if 'name' in data:
        product.name = data['name']
    if 'description' in data:
        product.description = data['description']
    if 'price' in data:
        product.price = data['price']
    if 'image_url' in data:
        product.image_url = data['image_url']
    if 'stock' in data:
        product.stock = data['stock']

    try:
        request.dbsession.flush()
        return {'message': 'Product updated successfully', 'product': product.to_dict()}
    except IntegrityError:
        request.dbsession.rollback()
        raise HTTPBadRequest(json_body={'error': 'Failed to update product. Check data integrity.'})
    except Exception as e:
        request.dbsession.rollback()
        raise HTTPBadRequest(json_body={'error': f'An error occurred: {e}'})

# View to delete a product (admin only)
@view_config(route_name='product_by_id', request_method='DELETE', renderer='json', permission='admin_access')
def delete_product(request):
    if not is_admin(request):
        raise HTTPForbidden(json_body={'error': 'Access denied: Admin role required'})

    product_id = request.matchdict['id']
    product = request.dbsession.query(Product).filter_by(id=product_id).first()
    if not product:
        raise HTTPNotFound(json_body={'error': 'Product not found'})

    try:
        request.dbsession.delete(product)
        return {'message': 'Product deleted successfully'}
    except Exception as e:
        request.dbsession.rollback()
        raise HTTPBadRequest(json_body={'error': f'Failed to delete product: {e}'})
