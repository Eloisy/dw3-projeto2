const axios = require("axios");
const moment = require("moment");

// 1. listagem
const manutPets = async (req, res) =>
  (async () => {
    const userName = req.session.userName;
    const token = req.session.token;

    const resp = await axios.get(process.env.SERVIDOR_DW3Back + "/getAllPets", {
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
      res.render("pets/view/vwManutPets.njk", {
        title: "Manutenção de Pets",
        data: null,
        erro: remoteMSG,
        userName: userName,
      });
    });

    if (!resp) return;

    res.render("pets/view/vwManutPets.njk", {
      title: "Manutenção de Pets",
      data: resp.data.registro,
      erro: null,
      userName: userName,
    });
  })();

// 2. inserção
const insertPets = async (req, res) =>
  (async () => {
    if (req.method == "GET") {
      const token = req.session.token;

      const tutores = await axios.get(process.env.SERVIDOR_DW3Back + "/getAllTutores", {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        }
      });

      return res.render("pets/view/vwFCrPets.njk", {
        title: "Cadastro de Pets",
        data: null,
        erro: null,
        tutores: tutores.data.registro,
        userName: null,
      });

    } else {
      const regData = req.body;
      const token = req.session.token;

      try {
        const response = await axios.post(process.env.SERVIDOR_DW3Back + "/insertPets", regData, {
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



// 3. só visualizar
const viewPets = async (req, res) =>
  (async () => {
    const userName = req.session.userName;
    const token = req.session.token;
    try {
      if (req.method == "GET") {
        const id = req.params.id;
        
        const response = await axios.post(process.env.SERVIDOR_DW3Back + "/getPetByID",
          { petid: id },
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: "Bearer " + token,
            },
          }
        );

        if (response.data.status == "ok") {
          const tutores = await axios.get(process.env.SERVIDOR_DW3Back + "/getAllTutores", {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`
            }
          });

          if (response.data.registro[0].data_nascimento) {
            response.data.registro[0].data_nascimento = moment(response.data.registro[0].data_nascimento).format("YYYY-MM-DD");
          }

          res.render("pets/view/vwFRUDrPets.njk", {
            title: "Visualização de Pets",
            data: response.data.registro[0],
            tutores: tutores.data.registro,
            disabled: true,
            userName: userName,
          });
        }
      }
    } catch (erro) {
      console.log(erro);
    }
  })();



// 4. atualizar
const updatePets = async (req, res) =>
  (async () => {
    const userName = req.session.userName;
    const token = req.session.token;
    try {
      if (req.method == "GET") {
        const id = req.params.id;
        
        const response = await axios.post(process.env.SERVIDOR_DW3Back + "/getPetByID",
          { petid: id },
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: "Bearer " + token,
            },
          }
        );

        if (response.data.status == "ok") {
          const tutores = await axios.get(process.env.SERVIDOR_DW3Back + "/getAllTutores", {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`
            }
          });

          if (response.data.registro[0].data_nascimento) {
            response.data.registro[0].data_nascimento = moment(response.data.registro[0].data_nascimento).format("YYYY-MM-DD");
          }

          res.render("pets/view/vwFRUDrPets.njk", {
            title: "Atualização de Pets",
            data: response.data.registro[0],
            tutores: tutores.data.registro,
            disabled: false,
            userName: userName,
          });
        }
      } else {
        const regData = req.body;
        const token = req.session.token;
        try {
          const response = await axios.post(process.env.SERVIDOR_DW3Back + "/updatePets", regData, {
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



// 5. soft delete
const deletePets = async (req, res) =>
  (async () => {
    const regData = req.body;
    const token = req.session.token;

    try {
      const response = await axios.post(process.env.SERVIDOR_DW3Back + "/deletePets", regData, {
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
  manutPets,
  insertPets,
  viewPets,
  updatePets,
  deletePets
};