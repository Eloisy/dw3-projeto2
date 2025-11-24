var express = require('express');
var router = express.Router();

function authenticationMiddleware(req, res, next) {
    if (!req.session.isLogged) return res.redirect("/Login");
    next();
}

/* GET Rota de Listagem/CRUD: /servicos */
router.get('/', authenticationMiddleware, function (req, res, next) {
    parametros = { title: 'Módulos > Serviços', userName: req.session.userName };
    res.render('servicos/view/vwServicos.njk', { parametros });
});

/* GET Rota de Manutenção: /servicos/manutencao */
router.get('/manutencao', authenticationMiddleware, function (req, res, next) {
    parametros = { title: 'Módulos > Serviços > Manutenção', userName: req.session.userName };
    res.render('servicos/view/vwServicoManutencao.njk', { parametros });
});

module.exports = router;