const axios = require("axios");

// 1. listar
const manutTutores = async (req, res) =>
  (async () => {
    const userName = req.session.userName;
    const token = req.session.token;

    const resp = await axios.get(process.env.SERVIDOR_DW3Back + "/getAllTutores", {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      }
    }).catch(error => {
      let remoteMSG;
      if (error.code === "ECONNREFUSED") {
        remoteMSG = "Servidor indisponível";
      } else if (error.code === "ERR_BAD_REQUEST") {
        remoteMSG = "Usuário não autenticado";
      } else {
        remoteMSG = error;
      }
      res.render("tutores/view/vwManutTutores.njk", {
        title: "Manutenção de Tutores",
        data: null,
        erro: remoteMSG,
        userName: userName,
      });
    });

    if (!resp) return;

    res.render("tutores/view/vwManutTutores.njk", {
      title: "Manutenção de Tutores",
      data: resp.data.registro,
      erro: null,
      userName: userName,
    });
  })();

// 2. inserir
const insertTutores = async (req, res) =>
  (async () => {
    if (req.method == "GET") {
      return res.render("tutores/view/vwFCrTutores.njk", {
        title: "Cadastro de Tutores",
        data: null,
        erro: null,
        userName: null,
      });

    } else {
      const regData = req.body;
      const token = req.session.token;

      try {
        const response = await axios.post(process.env.SERVIDOR_DW3Back + "/insertTutores", regData, {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          timeout: 5000,
        });

        res.json({
          status: response.data.status,
          msg: response.data.status,
          data: response.data,
          erro: null,
        });
      } catch (error) {
        console.error('Erro ao inserir:', error.message);
        res.json({
          status: "Error",
          msg: error.message,
          data: null,
          erro: null,
        });
      }
    }
  })();



// 3. visu
const viewTutores = async (req, res) =>
  (async () => {
    const userName = req.session.userName;
    const token = req.session.token;
    try {
      if (req.method == "GET") {
        const id = req.params.id;
        
        const response = await axios.post(
          process.env.SERVIDOR_DW3Back + "/getTutoresByID",
          { tutorid: id },
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: "Bearer " + token,
            },
          }
        );

        if (response.data.status == "ok") {
          res.render("tutores/view/vwFRUDrTutores.njk", {
            title: "Visualização de Tutores",
            data: response.data.registro[0],
            disabled: true,
            userName: userName,
          });
        }
      }
    } catch (erro) {
      console.log(erro);
      res.json({ status: "Error", msg: "Erro ao visualizar" });
    }
  })();

// 4. atualizar
const updateTutores = async (req, res) =>
  (async () => {
    const userName = req.session.userName;
    const token = req.session.token;
    try {
      if (req.method == "GET") {
        const id = req.params.id;
        
        const response = await axios.post(
          process.env.SERVIDOR_DW3Back + "/getTutoresByID",
          { tutorid: id },
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: "Bearer " + token,
            },
          }
        );

        if (response.data.status == "ok") {
          res.render("tutores/view/vwFRUDrTutores.njk", {
            title: "Atualização de Tutores",
            data: response.data.registro[0],
            disabled: false,
            userName: userName,
          });
        }
      } else {
        const regData = req.body;
        const token = req.session.token;
        try {
          const response = await axios.post(process.env.SERVIDOR_DW3Back + "/updateTutores", regData, {
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            },
            timeout: 5000,
          });

          res.json({
            status: response.data.status,
            msg: response.data.status,
            data: response.data,
            erro: null,
          });
        } catch (error) {
          res.json({
            status: "Error",
            msg: error.message,
            data: null,
            erro: null,
          });
        }
      }
    } catch (erro) {
      console.log(erro);
    }
  })();

// 5. DELETAR
const deleteTutores = async (req, res) =>
  (async () => {
    const regData = req.body;
    const token = req.session.token;

    try {
      const response = await axios.post(process.env.SERVIDOR_DW3Back + "/deleteTutores", regData, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        timeout: 5000,
      });

      res.json({
        status: response.data.status,
        msg: response.data.status,
        data: response.data,
        erro: null,
      });
    } catch (error) {
      res.json({
        status: "Error",
        msg: error.message,
        data: null,
        erro: null,
      });
    }
  })();

module.exports = {
  manutTutores,
  insertTutores,
  viewTutores,
  updateTutores,
  deleteTutores
};