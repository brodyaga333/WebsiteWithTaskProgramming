require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const { sequelize, User, Problem } = require('./models');

async function start() {
    try {
        await sequelize.authenticate();
        console.log('✅ PostgreSQL connected via Sequelize');

        await sequelize.sync();
        console.log('✅ Tables synced with models');

        const app = express();
        app.use(cors());
        app.use(express.json());

        // Подключение статики
        app.use(express.static(path.join(__dirname, 'public')));

        // Отдача главной страницы
        app.get('/', (req, res) => {
            res.sendFile(path.join(__dirname, 'public', 'index.html'));
        });

        // Тестовый роут
        app.get('/test-user', async (req, res) => {
            const [user] = await User.findAll({ limit: 1 });
            res.json(user || {});
        });

        // Получение всех задач
        app.get('/api/problems', async (req, res) => {
            try {
                const problems = await Problem.findAll();
                res.json(problems);
            } catch (err) {
                console.error(err);
                res.status(500).json({ error: 'Ошибка получения задач' });
            }
        });

        const PORT = process.env.PORT || 4000;
        app.listen(PORT, () => console.log(`🚀 Listening on http://localhost:${PORT}`));
    } catch (err) {
        console.error('❌ Unable to connect to DB:', err);
    }
}

start();
