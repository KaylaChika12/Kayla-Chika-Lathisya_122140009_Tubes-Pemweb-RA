import argparse
import sys
from pyramid.paster import bootstrap, setup_logging
from sqlalchemy.exc import OperationalError
import KaylaChika_122140009_TubesPemweb.models as models
from KaylaChika_122140009_TubesPemweb.models import User
from KaylaChika_122140009_TubesPemweb.security import hash_password

def setup_models(dbsession):
    """
    Tambahkan user dummy ke database jika belum ada.
    """
    existing = dbsession.query(User).filter_by(username='admin').first()
    if existing:
        print("ℹ️ User admin sudah ada, skip insert.")
        return

    user = User(
        username='admin',
        email='admin@example.com',
        password=hash_password('admin123')
    )
    dbsession.add(user)
    print("✅ User admin berhasil ditambahkan.")

def parse_args(argv):
    parser = argparse.ArgumentParser()
    parser.add_argument(
        'config_uri',
        help='Path ke file konfigurasi .ini (misal development.ini)',
    )
    return parser.parse_args(argv[1:])

def main(argv=sys.argv):
    args = parse_args(argv)
    setup_logging(args.config_uri)
    env = bootstrap(args.config_uri)

    try:
        with env['request'].tm:
            dbsession = env['request'].dbsession

            print("📦 Membuat semua tabel dari model...")
            models.Base.metadata.create_all(bind=dbsession.bind)
            print("✅ Semua tabel berhasil dibuat!")

        
            setup_models(dbsession)

    except OperationalError as e:
        print("❌ Gagal koneksi ke database. Pastikan PostgreSQL aktif dan URL benar.")
        print(str(e))

if __name__ == '__main__':
    main()
