import React, { useState, useEffect } from 'react';
import axios from 'axios';

function Catalog({ addToCart, token }) {
    const [products, setProducts] = useState([]);
    const [recs, setRecs] = useState([]);
    const [addedId, setAddedId] = useState(null);

    useEffect(() => {
        axios.get('http://localhost:3000/api/products').then(res => setProducts(res.data));
        axios.get('http://localhost:3000/api/recommendations', { headers: { Authorization: `Bearer ${token}` }})
             .then(res => setRecs(res.data));
    }, [token]);

    const handleAdd = (product) => {
        addToCart(product);
        setAddedId(product.id);
        setTimeout(() => setAddedId(null), 1000);
    };

    return (
        <div className='catalogue-container'>
            {recs.length > 0 && (
                <section className='favourites-container'>
                    <h3>
                        <span className='h-text-m'>Рекомендовані </span>
                        <span className='h-text-d'>товари:</span> 
                    </h3>
                    <div className='f-card-list-container'>
                        {recs.map(p => (
                            <div className='f-card-container' key={p.id}>
                                <img className='card-img' src={p.image}></img>
                                <div className='card-title'>{p.name}</div>
                                <br/>
                                <div className='price-container'>
                                    <span className='card-price-1'>Ціна:  </span>
                                    <span className='card-price-2'>{p.price} грн</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            )}

            <h3>
                <span className='h-text-m'>Каталог </span>
                <span className='h-text-d'>товарів:</span> 
            </h3>
            <div className='cat-list-container'>
                {products.map(p => (
                    
                    <div className='c-card-container' key={p.id}>
                        <img className='card-img' src={p.image}></img>
                        <div className='card-title'>{p.name}</div>
                        <br/>
                            <div className='price-container'>
                                <span className='card-price-1'>Ціна:  </span>
                                <span className='card-price-2'>{p.price} грн</span>
                            </div>
                        <button className='card-btn'
                            onClick={() => handleAdd(p)}
                            style={{ 
                                background: addedId === p.id ? '#94DC87' : '#34475E'
                            }}
                        >
                            {addedId === p.id ? 'Додано' : 'Додати'}
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Catalog;