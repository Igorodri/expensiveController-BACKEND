const express = require('express');
const db = require('../database.js');
const path = require('path');

const routes = express();

routes.use(express.static(path.join(__dirname, '../templates')));


//Login
routes.post('/login', async (req,res) =>{
    try{
        const {username, password} = req.body
        
        const result = await db.query('SELECT * FROM "USERS" WHERE username = $1', [username]);

        if (result.rows.length === 0){
            return res.status(400).json({message: 'Usuário não encontrado'});
        }

        const user = result.rows[0]

        const Match = await bcrypt.compare(password, user.password);

        if(!Match){
            return res.status(400).json({message: 'Senha incorreta'});
        }

        const token = jwt.sign({id: user.id, user: user.username}, SECRET_KEY, {expiresIn: '1h'});

        return res.json({message: 'Login Bem-sucedido', token});
    }
    catch (err){    
        console.log("Erro no servidor: ", err)
        return res.status(500).json({messagem: 'Erro interno no servidor. Tente novamente em breve'})
    }
})

//Cadastro
routes.post('/cadastro', (req,res) =>{

    console.log("Usuário Criado com sucesso!")
    res.status(201)
})  

module.exports = routes;