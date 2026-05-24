const express = require('express');
const { Op } = require('sequelize');
const { sequelize, User, Post, Comment, RequestLog, Like, Friend } = require('./models');

const app = express();
app.use(express.json());
app.use(express.static('public'));

const loggerMiddleware = async (req, res, next) => {
    try {
        // https://sequelize.org/docs/v6/core-concepts/model-instances/
        if (!req.url.startsWith('/admin/logs')) {
            await RequestLog.create({
                method: req.method,
                url: req.url,
                query_params: req.query,
                body: req.body
            });
        }
    } catch (error) {
        console.error('Помилка запису логу:', error);
    }
    next();
};

app.use(loggerMiddleware);

app.post('/users', async (req, res) => {
    try {
        const user = await User.create(req.body);
        res.status(201).json(user);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});


app.post('/posts', async (req, res) => {
    try {
        const { title, content, userId } = req.body;
        const post = await Post.create({ title, content, userId });
        res.status(201).json(post);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

app.post('/comments', async (req, res) => {
    try {
        const { text, userId, postId } = req.body;
        const comment = await Comment.create({ text, userId, postId });
        res.status(201).json(comment);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

app.post('/likes', async (req, res) => {
    try {
        const { userId, postId } = req.body;
        const existingLike = await Like.findOne({ where: { userId, postId } });
        
        if (existingLike) {
            await existingLike.destroy();
            return res.json({ message: 'Like removed successfully' });
        }        
        const like = await Like.create({ userId, postId });
        res.status(201).json(like);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

app.post('/friends', async (req, res) => {
    try {
        const { userId, friendId } = req.body;
        
        if (parseInt(userId) === parseInt(friendId)) {
            return res.status(400).json({ error: 'You cannot add yourself as a friend' });
        }
        const existingFriendship = await Friend.findOne({ where: { userId, friendId } });
        if (existingFriendship) {
            return res.status(400).json({ error: 'You are already friends' });
        }

        const friendship = await Friend.create({ userId, friendId });
        res.status(201).json(friendship);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

app.get('/posts', async (req, res) => {
    try {
        const { search, userId } = req.query;
        let whereClause = {};

        if (search) {
            whereClause = {
                [Op.or]: [
                    { title: { [Op.like]: `%${search}%` } },
                    { content: { [Op.like]: `%${search}%` } }
                ]
            };
        }

        if (userId) {
            whereClause.userId = userId;
        }
        // https://sequelize.org/docs/v6/core-concepts/model-querying-basics/
        const posts = await Post.findAll({
            where: whereClause,
            include: [
                { model: User, attributes: ['id', 'username'] },
                { model: Comment, attributes: ['id', 'text'] },
                { model: Like, attributes: ['id', 'userId'] }
            ],
            order: [['createdAt', 'DESC']]
        });

        res.json(posts);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});


app.get('/admin/logs', async (req, res) => {
    try {
        const limit = parseInt(req.query.limit) || 50;
        // https://sequelize.org/docs/v6/core-concepts/model-querying-basics/
        const logs = await RequestLog.findAll({
            order: [['timestamp', 'DESC']],
            limit: limit
        });
        
        res.json({
            total_logs_returned: logs.length,
            logs: logs
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

const PORT = process.env.PORT || 3000;

// https://metanit.com/web/nodejs/9.2.php
sequelize.sync({ alter: true })
    .then(() => {
        console.log('База даних успішно синхронізована.');
        app.listen(PORT, () => {
            console.log(`Сервер запущено на порту ${PORT}`);
        });
    })
    .catch(err => console.error('Помилка підключення до БД:', err));