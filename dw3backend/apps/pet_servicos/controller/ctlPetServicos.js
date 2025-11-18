const mdlPetServicos = require("../model/mdlPetServicos");

const getAllPetServicos = (req, res) =>
  (async () => {
    let registro = await mdlPetServicos.getAllPetServicos();
    res.json({ status: "ok", "registro": registro });
  })();

const getPetServicoByID = (req, res) =>
  (async () => {
    const petServicoID = parseInt(req.body.pet_servicoid);
    let registro = await mdlPetServicos.getPetServicoByID(petServicoID);

    res.json({ status: "ok", "registro": registro });
  })();

const insertPetServicos = (request, res) =>
  (async () => {
    const reg = request.body;
    let { msg, linhasAfetadas } = await mdlPetServicos.insertPetServicos(reg);
    res.json({ "status": msg, "linhasAfetadas": linhasAfetadas });
  })();

const updatePetServicos = (request, res) =>
  (async () => {
    const reg = request.body;
    let { msg, linhasAfetadas } = await mdlPetServicos.updatePetServicos(reg);
    res.json({ "status": msg, "linhasAfetadas": linhasAfetadas });
  })();

const deletePetServicos = (request, res) =>
  (async () => {
    const reg = request.body;
    let { msg, linhasAfetadas } = await mdlPetServicos.deletePetServicos(reg);
    res.json({ "status": msg, "linhasAfetadas": linhasAfetadas });
  })();

module.exports = {
  getAllPetServicos,
  getPetServicoByID,
  insertPetServicos,
  updatePetServicos,
  deletePetServicos
};