import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Cart({ cart, setCart, token }) {
    const navigate = useNavigate();
    const [details, setDetails] = useState({ address: '', phone: '' });
    const [isSubmitting, setIsSubmitting] = useState(false);

    const total = cart.reduce((sum, item) => sum + item.price, 0);

    const removeItem = (index) => {
        const newCart = cart.filter((_, i) => i !== index);
        setCart(newCart);
    };

    const checkout = async (e) => {
        e.preventDefault();
        if (isSubmitting) {
            return;
        }

        setIsSubmitting(true);
        try {
            await axios.post('http://localhost:3000/api/orders', 
                { items: cart, total, shippingDetails: details },
                { headers: { Authorization: `Bearer ${token}` }}
            );
            
            alert('Замовлення оформлено!');
            
            setCart([]); 
            navigate('/orders');
        } catch (e) { 
            alert('Помилка при замовленні');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className='cart-page-container'>
            <h3>
                <span className='h-text-m'>Кошик</span>
                <span className='h-text-d'>:</span> 
            </h3>
            {cart.length === 0 ? (
                <div style={{ textAlign: 'center', marginTop: '50px' }}>
                    <p>Кошик порожній</p>
                    <button className='card-btn go-back' onClick={() => navigate('/')} style={{ padding: '10px 20px', cursor: 'pointer' }}>
                        Повернутися до магазину
                    </button>
                </div>
            ) : (
                <>
                    <div className='ct-list-container' style={{marginBottom: '20px' }}>
                        {cart.map((item, idx) => (

                            <div className='ct-card-container' key={`${item.id}-${idx}`}>
                                <img className='card-img' src={item.image}></img>
                                <div className='card-title'>{item.name}</div>
                                <br/>
                                <div className='price-container'>
                                    <span className='card-price-1'>Ціна:  </span>
                                    <span className='card-price-2'>{item.price} грн</span>
                                </div>

                                <button className='card-btn'
                                    onClick={() => removeItem(idx)} 
                                    style={{ color: '#FAFAFA', backgroundColor: '#E5A07B' }}
                                >
                                    Видалити
                                </button>
                            </div>
                        ))}
                    </div>

                    <div className='cart-f-container'>
                        <div className='centered'>
                            <h3>
                                <span className='h-text-m'>Оформити </span>
                                <span className='h-text-d'>замовлення</span> 
                            </h3>
                            <h4>Загальна вартість: {total} грн</h4>
                        </div>
                        <form onSubmit={checkout} style={{ marginTop: '30px', padding: '10px'}}>
                            <h4 className='centered h-text-m'style={{ marginTop: 0, fontSize: '14pt' }}>Доставка</h4>
                            <input 
                                type="text" placeholder="Адреса" required 
                                className='input-lg-reg delivery'                                
                                onChange={e => setDetails({...details, address: e.target.value})} 
                            />
                            <input 
                                type="tel" placeholder="Телефон" required 
                                className='input-lg-reg delivery'
                                onChange={e => setDetails({...details, phone: e.target.value})} 
                            />
                            <button 
                                type="submit" 
                                className='card-btn'
                                disabled={isSubmitting}
                                style={{ 
                                    width: '50%', padding: '10px', 
                                    marginTop: '25px',
                                    marginBottom: '20px',
                                    borderRadius: '25px',
                                    background: isSubmitting ? '#95a5a6' : '#E5A07B', 
                                    color: 'white', cursor: 'pointer' 
                                }}
                            >
                                {isSubmitting ? 'Обробка' : 'Підтвердити замовлення'}
                            </button>
                        </form>
                    </div>
                </>
            )}
        </div>
    );
}

export default Cart;