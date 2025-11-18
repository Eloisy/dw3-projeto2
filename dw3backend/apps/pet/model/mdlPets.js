const db = require("../../../database/databaseconfig");

const getAllPets = async () => {
  return (
    await db.query(
      "SELECT * FROM pets WHERE deleted = false ORDER BY nome ASC" //soft delete
    )
  ).rows;
};

const getPetByID = async (petIDPar) => { //petIDPar -parâmetro local que o mdl  usa para poder salvar o conteudo q rcb do ctl
  return (
    await db.query(
      "SELECT * FROM pets WHERE petid = $1 AND deleted = false ORDER BY nome ASC",
      [petIDPar]
    )
  ).rows;
};

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