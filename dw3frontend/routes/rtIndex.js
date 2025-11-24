// dw3frontend/routes/rtIndex.js
var express = require('express');
var router = express.Router();
var loginApp = require("../apps/login/controller/ctlLogin"); 
var clientLoginProcessor = require('../apps/login/controller/ctlLogin_client'); 


//@ Middleware de autenticação 
function authenticationMiddleware(req, res, next) {
    if (!req.session.isLogged) {
        return res.redirect("/Login");
    }
    next();
};

// --- ROTAS DE NAVEGAÇÃO PROTEGIDAS ---

router.get('/', authenticationMiddleware, function (req, res, next) {
    res.redirect('/home');
});

router.get('/home', authenticationMiddleware, function (req, res, next) {
    parametros = { title: 'Home', userName: req.session.userName };
    res.render('home/view/index.njk', { parametros });
});

// --- ROTAS DE AUTENTICAÇÃO (LOGIN/LOGOUT) ---
router.get('/Login', loginApp.Login);
router.get('/Logout', loginApp.Logout); 


router.post('/Login', clientLoginProcessor.processClientLogin);
router.post('/Logout', loginApp.Logout); 

module.exports = router;