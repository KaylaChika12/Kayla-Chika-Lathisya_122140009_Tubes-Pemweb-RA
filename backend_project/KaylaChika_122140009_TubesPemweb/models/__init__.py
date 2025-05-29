from sqlalchemy import engine_from_config
from sqlalchemy.orm import sessionmaker, scoped_session, configure_mappers
from sqlalchemy.ext.declarative import declarative_base
from zope.sqlalchemy import register

# Global DB session & deklarasi base
DBSession = scoped_session(sessionmaker())
Base = declarative_base()

register(DBSession)

from .user import User
from .product import Product

# Konfigurasi semua relasi / mapping (wajib dipanggil)
configure_mappers()


# -----------------------
# ENGINE & SESSION FACTORY
# -----------------------

def get_engine(settings, prefix='sqlalchemy.'):
    return engine_from_config(settings, prefix)

def get_session_factory(engine):
    factory = sessionmaker()
    factory.configure(bind=engine)
    return factory

def get_tm_session(session_factory, transaction_manager, request=None):
    """
    Mendapatkan dbsession yang terikat transaction manager Pyramid
    """
    dbsession = session_factory(info={"request": request})
    register(dbsession, transaction_manager=transaction_manager)
    return dbsession


# -----------------------
# INCLUDER UNTUK PYRAMID
# -----------------------

def includeme(config):
    """
    Inisialisasi model untuk aplikasi Pyramid.

    Aktifkan di project utama (__init__.py) dengan:
        config.include('KaylaChika_122140009_TubesPemweb.models')
    """
    settings = config.get_settings()
    settings['tm.manager_hook'] = 'pyramid_tm.explicit_manager'

    config.include('pyramid_tm')
    config.include('pyramid_retry')

    dbengine = settings.get('dbengine') or get_engine(settings)
    session_factory = get_session_factory(dbengine)
    config.registry['dbsession_factory'] = session_factory

    def dbsession(request):
        dbsession = request.environ.get('app.dbsession')
        if dbsession is None:
            dbsession = get_tm_session(session_factory, request.tm, request=request)
        return dbsession

    config.add_request_method(dbsession, 'dbsession', reify=True)
