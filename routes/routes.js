const express = require('express');
const jwt = require('jsonwebtoken');
const db = require('../database.js');
const bcrypt = require('bcrypt');

const routes = express();

const SECRET_KEY = 'meu-segredo';

// Gerar Token
function generateToken(userId) {
    return jwt.sign({ userId }, SECRET_KEY, { expiresIn: '1h' });
}


function verificarAutenticacao(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ error: "Token não fornecido." });
    }

    jwt.verify(token, SECRET_KEY, (err, decoded) => {
        if (err) {
            return res.status(401).json({ error: "Token inválido ou expirado." });
        }

        req.userId = decoded.userId;
        next();
    });
}

// Rota de login
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

        const token = generateToken(user.rows[0].id);

        return res.status(200).json({
            message: "Login bem-sucedido!",
            token
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Erro interno do servidor" });
    }
});

// Rota de cadastro
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



//Rota Lista
routes.get('/lista', verificarAutenticacao, async (req, res) => {
    try {
        const userId = req.userId; 
        const result = await db.query('SELECT * FROM "CASH" WHERE id_user = $1', [userId]);

        if (result.rowCount === 0) {
            return res.status(404).json({ message: 'Não foi encontrado nenhum registro' });
        }

        return res.status(200).json({
            message: 'Registros listados com sucesso!',
            data: result.rows 
        });
    } catch (error) {
        console.error('Erro no servidor:', error.message);
        return res.status(500).json({ error: 'Erro interno no servidor' });
    }
});


//Rota Adicionar
routes.post('/adicionar', verificarAutenticacao, async(req,res) => {
    try{
        const userId = req.userId;
        const { expensive_category, expensive_spent, expensive_cash } = req.body;
        
        const result = await db.query(
            'INSERT INTO "CASH" (expensive_category, expensive_spent, expensive_cash, id_user) VALUES ($1, $2, $3, $4) RETURNING *',
            [expensive_category, expensive_spent, expensive_cash, userId]
        );

        if(result.rowCount === 0){
            return res.status(404).json({message: 'Não foi encontrado nenhum registro'})
        }

        return res.status(200).json({message: 'Registro incluído com sucesso!', data: result.rows})
        
    } catch(error){
        console.error('Error no servidor:', error.message);
        return res.status(500).json({error: 'Erro interno no servidor'})
    }
})

//Rota Excluir 
routes.delete('deletar', verificarAutenticacao, async(req, res) => {
    try{

    }catch(error){
        console.error('Error no servidor:', error.message);
        return res.status(500).json({error: 'Erro interno no servidor'})
    }
})






module.exports = routes;
