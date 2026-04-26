const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const compression = require('compression');
const fs = require('fs');
const { products } = require('./data');

const USERS_FILE = './users.json';
const ORDERS_FILE = './orders.json';

const app = express();
const PORT = 3000;
const SECRET_KEY = 'super_secret_paws_key';

app.use(cors());
app.use(express.json());
app.use(compression());

const loadUsers = () => {
    if (!fs.existsSync(USERS_FILE)) {
        return [];
    }

    return JSON.parse(fs.readFileSync(USERS_FILE));
};

const saveUsers = (usersList) => {
    fs.writeFileSync(USERS_FILE, JSON.stringify(usersList, null, 2));
};

const loadOrders = () => {
    if (!fs.existsSync(ORDERS_FILE)) {
        return [];
    }
    return JSON.parse(fs.readFileSync(ORDERS_FILE));
};

const saveOrders = (ordersList) => {
    fs.writeFileSync(ORDERS_FILE, JSON.stringify(ordersList, null, 2));
};

let users = loadUsers();
let orders = loadOrders();

const getDynamicStatus = (createdAt) => {
    const diffInSeconds = (Date.now() - createdAt) / 1000;
    if (diffInSeconds < 10) {
        return "В обробці";
    }
    if (diffInSeconds < 20) {
        return "Комплектується";
    }
    if (diffInSeconds < 30) {
        return "Передано в кур'єрську службу";
    }
    return "Доставлено";
};

app.post('/api/register', async (req, res) => {
    const { username, password } = req.body;
    
    users = loadUsers();

    if (users.find(u => u.username === username)) {
        return res.status(400).json({ message: 'Користувач вже існує' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = { 
        id: Date.now(), 
        username, 
        password: hashedPassword,
        role: 'user'
    };
    
    users.push(newUser);
    saveUsers(users);

    const token = jwt.sign({ id: newUser.id, username: newUser.username }, SECRET_KEY, { expiresIn: '24h' });
    res.status(201).json({ token, message: 'Користувач успішно зареєстрований' });
});

app.post('/api/login', async (req, res) => {
    const { username, password } = req.body;
    
    users = loadUsers();
    const user = users.find(u => u.username === username);
    
    if (user && await bcrypt.compare(password, user.password)) {
        const token = jwt.sign({ id: user.id, username: user.username }, SECRET_KEY, { expiresIn: '24h' });
        res.json({ token });
    } else {
        res.status(401).json({ message: 'Невірний логін або пароль' });
    }
});

const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) {
        return res.sendStatus(401);
    }
    
    jwt.verify(token, SECRET_KEY, (err, user) => {
        if (err) {
            return res.sendStatus(403);
        }
        req.user = user;
        next();
    });
};

app.get('/api/products', (req, res) => res.json(products));

app.post('/api/orders', authenticateToken, (req, res) => {
    const { items, total, shippingDetails } = req.body;
    
    orders = loadOrders();
    
    const newOrder = {
        id: Date.now(),
        userId: req.user.id,
        items,
        total,
        shippingDetails,
        createdAt: Date.now()
    };
    
    orders.push(newOrder);
    saveOrders(orders);
    
    res.status(201).json({ id: newOrder.id });
});

app.get('/api/orders/my', authenticateToken, (req, res) => {
    orders = loadOrders();
    
    const myOrders = orders.filter(o => o.userId === req.user.id).map(o => ({
        ...o,
        status: getDynamicStatus(o.createdAt)
    }));
    
    res.json(myOrders);
});

app.get('/api/recommendations', authenticateToken, (req, res) => {
    orders = loadOrders();

    const userOrders = orders.filter(order => order.userId === req.user.id);

    if (userOrders.length === 0) {
        return res.json([]);
    }

    let boughtCategories = [];

    userOrders.forEach(order => {
        order.items.forEach(item => {
            if (!boughtCategories.includes(item.category)) {
                boughtCategories.push(item.category);
            }
        });
    });

    let recs = [];

    products.forEach(product => {
        const isInBoughtCategory = boughtCategories.includes(product.category);

        let alreadyBought = false;

        userOrders.forEach(order => {
            order.items.forEach(item => {
                if (item.id === product.id) {
                    alreadyBought = true;
                }
            });
        });
        if (isInBoughtCategory && !alreadyBought) {
            recs.push(product);
        }
    });

    recs = recs.slice(0, 4);
    res.json(recs);
});

app.listen(PORT, () => console.log(`Backend HappyPaws ready on port ${PORT}`));