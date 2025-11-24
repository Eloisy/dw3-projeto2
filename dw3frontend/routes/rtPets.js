// dw3frontend/routes/rtPets.js
var express = require('express');
var router = express.Router();

function authenticationMiddleware(req, res, next) {
    if (!req.session.isLogged) return res.redirect("/Login");
    next();
}

router.get('/', authenticationMiddleware, function (req, res, next) {
    parametros = { title: 'Módulos > Pets', userName: req.session.userName };
    res.render('pets/view/vwPets.njk', { parametros });
});

router.get('/manutencao', authenticationMiddleware, function (req, res, next) {
    parametros = { title: 'Módulos > Pets > Manutenção', userName: req.session.userName };
    res.render('pets/view/vwPetManutencao.njk', { parametros });
});

module.exports = router;