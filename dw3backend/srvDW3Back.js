// DEBUG=srvBack:* npm start

require('dotenv').config();

//import das bibliotecas
const express = require('express');
const cors =require('cors');
const app = express();


const router = require('./routes/router'); //rota
const port = process.env.PORT; //porta


app.use(express.json()); // entender o json q vai vir
app.use(cors()); // o front vai podr acessar o serv do back
app.use('/', router);//define as rtas principais


app.listen(port, () => {
  console.log(`Servidor Back-end rodando na porta ${port}`);
})