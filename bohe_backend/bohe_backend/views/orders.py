from pyramid.view import view_config
from pyramid.httpexceptions import HTTPNotFound, HTTPBadRequest, HTTPForbidden, HTTPUnauthorized
from sqlalchemy.exc import IntegrityError
from uuid import uuid4
from datetime import datetime
from ..models.order import Order
from ..models.order_item import OrderItem
from ..models.product import Product
from ..security import is_admin

def require_fields(data, required_fields):
    missing = [f for f in required_fields if not data.get(f)]
    if missing:
        raise HTTPBadRequest(json_body={'error': f'Missing fields: {", ".join(missing)}'})

# View to list all orders (admin only)
@view_config(route_name='orders', request_method='GET', renderer='json', permission='admin_access')
def get_all_orders(request):
    if not is_admin(request):
        raise HTTPForbidden(json_body={'error': 'Access denied: Admin role required'})

    orders = request.dbsession.query(Order).all()
    return {'orders': [o.to_dict() for o in orders]}

# View to list orders for the authenticated user (user or admin)
@view_config(route_name='my_orders', request_method='GET', renderer='json', permission='user_access')
def get_my_orders(request):
    userid = request.authenticated_userid
    if not userid:
        raise HTTPUnauthorized(json_body={'error': 'Authentication required'})
    
    orders = request.dbsession.query(Order).filter_by(user_id=userid).all()
    return {'orders': [o.to_dict() for o in orders]}

# View to get a single order by ID (owner or admin only)
@view_config(route_name='order_by_id', request_method='GET', renderer='json', permission='user_access')
def get_order(request):
    order_id = request.matchdict['id']
    order = request.dbsession.query(Order).filter_by(id=order_id).first()
    if not order:
        raise HTTPNotFound(json_body={'error': 'Order not found'})

    userid = request.authenticated_userid
    if not userid:
        raise HTTPUnauthorized(json_body={'error': 'Authentication required'})

    if not is_admin(request) and str(order.user_id) != userid:
        raise HTTPForbidden(json_body={'error': 'Access denied: You can only view your own orders'})
    
    return order.to_dict()

# View to create a new order (authenticated users)
@view_config(route_name='orders', request_method='POST', renderer='json', permission='user_access')
def create_order(request):
    userid = request.authenticated_userid
    if not userid:
        raise HTTPUnauthorized(json_body={'error': 'Authentication required'})

    data = request.json_body
    try:
        require_fields(data, ['customer_name', 'phone_number', 'address', 'payment_method', 'items'])
        if not isinstance(data['items'], list) or not data['items']:
            raise HTTPBadRequest(json_body={'error': 'Invalid or empty "items" list'})
    except HTTPBadRequest as e:
        return e

    try:
        new_order = Order(
            id=str(uuid4()),
            user_id=userid,
            customer_name=data['customer_name'],
            phone_number=data['phone_number'],
            address=data['address'],
            payment_method=data['payment_method'],
            status=data.get('status', 'pending_payment'),
            proof_of_payment_url=data.get('proof_of_payment_url'),
            total_amount=0.00
        )
        request.dbsession.add(new_order)
        request.dbsession.flush()

        total_amount = 0
        for item_data in data['items']:
            require_fields(item_data, ['product_id', 'quantity'])
            product = request.dbsession.query(Product).filter_by(id=item_data['product_id']).first()
            if not product:
                raise HTTPBadRequest(json_body={'error': f"Product with ID {item_data['product_id']} not found"})
            if item_data['quantity'] <= 0:
                raise HTTPBadRequest(json_body={'error': 'Quantity must be positive'})
            if product.stock < item_data['quantity']:
                raise HTTPBadRequest(json_body={'error': f"Insufficient stock for product {product.name}. Available: {product.stock}"})

            new_order_item = OrderItem(
                id=str(uuid4()),
                order_id=new_order.id,
                product_id=product.id,
                quantity=item_data['quantity'],
                price_at_purchase=product.price
            )
            request.dbsession.add(new_order_item)
            total_amount += (new_order_item.quantity * new_order_item.price_at_purchase)
            
            product.stock -= item_data['quantity']
            request.dbsession.add(product)

        new_order.total_amount = total_amount
        request.dbsession.add(new_order)

        return {'message': 'Order created successfully', 'order': new_order.to_dict()}
    except IntegrityError:
        request.dbsession.rollback()
        raise HTTPBadRequest(json_body={'error': 'Failed to create order. Check data integrity.'})
    except HTTPBadRequest as e:
        request.dbsession.rollback()
        return e
    except Exception as e:
        request.dbsession.rollback()
        raise HTTPBadRequest(json_body={'error': f'An error occurred: {e}'})

# View to update order status (admin only)
@view_config(route_name='order_by_id', request_method='PUT', renderer='json', permission='admin_access')
def update_order(request):
    if not is_admin(request):
        raise HTTPForbidden(json_body={'error': 'Access denied: Admin role required'})

    order_id = request.matchdict['id']
    order = request.dbsession.query(Order).filter_by(id=order_id).first()
    if not order:
        raise HTTPNotFound(json_body={'error': 'Order not found'})

    data = request.json_body
    
    allowed_status_updates = ['pending_payment', 'waiting_confirmation', 'processing', 'shipped', 'completed', 'cancelled']
    if 'status' in data:
        if data['status'] not in allowed_status_updates:
            raise HTTPBadRequest(json_body={'error': 'Invalid status value'})
        order.status = data['status']
    if 'proof_of_payment_url' in data:
        order.proof_of_payment_url = data['proof_of_payment_url']
    if 'customer_name' in data:
        order.customer_name = data['customer_name']
    if 'phone_number' in data:
        order.phone_number = data['phone_number']
    if 'address' in data:
        order.address = data['address']
    if 'payment_method' in data:
        order.payment_method = data['payment_method']

    try:
        request.dbsession.flush()
        return {'message': 'Order updated successfully', 'order': order.to_dict()}
    except IntegrityError:
        request.dbsession.rollback()
        raise HTTPBadRequest(json_body={'error': 'Failed to update order. Check data integrity.'})
    except Exception as e:
        request.dbsession.rollback()
        raise HTTPBadRequest(json_body={'error': f'An error occurred: {e}'})

# View to delete an order (admin only)
@view_config(route_name='order_by_id', request_method='DELETE', renderer='json', permission='admin_access')
def delete_order(request):
    if not is_admin(request):
        raise HTTPForbidden(json_body={'error': 'Access denied: Admin role required'})

    order_id = request.matchdict['id']
    order = request.dbsession.query(Order).filter_by(id=order_id).first()
    if not order:
        raise HTTPNotFound(json_body={'error': 'Order not found'})

    try:
        request.dbsession.query(OrderItem).filter_by(order_id=order.id).delete()
        request.dbsession.delete(order)
        return {'message': 'Order deleted successfully'}
    except Exception as e:
        request.dbsession.rollback()
        raise HTTPBadRequest(json_body={'error': f'Failed to delete order: {e}'})
