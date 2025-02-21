const http = require('express');
const publicRoutes = require('./routes/public.js');

const app = http()

app.use(http.json());

app.use('/', publicRoutes)

app.listen(3000, () => {
    console.log("Servidor Rodando na porta: http://localhost:3000")
})