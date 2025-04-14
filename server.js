const express = require('express'); 
const cors = require('cors');
const routes = require('./routes/routes.js'); 
const jwt = require('jsonwebtoken');

const app = express();  

const corsOptions = {
    origin: ['http://127.0.0.1:5500'],  
    credentials: true
};

const SECRET_KEY = 'meu-segredo';


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


app.use(cors(corsOptions));

app.use(express.json()); 


app.use('/', routes); 

app.listen(3000, () => {
    console.log("Servidor Rodando na porta: http://localhost:3000");
});


