from KaylaChika_122140009_TubesPemweb.models import Product, get_engine, get_session_factory, get_tm_session
from pyramid.paster import get_appsettings, setup_logging
import transaction

def main():
    setup_logging('development.ini')
    settings = get_appsettings('development.ini')

    engine = get_engine(settings)
    session_factory = get_session_factory(engine)
    session = get_tm_session(session_factory, transaction.manager)

    
    if session.query(Product).count() > 0:
        print("ℹ️ Produk sudah ada di database. Skip insert.")
        return

    products = [
        Product(name="Bohe Parfums Scent of Heaven", price=59500, stock=10, description="Aroma floral elegan", image_url="/images/scent of heaven.jpg"),
        Product(name="Bohe Parfums Noir", price=59500, stock=8, description="Maskulin dan misterius", image_url="/images/Noir.jpg"),
        Product(name="Bohe Parfums Feyre", price=136400, stock=5, description="Romantis dan lembut", image_url="/images/Feyre.jpg"),
        Product(name="Bohe Parfums Dose of Love", price=136400, stock=7, description="Aroma penuh cinta", image_url="/images/Dose of Love.jpg"),
        Product(name="Bohe Parfums Berly", price=136400, stock=6, description="Segar dan cerah", image_url="/images/Berly.jpg"),
        Product(name="Bohe Parfums Ladyboss", price=140360, stock=5, description="Berani dan elegan", image_url="/images/Ladyboss.jpg"),
        Product(name="Bohe Parfums Badassery", price=127600, stock=3, description="Khas dan percaya diri", image_url="/images/Badassery.jpg"),
        Product(name="Bohe Parfums Hedon", price=136400, stock=4, description="Gairah dan mewah", image_url="/images/Hedon.jpg"),
        Product(name="Bohe Parfums Ambitchous", price=136400, stock=6, description="Ambisius dan stylish", image_url="/images/Ambitchous.jpg"),
        Product(name="Bohe Parfums Horne", price=145200, stock=2, description="Bold dan eksklusif", image_url="/images/Horne.jpg"),
        Product(name="Bohe Parfums Savage", price=136400, stock=8, description="Intens dan tahan lama", image_url="/images/Savage.jpg"),
    ]

    session.add_all(products)
    transaction.commit()
    print("✅ Produk berhasil ditambahkan ke database.")

if __name__ == '__main__':
    main()
