var express = require('express');
var router = express.Router();
var petsApp = require("../apps/pets/controller/ctlPets");

function authenticationMiddleware(req, res, next) {
    const isLogged = req.session.isLogged;
    if (!isLogged) {
        return res.redirect("/Login");
    }
    next();
};

router.get('/manutPets', authenticationMiddleware, petsApp.manutPets);
router.get('/insertPets', authenticationMiddleware, petsApp.insertPets);
router.get('/viewPets/:id', authenticationMiddleware, petsApp.viewPets);
router.get('/updatePets/:id', authenticationMiddleware, petsApp.updatePets);


router.post('/insertPets', authenticationMiddleware, petsApp.insertPets);
router.post('/updatePets', authenticationMiddleware, petsApp.updatePets);
router.post('/deletePets', authenticationMiddleware, petsApp.deletePets);

module.exports = router;