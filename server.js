require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const { sequelize, Problem } = require('./models');

async function start() {
    try {
        await sequelize.authenticate();
        console.log('✅ PostgreSQL connected');

        // Автоматическое создание таблиц (только для разработки!)
        await sequelize.sync({ alter: true });

        const app = express();
        app.use(cors());
        app.use(express.json());

        app.use((req, res, next) => {
            res.setHeader('Content-Type', 'application/json; charset=utf-8');
            next();
        });

        app.use(express.static(path.join(__dirname, 'public')));

        // Роут для фильтрации задач
        app.get('/api/problems', async (req, res) => {
            try {
                const whereClause = req.query.difficulty
                    ? { where: { difficulty: req.query.difficulty } }
                    : {};

                const problems = await Problem.findAll(whereClause);
                res.json(problems);
            } catch (err) {
                res.status(500).json({ error: 'Ошибка получения задач' });
            }
        });

        // Добавление задачи (опционально)
        app.post('/api/problems', async (req, res) => {
            try {
                const problem = await Problem.create(req.body);
                res.status(201).json(problem);
            } catch (err) {
                res.status(500).json({ error: 'Ошибка создания задачи' });
            }
        });

        const PORT = process.env.PORT || 4000;
        app.listen(PORT, () => console.log(`🚀 Server: http://localhost:${PORT}`));

    } catch (err) {
        console.error('❌ Fatal error:', err);
    }
}

start();