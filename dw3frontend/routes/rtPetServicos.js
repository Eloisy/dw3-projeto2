var express = require('express');
var router = express.Router();

//@ Middleware de autenticação
function authenticationMiddleware(req, res, next) {
    if (!req.session.isLogged) {
        return res.redirect("/Login");
    }
    next();
}

/* GET Rota de Listagem/CRUD: /petservicos */
router.get('/', authenticationMiddleware, function (req, res, next) {
    parametros = { title: 'Módulos > Atendimentos', userName: req.session.userName };
    res.render('pet_servicos/view/vwAtendimentos.njk', { parametros });
});

/* GET Rota de Manutenção: /petservicos/manutencao */
router.get('/manutencao', authenticationMiddleware, function (req, res, next) {
    parametros = { title: 'Módulos > Atendimentos > Manutenção', userName: req.session.userName };
    res.render('pet_servicos/view/vwAtendimentoManutencao.njk', { parametros });
});

module.exports = router;