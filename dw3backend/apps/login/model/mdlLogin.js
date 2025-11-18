const db = require("../../../database/databaseconfig");

const GetCredencial = async (loginPar) => { //busca o usuário no banco
  return (
    await db.query(
      "select username, password " +
        "from usuarios where username = $1 and deleted = false",
      [loginPar]
    )
  ).rows;
};

module.exports = {
  GetCredencial,
};