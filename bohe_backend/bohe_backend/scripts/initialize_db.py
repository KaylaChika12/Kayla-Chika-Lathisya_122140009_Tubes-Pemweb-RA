import argparse
import sys
import uuid
from datetime import datetime

from pyramid.paster import bootstrap, setup_logging
from sqlalchemy.exc import OperationalError

from ..models.user import User
from ..models.product import Product
from ..models.order import Order
from ..models.order_item import OrderItem


def setup_models(dbsession):
    """
    Add sample data for the Bohe perfume e-commerce database.
    """
    print("Seeding sample data...")

    # Sample User
    user1_id = str(uuid.uuid4())
    user1 = User(
        id=user1_id,
        username="john_doe",
        email="john.doe@example.com",
        role="user",
    )
    user1.set_password("securepassword123")

    user2_id = str(uuid.uuid4())
    user2 = User(
        id=user2_id,
        username="jane_admin",
        email="jane.admin@example.com",
        role="admin",
    )
    user2.set_password("adminpassword123")
    
    dbsession.add_all([user1, user2])
    print("Users added.")

    # Sample Products
    product1_id = str(uuid.uuid4())
    product1 = Product(
        id=product1_id,
        name="Bohe Classic Eau de Parfum",
        description="A timeless and elegant fragrance with notes of rose and sandalwood.",
        price=75.00,
        image_url="https://example.com/bohe-classic.jpg",
        stock=100,
    )

    product2_id = str(uuid.uuid4())
    product2 = Product(
        id=product2_id,
        name="Bohe Fresh Mist",
        description="A light and refreshing body mist, perfect for daily use.",
        price=30.50,
        image_url="https://example.com/bohe-fresh.jpg",
        stock=200,
    )

    product3_id = str(uuid.uuid4())
    product3 = Product(
        id=product3_id,
        name="Bohe Oud Intense",
        description="Deep and rich oud fragrance for a sophisticated evening.",
        price=120.00,
        image_url="https://example.com/bohe-oud.jpg",
        stock=50,
    )

    dbsession.add_all([product1, product2, product3])
    print("Products added.")

    # Sample Order for user1
    order1_id = str(uuid.uuid4())
    order1 = Order(
        id=order1_id,
        user_id=user1.id,
        order_date=datetime.now(),
        total_amount=0.00, # Will be calculated by order items
        customer_name="John Doe",
        phone_number="081234567890",
        address="Jl. Melati No. 10, Kota Metro, Lampung",
        payment_method="QRIS",
        status="completed",
        proof_of_payment_url="https://example.com/proof_payment_order1.jpg",
    )
    dbsession.add(order1)
    dbsession.flush() # Flush to get order1.id for order items

    # Sample Order Items for order1
    order_item1_id = str(uuid.uuid4())
    order_item1 = OrderItem(
        id=order_item1_id,
        order_id=order1.id,
        product_id=product1.id,
        quantity=2,
        price_at_purchase=product1.price,
    )

    order_item2_id = str(uuid.uuid4())
    order_item2 = OrderItem(
        id=order_item2_id,
        order_id=order1.id,
        product_id=product2.id,
        quantity=1,
        price_at_purchase=product2.price,
    )
    
    dbsession.add_all([order_item1, order_item2])
    print("Order and Order Items added.")

    # Update total_amount for order1 based on its items
    order1.total_amount = (order_item1.quantity * order_item1.price_at_purchase) + \
                          (order_item2.quantity * order_item2.price_at_purchase)
    dbsession.add(order1) # Re-add to persist the update
    
    print("Sample data seeding complete.")


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
            setup_models(dbsession)
            print("✅ Sample data inserted successfully.")
    except OperationalError as err:
        print("❌ OperationalError:", err)
        print('''
Database connection failed. Possible causes:
1. You may need to initialize the tables using alembic: `alembic upgrade head`
2. The database server may not be running or misconfigured in development.ini.
''')
    except Exception as e:
        print(f"An unexpected error occurred: {e}")
        print("Please check your database models and connection.")