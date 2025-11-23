var express = require('express');
var router = express.Router();
function authenticationMiddleware(req, res, next) {
    if (!req.session.isLogged) return res.redirect("/Login");
    next();
}

router.get('/', authenticationMiddleware, function (req, res, next) {
    parametros = { title: 'Módulos > Atendimentos', userName: req.session.userName };
    res.render('petservicos/view/index.njk', { parametros });
});

module.exports = router;