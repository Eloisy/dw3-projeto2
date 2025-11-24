const mdlPetServicos = require("../model/mdlPetServicos");

//busca todos os atendimentos
const getAllPetServicos = (req, res) =>
  (async () => {
    let registro = await mdlPetServicos.getAllPetServicos();
    res.json({ status: "ok", "registro": registro });
})();

//busca um atendimento especifico 
const getPetServicoByID = (req, res) =>
  (async () => {
    const petServicoID = parseInt(req.body.pet_servicoid);
    let registro = await mdlPetServicos.getPetServicoByID(petServicoID);

    res.json({ status: "ok", "registro": registro });
})();


//insere um serviço
const insertPetServicos = (request, res) =>
  (async () => {
    const reg = request.body;
    let { msg, linhasAfetadas } = await mdlPetServicos.insertPetServicos(reg);
    res.json({ "status": msg, "linhasAfetadas": linhasAfetadas });
})();

//atualiza o serviço
const updatePetServicos = (request, res) =>
  (async () => {
    const reg = request.body;
    let { msg, linhasAfetadas } = await mdlPetServicos.updatePetServicos(reg);
    res.json({ "status": msg, "linhasAfetadas": linhasAfetadas });
  })();


//deleta as paradas  
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