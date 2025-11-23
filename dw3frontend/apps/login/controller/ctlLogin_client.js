// dw3frontend/apps/login/controller/ctlLogin_client.js

const processClientLogin = (req, res) => {
    const { token, username } = req.body;

    if (token && username) {
        req.session.isLogged = true;
        req.session.token = token;
        req.session.userName = username;

        return res.status(200).json({ status: "ok", message: "Session created" });
    }
    
    return res.status(400).json({ status: "error", message: "Token or username missing" });
};

module.exports = {
    processClientLogin
};