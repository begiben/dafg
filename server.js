const express = require('express');
const app = express();
const port = 3000;

app.use(express.json());
app.use(express.static('public'));

// База данных в памяти (для примера, в реальности используй SQLite или MongoDB)
let members = [];
let memberId = 1;

// Админские данные
const adminLogin = 'Sierra';
const adminPassword = 'Jk7b5djk!';

// Авторизация админа
app.post('/admin-login', (req, res) => {
    const { login, password } = req.body;
    if (login === adminLogin && password === adminPassword) {
        res.status(200).send();
    } else {
        res.status(401).send();
    }
});

// Добавление участника
app.post('/add-member', (req, res) => {
    const { name, telegram } = req.body;
    members.push({ id: memberId++, name, telegram });
    res.status(200).send();
});

// Получение списка участников
app.get('/members', (req, res) => {
    res.json(members);
});

// Удаление участника
app.delete('/delete-member/:id', (req, res) => {
    members = members.filter(m => m.id !== parseInt(req.params.id));
    res.status(200).send();
});

// Запуск сервера
app.listen(port, () => {
    console.log(`Сервер запущен на http://localhost:${port}`);
});
