from pyramid.security import Allow, Everyone, Authenticated, Deny
from .models.user import User  # Import User model di sini

class RootFactory:
    __acl__ = [
        # Memberikan akses 'view' kepada semua user yang terautentikasi.
        # Ini bisa digunakan untuk basic access control jika ada resource umum
        # yang hanya bisa dilihat oleh user yang sudah login.
        (Allow, Authenticated, 'view'),

        # Memberikan permission 'admin_access' kepada user yang berada dalam grup 'admin'.
        # Grup ini ditentukan oleh fungsi groupfinder.
        (Allow, 'group:admin', 'admin_access'),

        # Memberikan permission 'user_access' kepada user yang berada dalam grup 'user'.
        # Ini juga berlaku untuk admin karena admin secara implisit seringkali
        # dianggap memiliki semua hak akses user biasa.
        (Allow, 'group:user', 'user_access'),
        (Allow, 'group:admin', 'user_access'), # Admin juga punya akses user

        # Memberikan permission 'public_access' kepada siapa saja (termasuk yang tidak login).
        # Gunakan ini untuk rute yang tidak memerlukan autentikasi atau otorisasi,
        # seperti melihat daftar produk.
        (Allow, Everyone, 'public_access'),

        # Deny all other access by default if not explicitly allowed above.
        # Ini adalah fallback yang bagus untuk keamanan.
        (Deny, Everyone, 'all_permissions'),
    ]

    def __init__(self, request):
        """
        Inisialisasi RootFactory.
        request diperlukan untuk mengakses dbsession di groupfinder dan is_admin.
        """
        pass

def groupfinder(userid, request):
    """
    Fungsi callback untuk AuthTktAuthenticationPolicy.
    Menentukan group yang dimiliki oleh user berdasarkan role dari database.
    """
    if not userid:
        # Jika tidak ada userid (user tidak terautentikasi), kembalikan None.
        return None

    # Mengambil user dari database berdasarkan userid
    user = request.dbsession.query(User).filter_by(id=userid).first()

    if user and user.role:
        # Jika user ditemukan dan memiliki role, kembalikan list grupnya.
        # Penting: Awali dengan 'group:' sesuai konvensi Pyramid ACL.
        return ['group:' + user.role]
    
    # Jika user tidak ditemukan atau tidak memiliki role, kembalikan None.
    # Ini akan membuat user tidak memiliki grup dan hanya bergantung pada
    # permission Everyone atau Authenticated.
    return None

def is_admin(request):
    """
    Helper function untuk memeriksa apakah user yang sedang login adalah admin.
    Berguna di view untuk melakukan cek tambahan atau memberikan pesan error yang lebih spesifik.
    """
    # Mengakses authenticated_userid dari request.
    # Nilainya akan diisi oleh AuthTktAuthenticationPolicy setelah autentikasi sukses.
    userid = request.authenticated_userid
    
    if not userid:
        # Jika tidak ada userid, berarti user tidak terautentikasi sama sekali.
        return False
    
    # Mengambil objek user dari database.
    user = request.dbsession.query(User).filter_by(id=userid).first()
    
    # Memastikan user ada dan rolenya adalah 'admin'.
    return user and user.role == 'admin'