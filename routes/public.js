const express = require('express');
const db = require('../database.js');
const bcrypt = require('bcrypt');
const path = require('path');
const { json } = require('stream/consumers');

const routes = express();

routes.use(express.json());


//Login
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


        return res.status(200).json({
            message: "Login bem-sucedido!",
            username: user.rows[0].username,
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

        return res.status(201).json({
            message: "Usuário cadastrado com sucesso!",
            username, 
            password 
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Erro interno do servidor" });
    }
});


//Login Admin
//admin
//admin@senha


module.exports = routes;