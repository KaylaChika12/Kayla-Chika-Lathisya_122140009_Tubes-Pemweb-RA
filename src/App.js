import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import store from './redux/store'; // Pastikan path benar
import Navbar from './components/Navbar';

import Home from './pages/Home';
import Cart from './pages/Cart';
import ProductDetail from './pages/ProductDetail';
import Login from './pages/Login';         
import Register from './pages/Register';   

function App() {
  return (
    <Provider store={store}>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/product/:id" element={<ProductDetail />} />
          <Route path="/login" element={<Login />} />        {/* Login Route */}
          <Route path="/register" element={<Register />} />  {/* Register Route */}
        </Routes>
      </Router>
    </Provider>
  );
}

export default App;


