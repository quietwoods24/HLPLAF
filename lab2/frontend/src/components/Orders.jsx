import React, { useState, useEffect } from 'react';
import axios from 'axios';

function Orders({ token }) {
    const [orders, setOrders] = useState([]);

    const fetchOrders = () => {
        axios.get('http://localhost:3000/api/orders/my', {
            headers: { Authorization: `Bearer ${token}` }
        })
        .then(res => setOrders(res.data))
        .catch(err => console.error("Помилка завантаження:", err));
    };

    useEffect(() => {
        fetchOrders();
        const interval = setInterval(() => {
            fetchOrders();
        }, 5000);

        return () => clearInterval(interval);
    }, [token]);

    const getStatusStyle = (status) => {
        switch (status) {
            case 'В обробці': 
                return { color: '#E0AD6A', background: '#fdc07018', border: '1px solid #E0AD6A' };
            case 'Комплектується': 
                return { color: '#85b0e0', background: '#85b8f325', border: '1px solid #85b0e0' };
            case 'Передано в кур\'єрську службу': 
                return { color: '#595DAE', background: '#5a61e01a', border: '1px solid #595DAE' };
            case 'Доставлено': 
                return { color: '#4dc557', background: '#54f3611a', border: '1px solid #4dc557' };
            default: 
                return { color: '#7f8c8d', background: '#f4f6f6', border: '1px solid #7f8c8d' };
        }
    };

    return (
        <div style={{ padding: '30px', maxWidth: '1000px', margin: '0 auto' }}>
            <h3>
                <span className='h-text-m'>Мої </span>
                <span className='h-text-d'>замовлення:</span> 
            </h3>
            {orders.length === 0 ? (
                <div style={{ textAlign: 'center', marginTop: '50px', color: '#7f8c8d' }}>
                    <p>У вас ще немає замовлень.</p>
                </div>
            ) : (
                <div className='orders-container'>
                    {orders.slice().reverse().map(order => {
                        const style = getStatusStyle(order.status);
                        return (
                            <div className='order-card-container' key={order.id}>
                                <div>
                                    <div className='card-title'>Замовлення №{order.id}</div>
                                </div>
                                
                                <div style={{ color: '#34475E', fontSize: '0.95em' }}>
                                    <p style={{ margin: '5px 0' }}>Сума: <strong>{order.total} грн</strong></p>
                                    <p style={{ margin: '5px 0' }}>Адреса: {order.shippingDetails?.address || 'Не вказана'}</p>
                                    {/* <ul style={{ marginTop: '10px', paddingLeft: '20px', color: '#34475E' }}>
                                        {order.items.map((item, idx) => (
                                            <li key={idx}>{item.name} - {item.price} грн</li>
                                        ))}
                                    </ul> */}
                                </div>

                                <div className='status' style={{ 
                                        ...style 
                                    }}>
                                        {order.status.toUpperCase()}
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}

export default Orders;