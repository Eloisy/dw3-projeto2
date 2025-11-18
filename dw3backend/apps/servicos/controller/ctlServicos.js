const mdlServicos = require("../model/mdlServicos");

const getAllServicos = (req, res) =>
  (async () => {
    let registro = await mdlServicos.getAllServicos();
    res.json({ status: "ok", "registro": registro });
  })();

const getServicoByID = (req, res) =>
  (async () => {
    const servicoID = parseInt(req.body.servicoid);

    let registro = await mdlServicos.getServicoByID(servicoID);
    res.json({ status: "ok", "registro": registro });
  })();

const insertServicos = (request, res) =>
  (async () => {
    const servicoREG = request.body;
    let { msg, linhasAfetadas } = await mdlServicos.insertServicos(servicoREG);
    res.json({ "status": msg, "linhasAfetadas": linhasAfetadas });
  })();

const updateServicos = (request, res) =>
  (async () => {
    const servicoREG = request.body;

    let { msg, linhasAfetadas } = await mdlServicos.updateServicos(servicoREG);
    res.json({ "status": msg, "linhasAfetadas": linhasAfetadas });
  })();

const deleteServicos = (request, res) =>
  (async () => {
    const servicoREG = request.body;
    
    let { msg, linhasAfetadas } = await mdlServicos.deleteServicos(servicoREG);
    res.json({ "status": msg, "linhasAfetadas": linhasAfetadas });
  })();

module.exports = {
  getAllServicos,
  getServicoByID,
  insertServicos,
  updateServicos,
  deleteServicos
};