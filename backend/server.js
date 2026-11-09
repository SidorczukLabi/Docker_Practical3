
const express = require('express');
const { Pool } = require('pg');
const path = require('path');

const app = express();
const PORT = 3000;

// Middleware для обробки JSON
app.use(express.json());

// Підключення до PostgreSQL
const pool = new Pool({
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 5432,
    database: process.env.DB_NAME || 'task_manager',
    user: process.env.DB_USER || 'admin',
    password: process.env.DB_PASSWORD || 'example_password'
});

// Відображення frontend
app.use(express.static(path.join(__dirname, 'frontend')));

// Перевірка роботи сервера
app.get('/api/health', (req, res) => {
    res.json({ status: 'OK' });
});

// Отримання всіх завдань
app.get('/api/tasks', async (req, res) => {
    try {
        const result = await pool.query(
            'SELECT * FROM tasks ORDER BY id DESC'
        );

        res.json(result.rows);
    } catch (error) {
        console.error('Error getting tasks:', error);
        res.status(500).json({ error: 'Failed to get tasks' });
    }
});

// Додавання нового завдання
app.post('/api/tasks', async (req, res) => {
    try {
        const { title } = req.body;

        if (!title || !title.trim()) {
            return res.status(400).json({
                error: 'Task title is required'
            });
        }

        const result = await pool.query(
            'INSERT INTO tasks (title) VALUES ($1) RETURNING *',
            [title.trim()]
        );

        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error('Error creating task:', error);
        res.status(500).json({ error: 'Failed to create task' });
    }
});

// Видалення завдання
app.delete('/api/tasks/:id', async (req, res) => {
    try {
        const result = await pool.query(
            'DELETE FROM tasks WHERE id = $1 RETURNING *',
            [req.params.id]
        );

        if (result.rowCount === 0) {
            return res.status(404).json({
                error: 'Task not found'
            });
        }

        res.json({ message: 'Task deleted' });
    } catch (error) {
        console.error('Error deleting task:', error);
        res.status(500).json({ error: 'Failed to delete task' });
    }
});

// Запуск сервера
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server is running on port ${PORT}`);
});
