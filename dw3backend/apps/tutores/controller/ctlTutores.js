const mdlTutores = require("../model/mdlTutores");


//busca todos os tutores
const getAllTutores = async (req, res, next) => {
  try {
    const registro = await mdlTutores.getAllTutores(); 
    res.status(200).json({ status: "ok", registro });

  } catch (error) {
    console.error("Erro no Controller [getAllTutores]:", error);
    res.status(500).json({ message: "Erro interno ao buscar tutores." });
  }
};


//busca por id (tutor especificio)
const getTutoresByID = async (req, res, next) => {
    try {
        const id = req.body.tutorid;
        const registro = await mdlTutores.getTutoresByID(id);

        if (!registro) {
            return res.status(404).json({ message: "Tutor não encontrado ou inativo." });
        }
        res.status(200).json({ status: "ok", registro: [registro] });    
    }catch (error) {
        console.error("Erro no Controller [getTutoresByID]:", error);
        res.status(500).json({ message: "Erro interno ao buscar tutor por ID." });
    }
};

//inserção dos tutores
const insertTutores = async (req, res, next) => {
    try {
        const { nome, cpf, telefone, rua, numero, bairro, cidade } = req.body;
        
        if (!nome || !cpf) {
            return res.status(400).json({ message: "Nome e CPF são obrigatórios para o cadastro." });
        }

        const { msg, linhasAfetadas } = await mdlTutores.insertTutores(
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


//ataulização de tutor
const updateTutores = async (req, res, next) => {
    try {
        const tutorREGPar = req.body; //tutorregistroparametro
        
        if (!tutorREGPar.tutorid) {//se o id n estiver na atualização
            return res.status(400).json({ message: "ID do tutor é obrigatório para atualização." });
        }
        
        const { msg, linhasAfetadas } = await mdlTutores.updateTutores(tutorREGPar);
        
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


//soft delete dos tutores
const deleteTutores = async (req, res, next) => {
    try {
        const tutorREGPar = req.body; 
        
        if (!tutorREGPar.tutorid) {
            return res.status(400).json({ message: "ID do tutor é obrigatório para deletar." });
        }

        const { msg, linhasAfetadas } = await mdlTutores.deleteTutores(tutorREGPar);
        
        if (linhasAfetadas > 0) {
            res.status(200).json({ 
                message: "Tutor desativado com sucesso (Soft Delete).",
                linhasAfetadas: linhasAfetadas,
                status: msg 
            });
        } else {
            res.status(404).json({ message: "Tutor não encontrado ou ID inválido para desativação.", status: msg });
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