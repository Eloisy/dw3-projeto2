const db = require("../../../database/databaseConfig");

// --- 1. FUNÇÃO GET ALL (Com Join para pegar o Nome do Tutor) ---
const getAllPets = async () => {
  return (
    await db.query(
      `SELECT 
        p.petid, 
        p.nome, 
        p.raca, 
        p.data_nascimento, 
        p.genero, 
        p.tutorid, 
        t.nome AS nome_tutor,  -- << NOVO CAMPO: Nome do Tutor
        p.deleted
       FROM pets p
       INNER JOIN tutores t ON p.tutorid = t.tutorid
       WHERE p.deleted = false 
       ORDER BY p.nome ASC`
    )
  ).rows;
};

// --- 2. FUNÇÃO GET BY ID (Com Join) ---
const getPetByID = async (petIDPar) => {
  return (
    await db.query(
      `SELECT 
        p.petid, 
        p.nome, 
        p.raca, 
        p.data_nascimento, 
        p.genero, 
        p.tutorid, 
        t.nome AS nome_tutor, -- << NOVO CAMPO
        p.deleted
       FROM pets p
       INNER JOIN tutores t ON p.tutorid = t.tutorid
       WHERE p.petid = $1 AND p.deleted = false`,
      [petIDPar]
    )
  ).rows;
};

// --- 3. FUNÇÃO INSERT ---
const insertPets = async (petREGPar) => {
  let linhasAfetadas;
  let msg = "ok";
  try {
    linhasAfetadas = (
      await db.query(
        "INSERT INTO pets (nome, raca, data_nascimento, genero, tutorid, deleted) " +
          "VALUES ($1, $2, $3, $4, $5, $6)",
        [
          petREGPar.nome,
          petREGPar.raca,
          petREGPar.data_nascimento,
          petREGPar.genero,
          petREGPar.tutorid, 
          false,
        ]
      )
    ).rowCount;
  } catch (error) {
    msg = "[mdlPets|insertPets] " + error.detail;
    linhasAfetadas = -1;
  }

  return { msg, linhasAfetadas };
};

// --- 4. FUNÇÃO UPDATE ---
const updatePets = async (petREGPar) => {
  let linhasAfetadas;
  let msg = "ok";
  try {
    linhasAfetadas = (
      await db.query(
        "UPDATE pets SET " +
          "nome = $2, " +
          "raca = $3, " +
          "data_nascimento = $4, " +
          "genero = $5, " +
          "tutorid = $6, " +
          "deleted = $7 " +
          "WHERE petid = $1",
        [
          petREGPar.petid,
          petREGPar.nome,
          petREGPar.raca,
          petREGPar.data_nascimento,
          petREGPar.genero,
          petREGPar.tutorid,
          petREGPar.deleted,
        ]
      )
    ).rowCount;
  } catch (error) {
    msg = "[mdlPets|updatePets] " + error.detail;
    linhasAfetadas = -1;
  }

  return { msg, linhasAfetadas };
};

// --- 5. FUNÇÃO DELETE ---
const deletePets = async (petREGPar) => {
  let linhasAfetadas;
  let msg = "ok";

  try {
    linhasAfetadas = (
      await db.query(
        "UPDATE pets SET deleted = true WHERE petid = $1",
        [petREGPar.petid]
      )
    ).rowCount;
  } catch (error) {
    msg = "[mdlPets|deletePets] " + error.detail;
    linhasAfetadas = -1;
  }

  return { msg, linhasAfetadas };
};

module.exports = {
  getAllPets,
  getPetByID,
  insertPets,
  updatePets,
  deletePets,
};