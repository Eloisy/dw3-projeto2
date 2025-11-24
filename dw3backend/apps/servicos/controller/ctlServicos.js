const mdlServicos = require("../model/mdlServicos");

//busca todos os serviços
const getAllServicos = (req, res) =>
  (async () => {
    let registro = await mdlServicos.getAllServicos();
    res.json({ status: "ok", "registro": registro });
})();


//busca específica
const getServicoByID = (req, res) =>
  (async () => {
    const servicoID = parseInt(req.body.servicoid);

    let registro = await mdlServicos.getServicoByID(servicoID);
    res.json({ status: "ok", "registro": registro });
})();


//inserção de novo serviço
const insertServicos = (request, res) =>
  (async () => {
    const servicoREG = request.body;
    
    let { msg, linhasAfetadas } = await mdlServicos.insertServicos(servicoREG);
    res.json({ "status": msg, "linhasAfetadas": linhasAfetadas });
  
})();


//ataulização
const updateServicos = (request, res) =>
  (async () => {
    const servicoREG = request.body;

    let { msg, linhasAfetadas } = await mdlServicos.updateServicos(servicoREG);
    res.json({ "status": msg, "linhasAfetadas": linhasAfetadas });
})();


//apagar esse trem
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