def test_add_product(dummy_request):
    from ..views.crud_product import add_product
    dummy_request.json_body = {
        'name': 'Parfum Baru',
        'price': 120000,
        'description': 'Aroma keren'
    }
    response = add_product(dummy_request)
    assert response['message'] == 'Produk berhasil ditambahkan'
