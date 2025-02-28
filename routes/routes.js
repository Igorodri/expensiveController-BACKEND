const express = require('express');
const session = require('express-session');
const db = require('../database.js');
const bcrypt = require('bcrypt');
const path = require('path');

const routes = express()

routes.use(express.json());
routes.use(express.urlencoded({ extended: true }));

routes.use(session({
    secret: 'meu-segredo', 
    resave: false,
    saveUninitialized: true,
    cookie: { 
        secure: false, 
        httpOnly: true, 
        sameSite: 'lax'
    }
}));


// Login
routes.post('/login', async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ error: "Username e senha são obrigatórios." });
    }

    try {
        const user = await db.query('SELECT * FROM "USERS" WHERE username = $1', [username]);

        if (user.rowCount === 0) {
            return res.status(400).json({ error: "Usuário não encontrado." });
        }

        const isMatch = await bcrypt.compare(password, user.rows[0].password);

        if (!isMatch) {
            return res.status(400).json({ error: "Senha incorreta." });
        }

        req.session.user_id = user.rows[0].id;

        // Log para verificar o conteúdo da sessão
        console.log("Sessão após login:", req.session); 

        return res.status(200).json({
            message: "Login bem-sucedido!",
            user_id: req.session.user_id
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Erro interno do servidor" });
    }
});


// Cadastro
routes.post('/cadastro', async (req, res) => {
    const { username, password, confirmpassword } = req.body;

    if (!username || !password || !confirmpassword) {
        return res.status(400).json({ error: "Todos os campos são obrigatórios." });
    }

    if (password !== confirmpassword) {
        return res.status(400).json({ error: "As senhas não coincidem." });
    }

    try {
        const userExist = await db.query('SELECT * FROM "USERS" WHERE username = $1', [username]);

        if (userExist.rowCount > 0) {
            return res.status(400).json({ error: "Usuário já existe" });
        }

        const saltRounds = 10;
        const cryptPassword = await bcrypt.hash(password, saltRounds); 

        await db.query('INSERT INTO "USERS" (username, password) VALUES ($1, $2)', [username, cryptPassword]);

        return res.status(201).json({ message: "Usuário cadastrado com sucesso!" });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Erro interno do servidor" });
    }
});


// Middleware de Verificação da Sessão
function checkSession(req, res, next) {
    console.log("Sessão no middleware checkSession:", req.session);  // Verifique aqui se o user_id está sendo passado
    if (req.session.user_id) {
        next();
    } else {
        res.status(401).json({ error: "Sessão inválida. Faça login novamente." });
    }
}



// Rota Salvar (Privada)
routes.post('/salvar', checkSession, async (req, res) => {
    const { expensive_category, expensive_spent, expensive_cash } = req.body;

    if (!expensive_category || !expensive_spent || !expensive_cash) {
        return res.status(400).json({ error: 'Todos os campos são obrigatórios' });
    }

    try {
        await db.query(
            'INSERT INTO "CASH" (expensive_category, expensive_spent, expensive_cash, id_user) VALUES ($1, $2, $3, $4)',
            [expensive_category, expensive_spent, expensive_cash, req.session.user_id]
        );

        return res.status(201).json({ message: 'Registro inserido com sucesso' });
    } catch (error) {
        console.error('Erro no servidor:', error);
        return res.status(500).json({ error: 'Erro interno no servidor' });
    }
});

// Logout
routes.post('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            return res.status(500).json({ error: "Erro ao tentar deslogar." });
        }
        res.status(200).json({ message: "Deslogado com sucesso!" });
    });
});

module.exports = routes;
