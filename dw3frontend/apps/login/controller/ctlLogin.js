const axios = require("axios");

const Login = async (req, res) =>
  (async () => {
    if (req.method == "POST") {
      const formData = req.body;

      const resp = await axios.post(process.env.SERVIDOR_DW3Back + "/login", formData, {
        headers: {
          "Content-Type": "application/json",
        },
        timeout: 3000, 
      }).catch(error => {
          const msg = error.response?.data?.message || "Login inválido ou erro no servidor!";
          return res.status(400).json({ status: "error", msg: msg });
      });

      if (!resp || !resp.data) {
        return;
      }

      req.session.isLogged = true;
      req.session.userName = resp.data.username;
      req.session.token = resp.data.token; 

      return res.json({ status: "ok", msg: "Login com sucesso!" });

    } else { 
      res.render("login/view/vwLogin.njk", { title: "Login PetCare" });
    }
  })();

const Logout = (req, res) => {
  req.session.destroy();
  res.redirect("/Login");
};

module.exports = {
  Login,
  Logout,
};