const db = require("../../../database/databaseconfig");

const getAllServicos = async () => {
  return (
    await db.query(
      "SELECT * FROM servicos WHERE deleted = false ORDER BY nome ASC"
    )
  ).rows;
};

const getServicoByID = async (servicoIDPar) => {
  return (
    await db.query(
      "SELECT * FROM servicos WHERE servicoid = $1 AND deleted = false ORDER BY nome ASC",
      [servicoIDPar]
    )
  ).rows;
};

const insertServicos = async (servicoREGPar) => {
  let linhasAfetadas;
  let msg = "ok";
  try {
    linhasAfetadas = (
      await db.query(
        "INSERT INTO servicos (nome, descricao, valor, deleted) " +
          "VALUES ($1, $2, $3, $4)",
        [
          servicoREGPar.nome,
          servicoREGPar.descricao,
          servicoREGPar.valor,
          false, // deleted
        ]
      )
    ).rowCount;
  } catch (error) {
    msg = "[mdlServicos|insertServicos] " + error.detail;
    linhasAfetadas = -1;
  }

  return { msg, linhasAfetadas };
};

const updateServicos = async (servicoREGPar) => {
  let linhasAfetadas;
  let msg = "ok";
  try {
    linhasAfetadas = (
      await db.query(
        "UPDATE servicos SET " +
          "nome = $2, " +
          "descricao = $3, " +
          "valor = $4, " +
          "deleted = $5 " +
          "WHERE servicoid = $1",
        [
          servicoREGPar.servicoid,
          servicoREGPar.nome,
          servicoREGPar.descricao,
          servicoREGPar.valor,
          servicoREGPar.deleted,
        ]
      )
    ).rowCount;
  } catch (error) {
    msg = "[mdlServicos|updateServicos] " + error.detail;
    linhasAfetadas = -1;
  }

  return { msg, linhasAfetadas };
};

const deleteServicos = async (servicoREGPar) => {
  let linhasAfetadas;
  let msg = "ok";

  try {
    linhasAfetadas = (
      await db.query(
        "UPDATE servicos SET deleted = true WHERE servicoid = $1",
        [servicoREGPar.servicoid]
      )
    ).rowCount;
  } catch (error) {
    msg = "[mdlServicos|deleteServicos] " + error.detail;
    linhasAfetadas = -1;
  }

  return { msg, linhasAfetadas };
};

module.exports = {
  getAllServicos,
  getServicoByID,
  insertServicos,
  updateServicos,
  deleteServicos,
};