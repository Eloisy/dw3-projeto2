var express = require('express');
var router = express.Router();
var loginApp = require("../apps/login/controller/ctlLogin");

function authenticationMiddleware(req, res, next) {
  
  console.log("------------------------------------------------");
  console.log("[DEBUG] Tentando acessar a Home...");
  
  const cookieLogado = req.cookies ? req.cookies.isLogged : undefined;
  console.log("1. Cookie 'isLogged':", cookieLogado);

  const sessaoLogada = req.session ? req.session.isLogged : undefined;
  console.log("2. Sessão 'isLogged':", sessaoLogada);

  const isLogged = sessaoLogada || cookieLogado;

  if (!isLogged) {
    console.log(">>> FALHA: Ninguém apresentou crachá. Redirecionando para Login.");
    return res.redirect("/Login");
  }
  
  console.log(">>> SUCESSO: Acesso liberado!");
  next();
};

router.get('/', authenticationMiddleware, function (req, res, next) {
  const userName = (req.session && req.session.userName) ? req.session.userName : "Usuário";
  res.render('home/view/index.njk', { title: 'Home', Usuario: userName });
});

router.get('/Login', loginApp.Login);
router.post('/Login', loginApp.Login);
router.get('/Logout', loginApp.Logout);

module.exports = router;