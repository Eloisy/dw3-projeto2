const db = require("../../../database/databaseconfig");

const getAllTutores = async () => {
    return (
        await db.query(
            "SELECT tutorid, nome, cpf, telefone, rua, numero, bairro, cidade FROM tutores WHERE deleted = false ORDER BY nome ASC"
        )
    ).rows;
};


const getTutoresByID = async (idPar) => {
    return (
        await db.query(
            "SELECT tutorid, nome, cpf, telefone, rua, numero, bairro, cidade FROM tutores WHERE tutorid = $1 AND deleted = false", 
            [idPar]
        )
    ).rows[0];
};

const insertTutores = async (nomePar, cpfPar, telefonePar, ruaPar, numeroPar, bairroPar, cidadePar) => {
    
    let linhasAfetadas;
    let msg = "ok";
    
    try {
        linhasAfetadas = (
            await db.query(
                "INSERT INTO tutores (nome, cpf, telefone, rua, numero, bairro, cidade) " +
                "VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING tutorid",
                [
                    nomePar,
                    cpfPar,
                    telefonePar,
                    ruaPar,
                    numeroPar,
                    bairroPar,
                    cidadePar,
                ]
            )
        ).rowCount;
        
    } catch (error) {
        msg = "[mdlTutor|insert] " + error.detail;
        linhasAfetadas = -1; 
    }

    return { msg, linhasAfetadas };
};

const updateTutores = async (tutorREGPar) => {
    
    let linhasAfetadas;
    let msg = "ok";
    
    try {
        linhasAfetadas = (
            await db.query(
                "UPDATE tutores SET " +
                "nome = $2, " +
                "cpf = $3, " +
                "telefone = $4, " +
                "rua = $5, " +
                "numero = $6, " +
                "bairro = $7, " +
                "cidade = $8 " +
                "WHERE tutorid = $1",
                [
                    tutorREGPar.tutorid,
                    tutorREGPar.nome,
                    tutorREGPar.cpf,
                    tutorREGPar.telefone,
                    tutorREGPar.rua,
                    tutorREGPar.numero,
                    tutorREGPar.bairro,
                    tutorREGPar.cidade,
                ]
            )
        ).rowCount;
        
    } catch (error) {
        msg = "[mdlTutor|update] " + error.detail;
        linhasAfetadas = -1;
    }

    return { msg, linhasAfetadas };
};

const deleteTutores = async (tutorREGPar) => {
    
    let linhasAfetadas;
    let msg = "ok";
    
    try {
        linhasAfetadas = (
            await db.query(
                "UPDATE tutores SET " + 
                "deleted = true " + 
                "WHERE tutorid = $1",
                [
                    tutorREGPar.tutorid
                ]
            )
        ).rowCount;
        
    } catch (error) {
        msg = "[mdlTutor|deleteTutor] " + error.detail;
        linhasAfetadas = -1;
    }

    return { msg, linhasAfetadas };
};


module.exports = {
    getAllTutores,
    getTutoresByID,
    insertTutores, 
    updateTutores,
    deleteTutores
};