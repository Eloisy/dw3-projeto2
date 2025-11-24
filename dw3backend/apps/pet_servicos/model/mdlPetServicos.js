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

  return { msg, linhasAfetadas };
};

const updatePetServicos = async (regPar) => {
  let linhasAfetadas;
  let msg = "ok";
  try {
    linhasAfetadas = (
      await db.query(
        "UPDATE pet_servicos SET " +
          "petid = $2, " +
          "servicoid = $3, " +
          "data_servico = $4, " +
          "observacao = $5, " +
          "deleted = $6 " +
          "WHERE pet_servicoid = $1",
        [
          regPar.pet_servicoid,
          regPar.petid,
          regPar.servicoid,
          regPar.data_servico,
          regPar.observacao,
          regPar.deleted,
        ]
      )
    ).rowCount;
  } catch (error) {
    msg = "[mdlPetServicos|update] " + error.detail;
    linhasAfetadas = -1;
  }

  return { msg, linhasAfetadas };
};

const deletePetServicos = async (regPar) => {
  let linhasAfetadas;
  let msg = "ok";

  try {
    linhasAfetadas = (
      await db.query(
        "UPDATE pet_servicos SET deleted = true WHERE pet_servicoid = $1",
        [regPar.pet_servicoid]
      )
    ).rowCount;
  } catch (error) {
    msg = "[mdlPetServicos|delete] " + error.detail;
    linhasAfetadas = -1;
  }

  return { msg, linhasAfetadas };
};

module.exports = {
  getAllPetServicos,
  getPetServicoByID,
  insertPetServicos,
  updatePetServicos,
  deletePetServicos,
};