const http = require('express');
const cors = require('cors');
const publicRoutes = require('./routes/public.js');

const app = http()

const corsOptions = {
    origin: ['http://127.0.0.1:5500'], 
    methods: ['GET', 'POST', 'DELETE', 'PUT'],
  };

app.use(cors(corsOptions))

app.use(http.json());

app.use('/', publicRoutes)

app.use('/login', publicRoutes)

app.use('/cadastro', publicRoutes)

app.listen(3000, () => {
    console.log("Servidor Rodando na porta: http://localhost:3000")
})