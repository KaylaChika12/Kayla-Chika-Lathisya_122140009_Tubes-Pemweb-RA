from pyramid.response import Response
from pyramid.view import view_config

@view_config(route_name='home', renderer='json')
def home_view(request):
    return {'message': 'Welcome to Bohe API'}