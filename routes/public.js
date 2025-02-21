const express = require('express');
const db = require('../database.js');
const path = require('path');

const routes = express();

routes.use(express.static(path.join(__dirname, '../templates')));

//Home
routes.get('/', (req,res) =>{
    res.sendFile(path.join(__dirname,'../templates', 'index.html'))
    res.status(200)
})

//Login
routes.get('/login', (req,res) =>{
    console.log("Usuário Logado com sucesso!")
    res.status(200)
})

//Cadastro
routes.get('/cadastro', (req,res) =>{

    console.log("Usuário Criado com sucesso!")
    res.status(201)
})  

//Usuários
routes.get("/usuarios", async (req, res) => {
    try {
        const result = await db.query('SELECT * FROM "USERS"');
        res.json(result.rows);
        res.status(200).json(result.rows);
        console.log("Consulta realizada com sucesso!")
      } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Erro ao buscar usuários" });
        console.log("Erro ao buscar usuários.")
      }
  });

module.exports = routes;