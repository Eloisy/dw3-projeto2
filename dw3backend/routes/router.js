const express = require("express");
const routerApp = express.Router();

// --- IMPORTS ---
const appUsuarios = require("../apps/usuarios/controller/ctlUsuarios");
const appTutores = require("../apps/tutores/controller/ctlTutores");
const appPets = require("../apps/pets/controller/ctlPets");
const appLogin = require("../apps/login/controller/ctlLogin");
const appServicos = require("../apps/servicos/controller/ctlServicos");
const appPetServicos = require("../apps/pet_servicos/controller/ctlPetServicos");

// Middleware padrão
routerApp.use((req, res, next) => {
  next();
});

routerApp.get("/", (req, res) => {
  res.send("Olá mundo!");
});

// --- ROTAS DE USUÁRIOS ---
routerApp.get("/getAllUsuarios", appLogin.AutenticaJWT, appUsuarios.getAllUsuarios);
routerApp.post("/getUsuarioByID", appLogin.AutenticaJWT, appUsuarios.getUsuarioByID);
routerApp.post("/insertUsuarios", appLogin.AutenticaJWT, appUsuarios.insertUsuarios);
routerApp.post("/updateUsuarios", appLogin.AutenticaJWT, appUsuarios.updateUsuarios);
routerApp.post("/deleteUsuarios", appLogin.AutenticaJWT, appUsuarios.deleteUsuarios);

// --- ROTAS DE TUTORES ---
routerApp.get("/getAllTutores", appLogin.AutenticaJWT, appTutores.getAllTutores);
routerApp.post("/getTutoresByID", appLogin.AutenticaJWT, appTutores.getTutoresByID);
routerApp.post("/insertTutores", appLogin.AutenticaJWT, appTutores.insertTutores);
routerApp.post("/updateTutores", appLogin.AutenticaJWT, appTutores.updateTutores);
routerApp.post("/deleteTutores", appLogin.AutenticaJWT, appTutores.deleteTutores);


// --- ROTAS DE PETS ---
routerApp.get("/getAllPets", appLogin.AutenticaJWT, appPets.getAllPets);
routerApp.post("/getPetByID", appLogin.AutenticaJWT, appPets.getPetByID);
routerApp.post("/insertPets", appLogin.AutenticaJWT, appPets.insertPets);
routerApp.post("/updatePets", appLogin.AutenticaJWT, appPets.updatePets);
routerApp.post("/deletePets", appLogin.AutenticaJWT, appPets.deletePets);


// --- ROTAS DE SERVIÇOS ---
routerApp.get("/getAllServicos", appLogin.AutenticaJWT, appServicos.getAllServicos);
routerApp.post("/getServicoByID", appLogin.AutenticaJWT, appServicos.getServicoByID);
routerApp.post("/insertServicos", appLogin.AutenticaJWT, appServicos.insertServicos);
routerApp.post("/updateServicos", appLogin.AutenticaJWT, appServicos.updateServicos);
routerApp.post("/deleteServicos", appLogin.AutenticaJWT, appServicos.deleteServicos); 

// --- ROTAS DE PET_SERVICOS (ATENDIMENTOS) ---
routerApp.get("/getAllPetServicos", appLogin.AutenticaJWT, appPetServicos.getAllPetServicos);
routerApp.post("/getPetServicoByID", appLogin.AutenticaJWT, appPetServicos.getPetServicoByID);
routerApp.post("/insertPetServicos", appLogin.AutenticaJWT, appPetServicos.insertPetServicos);
routerApp.post("/updatePetServicos", appLogin.AutenticaJWT, appPetServicos.updatePetServicos);
routerApp.post("/deletePetServicos", appLogin.AutenticaJWT, appPetServicos.deletePetServicos);

// --- ROTAS DE LOGIN ---
routerApp.post("/Login", appLogin.Login);
routerApp.post("/Logout", appLogin.Logout);

module.exports = routerApp;