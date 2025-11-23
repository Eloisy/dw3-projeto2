const db = require("../../../database/databaseconfig");
const bcrypt = require("bcryptjs"); 

const getAllUsuarios = async () => {
  return (
    await db.query(
      "SELECT usuarioid, username, deleted FROM usuarios WHERE deleted = false ORDER BY username ASC"
    )
  ).rows;
};

const getUsuarioByID = async (idPar) => {
  return (
    await db.query(
      "SELECT usuarioid, username, deleted FROM usuarios WHERE usuarioid = $1 AND deleted = false",
      [idPar]
    )
  ).rows;
};

const insertUsuarios = async (regPar) => {
  let linhasAfetadas;
  let msg = "ok";
  try {
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(regPar.password, salt);

    linhasAfetadas = (
      await db.query(
        "INSERT INTO usuarios (username, password, deleted) VALUES ($1, $2, $3)",
        [
          regPar.username,
          hash,
          false, // deleted
        ]
      )
    ).rowCount;
  } catch (error) {
    msg = "[mdlUsuarios|insert] " + error.detail;
    linhasAfetadas = -1;
  }

  return { msg, linhasAfetadas };
};

const updateUsuarios = async (regPar) => {
  let linhasAfetadas;
  let msg = "ok";
  try {

    if (regPar.password) {
        const salt = bcrypt.genSaltSync(10);
        const hash = bcrypt.hashSync(regPar.password, salt);
        
        linhasAfetadas = (
            await db.query(
              "UPDATE usuarios SET username = $2, password = $3, deleted = $4 WHERE usuarioid = $1",
              [regPar.usuarioid, regPar.username, hash, regPar.deleted]
            )
          ).rowCount;
    } else {
        linhasAfetadas = (
            await db.query(
              "UPDATE usuarios SET username = $2, deleted = $3 WHERE usuarioid = $1",
              [regPar.usuarioid, regPar.username, regPar.deleted]
            )
          ).rowCount;
    }

  } catch (error) {
    msg = "[mdlUsuarios|update] " + error.detail;
    linhasAfetadas = -1;
  }

  return { msg, linhasAfetadas };
};

const deleteUsuarios = async (regPar) => {
  let linhasAfetadas;
  let msg = "ok";

  try {
    linhasAfetadas = (
      await db.query(
        "UPDATE usuarios SET deleted = true WHERE usuarioid = $1",
        [regPar.usuarioid]
      )
    ).rowCount;
  } catch (error) {
    msg = "[mdlUsuarios|delete] " + error.detail;
    linhasAfetadas = -1;
  }

  return { msg, linhasAfetadas };
};

module.exports = {
  getAllUsuarios,
  getUsuarioByID,
  insertUsuarios,
  updateUsuarios,
  deleteUsuarios,
};