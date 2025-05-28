# KaylaChika_122140009_TubesPemweb/views/auth.py
from pyramid.view import view_config
from pyramid.response import Response
from pyramid.httpexceptions import HTTPBadRequest, HTTPUnauthorized
from ..models.user import User
from passlib.context import CryptContext

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

@view_config(route_name='register', renderer='json', request_method='POST')
def register(request):
    data = request.json_body
    username = data.get('username')
    email = data.get('email')
    password = data.get('password')

    if not all([username, email, password]):
        return HTTPBadRequest(json_body={"error": "Semua field wajib diisi."})

    hashed_password = pwd_context.hash(password)
    user = User(username=username, email=email, password=hashed_password)
    request.dbsession.add(user)

    return Response(json_body={"message": "Registrasi berhasil."}, status=201)

@view_config(route_name='login', renderer='json', request_method='POST')
def login(request):
    data = request.json_body
    username = data.get('username')
    password = data.get('password')

    user = request.dbsession.query(User).filter_by(username=username).first()

    if not user or not pwd_context.verify(password, user.password):
        return HTTPUnauthorized(json_body={"error": "Username atau password salah."})

    return {"message": f"Selamat datang, {username}!"}
