from pyramid.config import Configurator

def main(global_config, **settings):
    """ This function returns a Pyramid WSGI application. """
    config = Configurator(settings=settings)

    # Include konfigurasi tambahan
    config.include('pyramid_jinja2')
    config.include('.models')      
    config.include('.routes') 

    # Scan otomatis seluruh folder views (hanya sekali)
    config.scan()

    return config.make_wsgi_app()
