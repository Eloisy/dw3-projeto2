var express = require('express');
var router = express.Router();
var tutoresApp = require("../apps/tutores/controller/ctlTutores");

function authenticationMiddleware(req, res, next) {
    const isLogged = req.session.isLogged;
    if (!isLogged) {
        return res.redirect("/Login");
    }
    next();
};

// Rotas GET (Telas)
router.get('/manutTutores', authenticationMiddleware, tutoresApp.manutTutores);
router.get('/insertTutores', authenticationMiddleware, tutoresApp.insertTutores);
router.get('/viewTutores/:id', authenticationMiddleware, tutoresApp.viewTutores);
router.get('/updateTutores/:id', authenticationMiddleware, tutoresApp.updateTutores);

// Rotas POST (Ações)
router.post('/insertTutores', authenticationMiddleware, tutoresApp.insertTutores);
router.post('/updateTutores', authenticationMiddleware, tutoresApp.updateTutores);
router.post('/deleteTutores', authenticationMiddleware, tutoresApp.deleteTutores);

module.exports = router;