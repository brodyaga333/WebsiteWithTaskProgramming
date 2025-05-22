require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const { sequelize, Problem } = require('./models');  // Импорт модели Problem

async function start() {
    try {
        await sequelize.authenticate();
        console.log('✅ PostgreSQL connected');

        // НЕ делаем force: true, чтобы не стирать данные при каждом старте
        await sequelize.sync(); // просто синхронизация без удаления данных

        const app = express();
        app.use(cors());
        app.use(express.json());

        // Маршрут /api/problems
        app.get('/api/problems', async (req, res) => {
            try {
                // Получаем уровень сложности из query, по умолчанию 'beginner'
                const difficulty = (req.query.difficulty || 'beginner').toLowerCase().trim();

                // Получаем задачи из базы по difficulty
                const problems = await Problem.findAll({
                    where: { difficulty }
                });

                console.log(`Задачи difficulty=${difficulty}: ${problems.length}`);

                res.json(problems);
            } catch (err) {
                console.error(err);
                res.status(500).json({ error: 'Ошибка сервера при получении задач' });
            }
        });

        app.use(express.static(path.join(__dirname, 'public')));

        const PORT = process.env.PORT || 4000;
        app.listen(PORT, () => console.log(`🚀 Server: http://localhost:${PORT}`));

    } catch (err) {
        console.error('❌ Fatal error:', err);
    }
}

start();
