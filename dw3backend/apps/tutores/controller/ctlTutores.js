const mdlTutores = require("../model/mdlTutores");

const getAllTutores = async (req, res, next) => {
  try {
    const registro = await mdlTutor.getAllTutores(); 
    
    res.status(200).json({ status: "ok", registro });
  } catch (error) {
    console.error("Erro no Controller [getAllTutores]:", error);
    res.status(500).json({ message: "Erro interno ao buscar tutores." });
  }
};


const getTutoresByID = async (req, res, next) => {
    try {
        const Tutorid = req.params.id; //
        const registro = await mdlTutor.getTutoresByID(id);

        if (!registro) {
            return res.status(404).json({ message: "Tutor não encontrado ou inativo." });
        }
        res.status(200).json({ status: "ok", registro });
    }catch (error) {
        console.error("Erro no Controller [getTutoresByID]:", error);
        res.status(500).json({ message: "Erro interno ao buscar tutor por ID." });
    }
};


const insertTutores = async (req, res, next) => {
    try {
        const { nome, cpf, telefone, rua, numero, bairro, cidade } = req.body;
        
        if (!nome || !cpf) {
            return res.status(400).json({ message: "Nome e CPF são obrigatórios para o cadastro." });
        }

        const { msg, linhasAfetadas } = await mdlTutor.insertTutores(
            nome, cpf, telefone, rua, numero, bairro, cidade
        );
        
        if (linhasAfetadas > 0) {
            res.status(201).json({ 
                message: "Tutor inserido com sucesso!",
                status: msg 
            });
        } else {
            res.status(400).json({ message: "Falha ao inserir tutor.", status: msg });
        }
    } catch (error) {
        console.error("Erro no Controller [insertTutores]:", error);
        res.status(500).json({ message: "Erro interno no servidor." });
    }
};


const updateTutores = async (req, res, next) => {
    try {
        const tutorREGPar = req.body; //tutorregistroparametro
        
        if (!tutorREGPar.tutorid) {//se o id n estiver na atualização
            return res.status(400).json({ message: "ID do tutor é obrigatório para atualização." });
        }
        
        const { msg, linhasAfetadas } = await mdlTutor.updateTutores(tutorREGPar);
        
        if (linhasAfetadas > 0) {
            res.status(200).json({ 
                message: "Tutor atualizado com sucesso!",
                linhasAfetadas: linhasAfetadas,
                status: msg 
            });
        } else {
            res.status(404).json({ message: "Tutor não encontrado ou ID inválido.", status: msg });
        }
    } catch (error) {
        console.error("Erro no Controller [updateTutores]:", error);
        res.status(500).json({ message: "Erro interno no servidor." });
    }
};

const deleteTutores = async (req, res, next) => {
    try {
        const tutorREGPar = req.body; 
        
        const { msg, linhasAfetadas } = await mdlTutor.deleteTutores(tutorREGPar);
        
        if (linhasAfetadas > 0) {
            res.status(200).json({ 
                message: "Tutor desativado com sucesso (Soft Delete).",
                status: msg 
            });
        } else {
            res.status(404).json({ message: "Tutor não encontrado para desativação.", status: msg });
        }
    } catch (error) {
        console.error("Erro no Controller [deleteTutores]:", error);
        res.status(500).json({ message: "Erro interno no servidor." });
    }
};

module.exports = {
    getAllTutores,
    getTutoresByID,
    insertTutores,
    updateTutores,
    deleteTutores
};