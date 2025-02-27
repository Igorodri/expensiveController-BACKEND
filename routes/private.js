const express = require('express');
const db = require('../database.js');
const path = require('path');
const { json } = require('stream/consumers');

const routes = express()

routes.use(express.json())


//Listar
routes.get("/user", async (req,res) => {
  try{
    const {user_id} = req.body;

    if(!user_id){
      return res.status(400).json({error: 'Id de usuário não encontrado'});
    }

    const registros_user = await db.query('SELECT * FROM "CASH" WHERE USER = $1', [user_id]);

    if(registros_user.rows.length === 0){
      return res.status(400).json({error: 'Nenhum registro encontrado'});
    }else{
      return res.status(200).json({message: 'Registro listados com sucesso!'})
    }

  }catch(error){
    console.log(error);
    return res.status(500).json({error: 'Erro interno no servidor'});
  }
})

//Adicionar
routes.post("/add", async (req,res) => {
  
})

//Salvar
routes.post("/salvar", async (req,res) => {
  
})


//Deletar
routes.post("/delete", async (req,res) => {
  
})



//Lista admin Usuários
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