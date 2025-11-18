const express = require("express");
const routerApp = express.Router();

const appTutores = require("../apps/tutores/controller/ctlTutores");
const appPets = require("../apps/pet/controller/ctlPets");
const appLogin = require("../apps/login/controller/ctlLogin");
const appServicos = require("../apps/servicos/controller/ctlServicos");
const appPetServicos = require("../apps/pet_servicos/controller/ctlPetServicos");

// middleware that is specific to this router
routerApp.use((req, res, next) => {
  next();
});

routerApp.get("/", (req, res) => {
  res.send("Olá mundo!");
});

//Rotas de Tutores
routerApp.get("/getAllTutores", appLogin.AutenticaJWT, appTutores.getAllTutores);
routerApp.post("/getTutoresByID", appLogin.AutenticaJWT, appTutores.getTutoresByID);
routerApp.post("/insertTutores", appLogin.AutenticaJWT, appTutores.insertTutores);
routerApp.post("/updateTutores", appLogin.AutenticaJWT, appTutores.updateTutores);
routerApp.post("/deleteTutores", appLogin.AutenticaJWT, appTutores.deleteTutores);


//Rotas de Pets
routerApp.get("/getAllPets", appLogin.AutenticaJWT, appPets.getAllPets);
routerApp.post("/getPetByID", appLogin.AutenticaJWT, appPets.getPetByID);
routerApp.post("/insertPets", appLogin.AutenticaJWT, appPets.insertPets);
routerApp.post("/updatePets", appLogin.AutenticaJWT, appPets.updatePets);
routerApp.post("/deletePets", appLogin.AutenticaJWT, appPets.deletePets);

//Rotas de servicos
routerApp.get("/getAllServicos", appLogin.AutenticaJWT, appServicos.getAllServicos);
routerApp.post("/getServicoByID", appLogin.AutenticaJWT, appServicos.getServicoByID);
routerApp.post("/insertServicos", appLogin.AutenticaJWT, appServicos.insertServicos);
routerApp.post("/updateServicos", appLogin.AutenticaJWT, appServicos.updateServicos);
routerApp.post("/deleteServicos", appLogin.AutenticaJWT, appServicos.deleteServicos);

//Rotas de pet_servico
routerApp.get("/getAllPetServicos", appLogin.AutenticaJWT, appPetServicos.getAllPetServicos);
routerApp.post("/getPetServicoByID", appLogin.AutenticaJWT, appPetServicos.getPetServicoByID);
routerApp.post("/insertPetServicos", appLogin.AutenticaJWT, appPetServicos.insertPetServicos);
routerApp.post("/updatePetServicos", appLogin.AutenticaJWT, appPetServicos.updatePetServicos);
routerApp.post("/deletePetServicos", appLogin.AutenticaJWT, appPetServicos.deletePetServicos);

// Rota Login
routerApp.post("/Login", appLogin.Login);
routerApp.post("/Logout", appLogin.Logout);

module.exports = routerApp;