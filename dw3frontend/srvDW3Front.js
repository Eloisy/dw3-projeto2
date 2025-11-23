var express = require('express');
var nunjucks = require('nunjucks');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var path = require('path');

const envFilePath = path.resolve(__dirname, './srvDW3Front.env');
require('dotenv').config({ path: envFilePath });

const port = process.env.PORT || 30000;

// --- IMPORTAÇÃO DAS ROTAS ---
var rtIndex = require('./routes/rtIndex');
var rtTutores = require('./routes/rtTutores'); 
var rtPets = require('./routes/rtPets');    
// var rtServicos = require('./routes/rtServicos'); 
// var rtPetServicos = require('./routes/rtPetServicos');

var app = express();

nunjucks.configure('apps', {
    autoescape: true,
    express: app,
    watch: true
});

app.use(express.static(__dirname));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(
  session({
    secret: process.env.JWTCHAVE, 
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: null },
  })
);

app.use('/', rtIndex);
app.use('/tutores', rtTutores);
app.use('/pets', rtPets); 

app.listen(port, () => {
  console.log(`Servidor Front-end rodando na porta ${port}!`);
});