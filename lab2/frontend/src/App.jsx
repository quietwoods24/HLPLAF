import React, { useState, useEffect, Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import axios from 'axios';

const Catalog = lazy(() => import('./components/Catalog'));
const Cart = lazy(() => import('./components/Cart'));
const Orders = lazy(() => import('./components/Orders'));

const API_URL = 'http://localhost:3000/api';

function App() {
    const [token, setToken] = useState(localStorage.getItem('token') || '');
    const [cart, setCart] = useState(() => {
        const savedCart = localStorage.getItem('cart');
        return savedCart ? JSON.parse(savedCart) : [];
    });    
    const [isRegistering, setIsRegistering] = useState(false);
    const [authData, setAuthData] = useState({ username: '', password: '' });

    useEffect(() => {
        localStorage.setItem('cart', JSON.stringify(cart));
    }, [cart]);

    const handleAuth = async (e) => {
        e.preventDefault();
        const endpoint = isRegistering ? '/register' : '/login';
        
        try {
            const res = await axios.post(`${API_URL}${endpoint}`, authData);
            
            const token = res.data.token;
            
            if (token) {
                setToken(token);
                localStorage.setItem('token', token);
            }
        } catch (err) { 
            alert(err.response?.data?.message || 'Помилка аутентифікації'); 
        }
    };

    const logout = () => { 
        setToken(''); 
        localStorage.removeItem('token'); 

        setCart([]);
        localStorage.removeItem('cart');
    };

    return (
        <Router>
            <div className='container'>
                <nav className='nav-panel'>
                    <div className='logo'>
                        <span className='logo-text-d'>H</span>
                        <span className='logo-text-l'>appy</span>
                        <span className='logo-text-d'>P</span>
                        <span className='logo-text-l'>aws</span>
                    </div>
                    <div>
                        <Link to="/" className='nav-link-text'>
                            Каталог
                        </Link>
                        <Link to="/cart" className='nav-link-text'>
                            Кошик ({cart.length})
                        </Link>
                        {token && <Link to="/orders" className='nav-link-text'>
                            Мої замовлення
                        </Link>}
                        {token && <button className='nav-btn' onClick={logout}>
                            Вихід
                        </button>}
                    </div>
                </nav>

                {!token ? (
                    <div className='lg-reg-container'>
                        <h2 className='heading-1'>
                            {isRegistering ? 'Реєстрація' : 'Вхід'}
                        </h2>
                        <form onSubmit={handleAuth}>
                            <input type="text" placeholder="Логін..." className='input-lg-reg' 
                                onChange={e => setAuthData({...authData, username: e.target.value})} required />
                            <input type="password" placeholder="Пароль..." className='input-lg-reg' 
                                onChange={e => setAuthData({...authData, password: e.target.value})} required />
                            <button type="submit" className='btn-submit lg-rg'>
                                {isRegistering ? 'Зареєструватися' : 'Увійти'}
                            </button>
                        </form>

                        <p className='lg-reg-link' onClick={() => setIsRegistering(!isRegistering)}>
                            {isRegistering ? 'Вже є акаунт? Увійти' : 'Немає акаунту? Реєстрація'}
                        </p>
                    </div>
                ) : (
                    <Suspense fallback={<h2 style={{ textAlign: 'center' }}>Зачекайте, йде завантаження</h2>}>
                        <Routes>
                            <Route path="/" element={<Catalog addToCart={p => setCart([...cart, p])} token={token} />} />
                            <Route path="/cart" element={<Cart cart={cart} setCart={setCart} token={token} />} />
                            <Route path="/orders" element={<Orders token={token} />} />
                        </Routes>
                    </Suspense>
                )}
            </div>
        </Router>
    );
}

export default App;