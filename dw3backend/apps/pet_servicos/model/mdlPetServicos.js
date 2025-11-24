const db = require("../../../database/databaseConfig");

// --- 1. FUNÇÃO GET ALL ---
const getAllPetServicos = async () => {
  return (
    await db.query(
      `SELECT 
        ps.pet_servicoid,
        ps.data_servico,
        ps.observacao,
        ps.petid,
        p.nome AS nome_pet,
        t.nome AS nome_tutor,   -- <<< NOVO: Nome do Tutor
        ps.servicoid,
        s.nome AS nome_servico,
        s.valor
      FROM pet_servicos ps
      INNER JOIN pets p ON ps.petid = p.petid
      INNER JOIN tutores t ON p.tutorid = t.tutorid -- <<< JOIN com Tutores
      INNER JOIN servicos s ON ps.servicoid = s.servicoid
      WHERE ps.deleted = false 
      ORDER BY ps.data_servico DESC`
    )
  ).rows;
};


// --- 2. FUNÇÃO GET BY ID ---
const getPetServicoByID = async (petServicoIDPar) => {
  return (
    await db.query(
      `SELECT 
        ps.pet_servicoid,
        ps.data_servico,
        ps.observacao,
        ps.petid,
        p.nome AS nome_pet,
        t.nome AS nome_tutor,   -- <<< NOVO: Nome do Tutor
        ps.servicoid,
        s.nome AS nome_servico,
        s.valor
      FROM pet_servicos ps
      INNER JOIN pets p ON ps.petid = p.petid
      INNER JOIN tutores t ON p.tutorid = t.tutorid -- <<< JOIN com Tutores
      INNER JOIN servicos s ON ps.servicoid = s.servicoid
      WHERE ps.pet_servicoid = $1 AND ps.deleted = false`,
      [petServicoIDPar]
    )
  ).rows;
};


const insertPetServicos = async (regPar) => {
  let linhasAfetadas;
  let msg = "ok";
  try {
    linhasAfetadas = (
      await db.query(
        "INSERT INTO pet_servicos (petid, servicoid, data_servico, observacao, deleted) " +
          "VALUES ($1, $2, $3, $4, $5)",
        [
          regPar.petid,
          regPar.servicoid,
          regPar.data_servico,
          regPar.observacao,
          false, // deleted
        ]
      )
    ).rowCount;
  } catch (error) {
    msg = "[mdlPetServicos|insert] " + error.detail;
    linhasAfetadas = -1;
  }


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