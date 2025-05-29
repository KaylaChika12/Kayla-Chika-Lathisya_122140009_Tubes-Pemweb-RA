from pyramid.config import Configurator
from .models import get_engine, get_session_factory, get_tm_session

def main(global_config, **settings):
    """ This function returns a Pyramid WSGI application. """
    # Setup konfigurasi awal
    config = Configurator(settings=settings)

    # Setup koneksi database
    engine = get_engine(settings)
    session_factory = get_session_factory(engine)

    # Tambahkan DBSession ke request
    def dbsession(request):
        return get_tm_session(session_factory, request.tm, request=request)
    
    config.add_request_method(dbsession, 'dbsession', reify=True)

    # Include modul tambahan
    config.include('pyramid_jinja2')
    config.include('pyramid_tm')
    config.include('pyramid_retry')
    config.include('.models')     
    config.include('.routes')     

    config.add_static_view(name='static', path='KaylaChika_122140009_TubesPemweb:static')

    # Scan semua @view_config
    config.scan()

    return config.make_wsgi_app()
