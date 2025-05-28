import React from 'react';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../redux/authSlice';

const Navbar = () => {
  const dispatch = useDispatch();
  const { user, isAuthenticated } = useSelector((state) => state.auth);

  const linkStyle = {
    color: 'white',
    textDecoration: 'none',
    padding: '8px 12px',
    borderRadius: '4px',
    transition: 'background-color 0.3s ease',
  };

  const hoverEffect = (e, color) => {
    e.target.style.backgroundColor = color;
  };

  return (
    <nav style={{ backgroundColor: '#333', padding: '10px 20px', color: 'white' }}>
      <ul style={{ listStyle: 'none', display: 'flex', margin: 0, padding: 0, alignItems: 'center' }}>
        <li style={{ marginRight: '20px' }}>
          <Link
            to="/"
            style={linkStyle}
            onMouseOver={(e) => hoverEffect(e, '#555')}
            onMouseOut={(e) => hoverEffect(e, 'transparent')}
          >
            Beranda
          </Link>
        </li>
        <li style={{ marginRight: '20px' }}>
          <Link
            to="/cart"
            style={linkStyle}
            onMouseOver={(e) => hoverEffect(e, '#555')}
            onMouseOut={(e) => hoverEffect(e, 'transparent')}
          >
            Keranjang
          </Link>
        </li>

        {/* Spacer */}
        <li style={{ flexGrow: 1 }}></li>

        {isAuthenticated ? (
          <>
            <li style={{ marginRight: '20px' }}>Hai, {user.username}</li>
            <li>
              <button
                onClick={() => dispatch(logout())}
                style={{
                  ...linkStyle,
                  backgroundColor: '#555',
                  border: 'none',
                  cursor: 'pointer',
                }}
              >
                Logout
              </button>
            </li>
          </>
        ) : (
          <>
            <li style={{ marginRight: '10px' }}>
              <Link
                to="/login"
                style={linkStyle}
                onMouseOver={(e) => hoverEffect(e, '#555')}
                onMouseOut={(e) => hoverEffect(e, 'transparent')}
              >
                Login
              </Link>
            </li>
            <li>
              <Link
                to="/register"
                style={linkStyle}
                onMouseOver={(e) => hoverEffect(e, '#555')}
                onMouseOut={(e) => hoverEffect(e, 'transparent')}
              >
                Register
              </Link>
            </li>
          </>
        )}
      </ul>
    </nav>
  );
};

export default Navbar;
