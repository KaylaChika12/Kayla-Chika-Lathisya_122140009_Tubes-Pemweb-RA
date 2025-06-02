from pyramid.view import view_config
from pyramid.httpexceptions import HTTPNotFound, HTTPForbidden, HTTPUnauthorized
from ..models.order_item import OrderItem
from ..models.order import Order
from ..security import is_admin

# View to list all order items for a specific order (owner or admin only)
@view_config(route_name='order_items_by_order', request_method='GET', renderer='json', permission='user_access')
def get_order_items_for_order(request):
    order_id = request.matchdict['order_id']
    order = request.dbsession.query(Order).filter_by(id=order_id).first()
    if not order:
        raise HTTPNotFound(json_body={'error': 'Order not found'})

    userid = request.authenticated_userid
    if not userid:
        raise HTTPUnauthorized(json_body={'error': 'Authentication required'})

    if not is_admin(request) and str(order.user_id) != userid:
        raise HTTPForbidden(json_body={'error': 'Access denied: You can only view items of your own orders'})
    
    order_items = request.dbsession.query(OrderItem).filter_by(order_id=order_id).all()
    return {'order_items': [oi.to_dict() for oi in order_items]}

# View to get a single order item by ID (owner of order or admin only)
@view_config(route_name='order_item_by_id', request_method='GET', renderer='json', permission='user_access')
def get_order_item(request):
    order_item_id = request.matchdict['id']
    order_item = request.dbsession.query(OrderItem).filter_by(id=order_item_id).first()
    if not order_item:
        raise HTTPNotFound(json_body={'error': 'Order item not found'})

    order = request.dbsession.query(Order).filter_by(id=order_item.order_id).first()
    
    userid = request.authenticated_userid
    if not userid:
        raise HTTPUnauthorized(json_body={'error': 'Authentication required'})

    if not is_admin(request) and (not order or str(order.user_id) != userid):
        raise HTTPForbidden(json_body={'error': 'Access denied: You can only view items of your own orders'})

    return order_item.to_dict()
