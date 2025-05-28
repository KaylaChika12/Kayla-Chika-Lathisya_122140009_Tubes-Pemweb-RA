from sqlalchemy import engine_from_config
from sqlalchemy.orm import sessionmaker, scoped_session, configure_mappers
from sqlalchemy.ext.declarative import declarative_base
import zope.sqlalchemy
import transaction
from zope.sqlalchemy import register

DBSession = scoped_session(sessionmaker())
register(DBSession)
Base = declarative_base()

from .user import User
from .product import Product

configure_mappers()

def get_engine(settings, prefix='sqlalchemy.'):
    return engine_from_config(settings, prefix)

def get_session_factory(engine):
    factory = sessionmaker()
    factory.configure(bind=engine)
    return factory

def get_tm_session(session_factory, transaction_manager, request=None):
    dbsession = session_factory(info={"request": request})
    zope.sqlalchemy.register(
        dbsession, transaction_manager=transaction_manager
    )
    return dbsession

def includeme(config):
    """
    Initialize the model for a Pyramid app.

    Activate this setup using:
        config.include('KaylaChika_122140009_TubesPemweb.models')
    """
    settings = config.get_settings()
    settings['tm.manager_hook'] = 'pyramid_tm.explicit_manager'

    config.include('pyramid_tm')
    config.include('pyramid_retry')

    dbengine = settings.get('dbengine')
    if not dbengine:
        dbengine = get_engine(settings)

    session_factory = get_session_factory(dbengine)
    config.registry['dbsession_factory'] = session_factory

    def dbsession(request):
        dbsession = request.environ.get('app.dbsession')
        if dbsession is None:
            dbsession = get_tm_session(
                session_factory, request.tm, request=request
            )
        return dbsession

    config.add_request_method(dbsession, 'dbsession', reify=True)
