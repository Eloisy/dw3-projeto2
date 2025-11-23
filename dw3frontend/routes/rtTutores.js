var express = require('express');
var router = express.Router();
function authenticationMiddleware(req, res, next) {
    if (!req.session.isLogged) return res.redirect("/Login");
    next();
}

router.get('/', authenticationMiddleware, function (req, res, next) {
    parametros = { title: 'Módulos > Tutores', userName: req.session.userName };
    res.render('tutores/view/vwTutores.njk', { parametros });
});

router.get('/manutencao', authenticationMiddleware, function (req, res, next) {
    parametros = { title: 'Módulos > Tutores > Manutenção', userName: req.session.userName };
    res.render('tutores/view/vwTutorManutencao.njk', { parametros });
});

module.exports = router;