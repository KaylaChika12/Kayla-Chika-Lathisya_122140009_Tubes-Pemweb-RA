from pyramid.config import Configurator
from pyramid.authentication import AuthTktAuthenticationPolicy
from pyramid.authorization import ACLAuthorizationPolicy
from .security import groupfinder, RootFactory
from pyramid.renderers import JSON
from .cors import cors_tween_factory

def main(global_config, **settings):
    """ This function returns a Pyramid WSGI application.
    """
    with Configurator(settings=settings) as config:
        # Authentication and Authorization setup
        authn_policy = AuthTktAuthenticationPolicy(
            settings['auth.secret'],
            callback=groupfinder,
            hashalg='sha512'
        )

        # Correctly reference the cors_tween_factory function
        config.add_tween('bohe_backend.cors.cors_tween_factory')
        config.add_renderer('json', JSON(indent=4))

        authz_policy = ACLAuthorizationPolicy()
        config.set_authentication_policy(authn_policy)
        config.set_authorization_policy(authz_policy)
        config.set_root_factory(RootFactory)

        config.include('pyramid_jinja2')
        config.include('.models')
        config.include('.routes')
        config.scan()
    return config.make_wsgi_app()

