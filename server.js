const express = require('express');  // Corrigido: Importando express corretamente
const cors = require('cors');
const session = require('express-session');
const routes = require('./routes/routes.js');

const app = express();  // Mudança de 'http' para 'express'

// Configuração do CORS
const corsOptions = {
    origin: ['http://127.0.0.1:5500'],  // Substitua pelo seu domínio de frontend em produção
    credentials: true
};

app.use(session({
    secret: 'meu-segredo', 
    resave: false,
    saveUninitialized: true,
    cookie: { 
        secure: false, // Defina como 'false' para desenvolvimento local
        httpOnly: true, // Aumenta a segurança ao impedir o acesso ao cookie via JavaScript
        sameSite: 'lax',
        maxAge: 24 * 60 * 60 * 1000  // Sessão dura 1 dia, ajustável conforme necessário
    }
}));


app.use(cors(corsOptions));

app.use(express.json());

app.use('/', routes); 
 

app.listen(3000, () => {
    console.log("Servidor Rodando na porta: http://localhost:3000");
});
