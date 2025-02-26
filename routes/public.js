const express = require('express');
const db = require('../database.js');
const bcrypt = require('bcrypt');
const path = require('path');
const { json } = require('stream/consumers');

const routes = express();

routes.use(express.json());


//Login
routes.post('/login', async (req,res) =>{

    const {username, password} = req.body

    if(!username || !password){
        return res.status(400).json({error: "Usarname ou password não foram preenchidos devidamente"})
    }
    
    try{
        const userExist = await db.query('SELECT * FROM "USERS" WHERE USERNAME LIKE $1', [username]);
        const passwordValidat = await db.query('SELECT * FROM "USERS" WHERE USERNAME LIKE $1 AND PASSWORD LIKE $2', [username, password])

        if(userExist.rows.length === 0){
            return res.status(400).json({error: "Usuário não encontrado"});
        }if(passwordValidat.rows.length === 0){
            return res.status(400).json({error: "Usuário ou senha incorretos"});
        }else{
            return res.status(200).json({message: 'Logando usuário'});
        }

    }catch(error){
        console.log(error);
        return res.status(500).json({error: 'Erro interno no servidor'});
    }
})

// Cadastro
routes.post('/cadastro', async (req, res) => {
    const { username, password, confirmpassword } = req.body;

    if (!username || !password || !confirmpassword) {
        return res.status(400).json({ error: "Todos os campos são obrigatórios." });
    }

    try {
        const userExist = await db.query('SELECT * FROM "USERS" WHERE username = $1', [username]);

        if (userExist.rowCount > 0) {
            return res.status(400).json({ error: "Usuário já existe" });
        }

    
        // const saltRounds = 10;
        // const cryptPassword = await bcrypt.hash(password, saltRounds);

        
        await db.query('INSERT INTO "USERS" (username, password) VALUES ($1, $2)', [username, password]);

        return res.status(201).json({ message: "Usuário cadastrado com sucesso!" });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Erro interno do servidor" });
    }
});


module.exports = routes;