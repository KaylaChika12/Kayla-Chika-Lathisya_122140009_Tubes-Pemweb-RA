import argparse
import sys

from pyramid.paster import bootstrap, setup_logging
from sqlalchemy.exc import OperationalError

from .. import models
from ..models import User
from ..security import hash_password

def setup_models(dbsession):
    """
    Tambahkan data dummy user ke database.
    """
    user = User(
        username='admin',
        email='admin@example.com',
        password=hash_password('admin123')
    )
    dbsession.add(user)


def parse_args(argv):
    parser = argparse.ArgumentParser()
    parser.add_argument(
        'config_uri',
        help='Configuration file, e.g., development.ini',
    )
    return parser.parse_args(argv[1:])


def main(argv=sys.argv):
    args = parse_args(argv)
    setup_logging(args.config_uri)
    env = bootstrap(args.config_uri)

    try:
        with env['request'].tm:
            dbsession = env['request'].dbsession

            # ⬇️ Tambahkan baris ini untuk membuat semua tabel
            models.Base.metadata.create_all(bind=dbsession.bind)

            # Tambahkan user dummy setelah tabel dibuat
            setup_models(dbsession)

    except OperationalError:
        print('''
Pyramid is having a problem using your SQL database.  The problem
might be caused by one of the following things:

1.  You may need to initialize your database tables with `alembic`.
    Check your README.txt for description and try to run it.

2.  Your database server may not be running.  Check that the
    database server referred to by the "sqlalchemy.url" setting in
    your "development.ini" file is running.
        ''')
