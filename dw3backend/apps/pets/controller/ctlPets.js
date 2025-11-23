const mdlPets = require("../model/mdlPets");

const getAllPets = (req, res) =>
  (async () => {
    let registro = await mdlPets.getAllPets();
    res.json({ status: "ok", "registro": registro });
})();


const getPetByID = (req, res) =>
  (async () => {
    const petID = parseInt(req.body.petid);

    let registro = await mdlPets.getPetByID(petID);
    res.json({ status: "ok", "registro": registro });
})();


const insertPets = (request, res) =>
  (async () => {
    const petREG = request.body; 
    
    let { msg, linhasAfetadas } = await mdlPets.insertPets(petREG);
    
    res.json({ "status": msg, "linhasAfetadas": linhasAfetadas });
  })();


const updatePets = (request, res) =>
  (async () => {
    const petREG = request.body;
    let { msg, linhasAfetadas } = await mdlPets.updatePets(petREG);
    res.json({ "status": msg, "linhasAfetadas": linhasAfetadas });
})();


const deletePets = (request, res) =>
  (async () => {
    const petREG = request.body;
    
    let { msg, linhasAfetadas } = await mdlPets.deletePets(petREG);
    res.json({ "status": msg, "linhasAfetadas": linhasAfetadas });
  })();

module.exports = {
  getAllPets,
  getPetByID,
  insertPets,
  updatePets,
  deletePets
};