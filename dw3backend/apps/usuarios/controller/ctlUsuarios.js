const mdlUsuarios = require("../model/mdlUsuarios");

const getAllUsuarios = (req, res) =>
  (async () => {
    let registro = await mdlUsuarios.getAllUsuarios();
    res.json({ status: "ok", "registro": registro });
  })();

const getUsuarioByID = (req, res) =>
  (async () => {
    const id = parseInt(req.body.usuarioid);
    let registro = await mdlUsuarios.getUsuarioByID(id);
    res.json({ status: "ok", "registro": registro });
  })();

const insertUsuarios = (request, res) =>
  (async () => {
    const reg = request.body;
    let { msg, linhasAfetadas } = await mdlUsuarios.insertUsuarios(reg);
    res.json({ "status": msg, "linhasAfetadas": linhasAfetadas });
  })();

const updateUsuarios = (request, res) =>
  (async () => {
    const reg = request.body;
    let { msg, linhasAfetadas } = await mdlUsuarios.updateUsuarios(reg);
    res.json({ "status": msg, "linhasAfetadas": linhasAfetadas });
  })();

const deleteUsuarios = (request, res) =>
  (async () => {
    const reg = request.body;
    let { msg, linhasAfetadas } = await mdlUsuarios.deleteUsuarios(reg);
    res.json({ "status": msg, "linhasAfetadas": linhasAfetadas });
  })();

module.exports = {
  getAllUsuarios,
  getUsuarioByID,
  insertUsuarios,
  updateUsuarios,
  deleteUsuarios
};